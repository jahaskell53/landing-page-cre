import type { AreaSelection } from "@/app/(app)/analytics/rent-trends/trends-utils";
import type { SalesTrendRowV2 } from "@/db/rpc";
import { type ParentTrendContext, compareToParent } from "@/lib/analytics/area-hierarchy";
import type { SalesTrendDisplayType, SalesTrendMetric, SalesTrendPeriod } from "@/lib/analytics/filters";
import { formatCompact, formatDate, formatPercent } from "@/utils/format";

/** Y-axis view for the sales trends chart: absolute values, or % change rebased to each series' first point. */
export type SalesTrendYView = "abs" | "pct";

export function filterByPeriod(rows: SalesTrendRowV2[], period: SalesTrendPeriod): SalesTrendRowV2[] {
    if (period === "Max") return rows;
    const months: Record<SalesTrendPeriod, number> = {
        "3M": 3,
        "6M": 6,
        "9M": 9,
        "1Y": 12,
        "2Y": 24,
        "5Y": 60,
        "10Y": 120,
        Max: 0,
    };
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months[period]);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return rows.filter((r) => r.month_start >= cutoffStr);
}

export function metricValue(row: SalesTrendRowV2, metric: SalesTrendMetric, displayType: SalesTrendDisplayType): number | null {
    if (metric === "cap_rate") {
        if (displayType === "Average") return row.avg_cap_rate;
        return row.median_cap_rate;
    }
    if (metric === "cost_per_unit") {
        if (displayType === "Average") return row.avg_price;
        return row.median_price;
    }
    return null;
}

export function formatMetricValue(value: number, metric: SalesTrendMetric): string {
    if (metric === "cap_rate") return formatPercent(value, 2);
    if (metric === "cost_per_unit") return formatCompact(value);
    return value.toFixed(1) + "x";
}

export function formatYAxisValue(value: number, metric: SalesTrendMetric): string {
    if (metric === "cap_rate") return formatPercent(value, 1);
    if (metric === "cost_per_unit") {
        if (Math.abs(value) >= 1_000) return formatCompact(value);
        return `$${value.toFixed(0)}`;
    }
    return value.toFixed(1) + "x";
}

/** Signed percentage label for the % change ("normalized") Y-axis view, e.g. "+12.3%". */
export function formatPctChange(value: number, decimals = 1): string {
    return formatPercent(value, decimals, { showSign: true });
}

export function formatMonthLabel(dateStr: string): string {
    return formatDate(dateStr, { utc: true, style: "monthYear" });
}

export function verticalScaleLabel(metric: SalesTrendMetric): string {
    if (metric === "cost_per_unit") return "$ (Cost/Unit)";
    if (metric === "grm") return "GRM (no unit)";
    return "% (Cap Rate)";
}

export function buildSalesTrendChartData(
    salesResults: Record<string, SalesTrendRowV2[]>,
    selectedAreas: AreaSelection[],
    compareAreas: AreaSelection[],
    period: SalesTrendPeriod,
    metric: SalesTrendMetric,
    displayType: SalesTrendDisplayType,
    parentContexts: ParentTrendContext[] = [],
    parentResults: Record<string, SalesTrendRowV2[]> = {},
): Array<Record<string, string | number | [number, number]>> {
    const allAreas = [...selectedAreas, ...compareAreas];
    if (allAreas.length === 0) return [];
    const showVolume = selectedAreas.length === 1 && compareAreas.length === 0;
    const allBuckets = new Set<string>();
    const processed: Record<string, SalesTrendRowV2[]> = {};
    for (const area of allAreas) {
        const raw = salesResults[area.id] ?? [];
        const filtered = filterByPeriod(raw, period);
        processed[area.id] = filtered;
        filtered.forEach((r) => allBuckets.add(r.month_start));
    }
    // Parent geography averages overlay as their own series keyed by parentKey.
    const processedParents: Record<string, SalesTrendRowV2[]> = {};
    for (const ctx of parentContexts) {
        const filtered = filterByPeriod(parentResults[ctx.parentKey] ?? [], period);
        processedParents[ctx.parentKey] = filtered;
        filtered.forEach((r) => allBuckets.add(r.month_start));
    }
    return Array.from(allBuckets)
        .sort()
        .map((bucket) => {
            const point: Record<string, string | number | [number, number]> = {
                month: bucket,
                monthLabel: formatMonthLabel(bucket),
            };
            let minListing: number | null = null;
            let minCapRate: number | null = null;
            for (const area of allAreas) {
                const row = processed[area.id]?.find((r) => r.month_start === bucket);
                if (row) {
                    minListing = minListing === null ? row.listing_count : Math.min(minListing, row.listing_count);
                    const capCount = row.cap_rate_count ?? 0;
                    minCapRate = minCapRate === null ? capCount : Math.min(minCapRate, capCount);
                    const val = metricValue(row, metric, displayType);
                    if (val != null) point[area.id] = val;
                    if (displayType === "Candle" && metric === "cost_per_unit" && row.median_price != null && row.p25_price != null && row.p75_price != null) {
                        const med = row.median_price;
                        point[`${area.id}_rangeErr`] = [med - row.p25_price, row.p75_price - med];
                    }
                    if (
                        displayType === "Candle" &&
                        metric === "cap_rate" &&
                        row.median_cap_rate != null &&
                        row.min_cap_rate != null &&
                        row.max_cap_rate != null
                    ) {
                        const m = row.median_cap_rate;
                        point[`${area.id}_rangeErr`] = [m - row.min_cap_rate, row.max_cap_rate - m];
                    }
                    if (showVolume) point.volume = row.listing_count;
                }
            }
            for (const ctx of parentContexts) {
                const row = processedParents[ctx.parentKey]?.find((r) => r.month_start === bucket);
                if (row) {
                    const val = metricValue(row, metric, displayType);
                    if (val != null) point[ctx.parentKey] = val;
                }
            }
            if (minListing !== null) {
                point._minListingCount = minListing;
            }
            if (minCapRate !== null) {
                point._minCapRateCount = minCapRate;
            }
            return point;
        });
}

/** Latest (most recent bucket) numeric value for a series key in built chart data. */
function latestNumericForKey(chartData: Array<Record<string, string | number | [number, number]>>, key: string): number | undefined {
    for (let i = chartData.length - 1; i >= 0; i--) {
        const v = chartData[i][key];
        if (typeof v === "number") return v;
    }
    return undefined;
}

export interface ParentComparison {
    ctx: ParentTrendContext;
    pctDelta: number;
    above: boolean;
}

/**
 * Compare each selected area's latest value to its parent geography average for the active metric.
 * Returns one entry per selected area that has both a resolved parent and comparable latest values.
 */
export function buildParentComparisons(
    chartData: Array<Record<string, string | number | [number, number]>>,
    parentContexts: ParentTrendContext[],
    selectedAreas: AreaSelection[],
): ParentComparison[] {
    const selectedIds = new Set(selectedAreas.map((a) => a.id));
    const comparisons: ParentComparison[] = [];
    for (const ctx of parentContexts) {
        if (!selectedIds.has(ctx.displayAreaId)) continue;
        const childLatest = latestNumericForKey(chartData, ctx.displayAreaId);
        const parentLatest = latestNumericForKey(chartData, ctx.parentKey);
        const comparison = compareToParent(childLatest, parentLatest);
        if (!comparison) continue;
        comparisons.push({ ctx, pctDelta: comparison.pctDelta, above: comparison.above });
    }
    return comparisons;
}

/**
 * Rebase every area series to % change from its first plotted point, so areas at very
 * different price levels can be compared on one axis (the standalone-chart equivalent of
 * the trends section's %/$ toggle). Non-series metadata — month, monthLabel, volume, and
 * the `_min*` sample counts — passes through untouched; Candle `_rangeErr` spreads are
 * scaled into percentage points off the same baseline so the range still lines up with the
 * rebased value. Parent overlay series (keyed by parentKey) are rebased too when present.
 */
export function buildPctSalesTrendData(
    absData: Array<Record<string, string | number | [number, number]>>,
    areas: AreaSelection[],
    parentKeys: string[] = [],
): Array<Record<string, string | number | [number, number]>> {
    const seriesIds = [...areas.map((a) => a.id), ...parentKeys];
    const baselines: Record<string, number> = {};
    for (const id of seriesIds) {
        for (const point of absData) {
            const v = point[id];
            if (typeof v === "number") {
                baselines[id] = v;
                break;
            }
        }
    }
    const seriesKeys = new Set<string>();
    for (const id of seriesIds) {
        seriesKeys.add(id);
        seriesKeys.add(`${id}_rangeErr`);
    }
    return absData.map((point) => {
        const out: Record<string, string | number | [number, number]> = {};
        for (const [key, value] of Object.entries(point)) {
            if (!seriesKeys.has(key)) out[key] = value;
        }
        for (const id of seriesIds) {
            const v = point[id];
            const base = baselines[id];
            if (typeof v === "number" && base != null && base !== 0) {
                out[id] = parseFloat((((v - base) / base) * 100).toFixed(2));
                const err = point[`${id}_rangeErr`];
                if (Array.isArray(err)) {
                    out[`${id}_rangeErr`] = [parseFloat(((err[0] / base) * 100).toFixed(2)), parseFloat(((err[1] / base) * 100).toFixed(2))];
                }
            }
        }
        return out;
    });
}
