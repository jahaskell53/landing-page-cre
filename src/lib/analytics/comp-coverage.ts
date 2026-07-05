export type CompCoverageSource = "closed_sales" | "listings";

export interface CompCoverageCounts {
    totalCount: number;
    capRateCount: number;
}

export function salesSourceToCoverageSource(source: "crexi" | "loopnet"): CompCoverageSource {
    return source === "crexi" ? "closed_sales" : "listings";
}

export function formatCompCoverageLabel(counts: CompCoverageCounts, source: CompCoverageSource): string {
    const unit = source === "closed_sales" ? (counts.totalCount === 1 ? "closed sale" : "closed sales") : counts.totalCount === 1 ? "listing" : "listings";
    const capPart = counts.capRateCount === 0 ? "none with cap rate" : counts.capRateCount === 1 ? "1 with cap rate" : `${counts.capRateCount} with cap rate`;
    return `Based on ${counts.totalCount} ${unit}, ${capPart}`;
}

export interface TrendCoverageRow {
    month_start: string;
    listing_count: number;
    cap_rate_count?: number | null;
}

/** Latest bucket in a trend series (by month_start). */
export function latestTrendCoverage(rows: ReadonlyArray<TrendCoverageRow>): CompCoverageCounts | null {
    if (rows.length === 0) return null;
    const latest = [...rows].sort((a, b) => a.month_start.localeCompare(b.month_start)).at(-1)!;
    return {
        totalCount: latest.listing_count,
        capRateCount: latest.cap_rate_count ?? 0,
    };
}

/** Coverage for a single chart bucket (min counts across compared areas). */
export function chartPointCoverage(point: { _minListingCount?: number; _minCapRateCount?: number }): CompCoverageCounts | null {
    const totalCount = point._minListingCount;
    if (totalCount == null) return null;
    return {
        totalCount,
        capRateCount: point._minCapRateCount ?? 0,
    };
}
