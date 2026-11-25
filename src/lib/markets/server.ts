/**
 * Server-side data loader for public `/markets` and `/markets/[slug]` pages.
 *
 * Fetches quarterly closed-sales trends (`get_closed_sales_trends_by_*_v2`) and
 * weekly rent trends (`get_rent_trends_by_*`) through `fetchPublicRpc` with
 * Next.js data caching. Coerces Postgres numeric/bigint string payloads safely
 * and degrades gracefully if an individual RPC call fails.
 */
import { unstable_cache } from "next/cache";
import type { RentTrendRow, SalesTrendRowV2 } from "@/db/rpc";
import { stableStringify } from "@/db/rpc/trends-rpc-client";
import { fetchPublicRpc } from "@/lib/rpc-prefetch";
import { BAY_AREA_MARKETS, type MarketConfig } from "./catalog";

const MARKET_CACHE_TTL_SECONDS = 3600;
const MONTHS_PER_BUCKET = 3; // Quarterly buckets balance freshness with reliable sample sizes.
const SERIES_LOOKBACK_YEARS = 5;

export type QuarterlySalesPoint = {
    /** Bucket start date (`YYYY-MM-DD`). */
    bucketStart: string;
    /** Human quarter label, e.g. "Q3 2026". */
    quarterLabel: string;
    medianPricePerDoor: number;
    avgPricePerDoor: number | null;
    p25PricePerDoor: number | null;
    p75PricePerDoor: number | null;
    medianCapRate: number | null;
    avgCapRate: number | null;
    salesCount: number;
    capRateCount: number;
};

export type MarketSnapshot = {
    market: MarketConfig;
    /** Trailing 12-month (last 4 quarters) weighted/median summary stats. */
    latestQuarterLabel: string | null;
    windowStart: string | null;
    windowEnd: string | null;
    medianCapRate: number | null;
    capRateSampleCount: number;
    medianPricePerDoor: number | null;
    p25PricePerDoor: number | null;
    p75PricePerDoor: number | null;
    salesCount12Mo: number;
    salesCountTotal: number;
    /** YoY % change in median $/door comparing latest quarter to same quarter ~1 year earlier. */
    pricePerDoorYoYPct: number | null;
    /** Latest weekly median asking rents (1BR and 2BR) for quick underwriting context. */
    medianRent1Br: number | null;
    medianRent2Br: number | null;
    /** Quarterly time series (up to 5 years, ascending by date). */
    quarters: QuarterlySalesPoint[];
};

function toNum(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null;
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : null;
}

export function formatQuarterLabel(isoDate: string): string {
    const [yearStr, monthStr] = isoDate.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (!Number.isFinite(year) || !Number.isFinite(month)) return isoDate;
    const quarter = Math.floor((month - 1) / 3) + 1;
    return `Q${quarter} ${year}`;
}

function weightedAverage(items: ReadonlyArray<{ value: number; weight: number }>): number | null {
    let numerator = 0;
    let denominator = 0;
    for (const item of items) {
        if (!Number.isFinite(item.value) || item.weight <= 0) continue;
        numerator += item.value * item.weight;
        denominator += item.weight;
    }
    return denominator > 0 ? numerator / denominator : null;
}

function cachedRpc<T>(fn: string, params: object): Promise<T> {
    return unstable_cache(
        async () => fetchPublicRpc<T>(fn, params),
        ["market-rpc", fn, stableStringify(params)],
        { revalidate: MARKET_CACHE_TTL_SECONDS, tags: ["rpc-cache", `rpc-cache:${fn}`] },
    )();
}

async function fetchSalesRows(market: MarketConfig): Promise<SalesTrendRowV2[]> {
    const fn = market.kind === "county" ? "get_closed_sales_trends_by_county_v2" : "get_closed_sales_trends_by_city_v2";
    const params =
        market.kind === "county"
            ? {
                  p_county_name: market.countyName!,
                  p_state: market.state,
                  p_min_units: null,
                  p_max_units: null,
                  p_months_per_bucket: MONTHS_PER_BUCKET,
              }
            : {
                  p_city: market.city!,
                  p_state: market.state,
                  p_min_units: null,
                  p_max_units: null,
                  p_months_per_bucket: MONTHS_PER_BUCKET,
              };

    try {
        const rows = await cachedRpc<SalesTrendRowV2[]>(fn, params);
        return Array.isArray(rows) ? rows : [];
    } catch {
        return [];
    }
}

async function fetchLatestMedianRent(market: MarketConfig, beds: 1 | 2): Promise<number | null> {
    const fn = market.kind === "county" ? "get_rent_trends_by_county" : "get_rent_trends_by_city";
    const params =
        market.kind === "county"
            ? {
                  p_county_name: market.countyName!,
                  p_state: market.state,
                  p_beds: beds,
                  p_reits_only: false,
                  p_home_type: null,
              }
            : {
                  p_city: market.city!,
                  p_state: market.state,
                  p_beds: beds,
                  p_reits_only: false,
                  p_home_type: null,
              };

    try {
        const rows = await cachedRpc<RentTrendRow[]>(fn, params);
        if (!Array.isArray(rows) || rows.length === 0) return null;
        // Pick the most recent week with a meaningful listing sample (or fall back to the latest non-null row).
        const sorted = [...rows].sort((a, b) => String(a.week_start).localeCompare(String(b.week_start)));
        for (let i = sorted.length - 1; i >= 0; i -= 1) {
            const rent = toNum(sorted[i].median_rent);
            const count = toNum(sorted[i].listing_count) ?? 0;
            if (rent != null && rent > 0 && count >= 10) return Math.round(rent);
        }
        for (let i = sorted.length - 1; i >= 0; i -= 1) {
            const rent = toNum(sorted[i].median_rent);
            if (rent != null && rent > 0) return Math.round(rent);
        }
        return null;
    } catch {
        return null;
    }
}

function normalizeSalesSeries(rows: readonly SalesTrendRowV2[]): QuarterlySalesPoint[] {
    const cutoff = new Date();
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() - SERIES_LOOKBACK_YEARS);
    const cutoffIso = cutoff.toISOString().slice(0, 10);

    return rows
        .map((row): QuarterlySalesPoint | null => {
            const bucketStart = typeof row.month_start === "string" ? row.month_start.slice(0, 10) : "";
            const medianPrice = toNum(row.median_price);
            const salesCount = toNum(row.listing_count) ?? 0;
            if (!bucketStart || medianPrice == null || medianPrice <= 0 || salesCount <= 0) return null;

            const medianCap = toNum(row.median_cap_rate);
            const avgCap = toNum(row.avg_cap_rate);
            const capCount = toNum(row.cap_rate_count) ?? (medianCap != null ? salesCount : 0);

            return {
                bucketStart,
                quarterLabel: formatQuarterLabel(bucketStart),
                medianPricePerDoor: Math.round(medianPrice),
                avgPricePerDoor: toNum(row.avg_price) != null ? Math.round(toNum(row.avg_price)!) : null,
                p25PricePerDoor: toNum(row.p25_price) != null ? Math.round(toNum(row.p25_price)!) : null,
                p75PricePerDoor: toNum(row.p75_price) != null ? Math.round(toNum(row.p75_price)!) : null,
                medianCapRate: medianCap != null && medianCap > 0 ? Number(medianCap.toFixed(2)) : null,
                avgCapRate: avgCap != null && avgCap > 0 ? Number(avgCap.toFixed(2)) : null,
                salesCount: Math.round(salesCount),
                capRateCount: Math.round(capCount),
            };
        })
        .filter((point): point is QuarterlySalesPoint => point !== null && point.bucketStart >= cutoffIso)
        .sort((a, b) => a.bucketStart.localeCompare(b.bucketStart));
}

function computeSnapshot(
    market: MarketConfig,
    rawSales: readonly SalesTrendRowV2[],
    medianRent1Br: number | null,
    medianRent2Br: number | null,
): MarketSnapshot {
    const quarters = normalizeSalesSeries(rawSales);
    const salesCountTotal = quarters.reduce((sum, q) => sum + q.salesCount, 0);

    // Use trailing 4 quarters (~12 months) for stable headline numbers; fall back to available quarters if sparse.
    const recentQuarters = quarters.slice(-4);
    const priorYearQuarters = quarters.slice(-8, -4);

    const salesCount12Mo = recentQuarters.reduce((sum, q) => sum + q.salesCount, 0);
    const capRateSampleCount = recentQuarters.reduce((sum, q) => sum + (q.medianCapRate != null ? q.capRateCount : 0), 0);

    const recentPrice = weightedAverage(
        recentQuarters.map((q) => ({ value: q.medianPricePerDoor, weight: q.salesCount })),
    );
    const priorPrice = weightedAverage(
        priorYearQuarters.map((q) => ({ value: q.medianPricePerDoor, weight: q.salesCount })),
    );
    const recentP25 = weightedAverage(
        recentQuarters.flatMap((q) => (q.p25PricePerDoor != null ? [{ value: q.p25PricePerDoor, weight: q.salesCount }] : [])),
    );
    const recentP75 = weightedAverage(
        recentQuarters.flatMap((q) => (q.p75PricePerDoor != null ? [{ value: q.p75PricePerDoor, weight: q.salesCount }] : [])),
    );
    const recentCap = weightedAverage(
        recentQuarters.flatMap((q) =>
            q.medianCapRate != null ? [{ value: q.medianCapRate, weight: Math.max(1, q.capRateCount) }] : [],
        ),
    );

    const pricePerDoorYoYPct =
        recentPrice != null && priorPrice != null && priorPrice > 0
            ? Number((((recentPrice - priorPrice) / priorPrice) * 100).toFixed(1))
            : null;

    const latest = quarters[quarters.length - 1] ?? null;
    const earliest = quarters[0] ?? null;

    return {
        market,
        latestQuarterLabel: latest?.quarterLabel ?? null,
        windowStart: earliest?.bucketStart ?? null,
        windowEnd: latest?.bucketStart ?? null,
        medianCapRate: recentCap != null ? Number(recentCap.toFixed(2)) : null,
        capRateSampleCount,
        medianPricePerDoor: recentPrice != null ? Math.round(recentPrice) : null,
        p25PricePerDoor: recentP25 != null ? Math.round(recentP25) : null,
        p75PricePerDoor: recentP75 != null ? Math.round(recentP75) : null,
        salesCount12Mo,
        salesCountTotal,
        pricePerDoorYoYPct,
        medianRent1Br,
        medianRent2Br,
        quarters,
    };
}

/** Load live quarterly sales + rent snapshot for one Bay Area market page. */
export async function getMarketSnapshot(market: MarketConfig): Promise<MarketSnapshot> {
    const [salesRows, rent1Br, rent2Br] = await Promise.all([
        fetchSalesRows(market),
        fetchLatestMedianRent(market, 1),
        fetchLatestMedianRent(market, 2),
    ]);
    return computeSnapshot(market, salesRows, rent1Br, rent2Br);
}

/** Load snapshots for every catalog market (used on the `/markets` index page). */
export async function getAllMarketSnapshots(): Promise<MarketSnapshot[]> {
    return Promise.all(BAY_AREA_MARKETS.map((market) => getMarketSnapshot(market)));
}
