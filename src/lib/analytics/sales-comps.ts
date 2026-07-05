import type { SalesCompResult } from "@/app/(app)/analytics/sales-comps/sales-comps-types";

export type SalesCompSortColumn = "saleDate" | "price" | "ppu" | "ppsf" | "units" | "capRate" | "distance" | "score";
export type SortDirection = "asc" | "desc";

export interface SalesSubjectInputs {
    units: string;
    area: string;
    yearBuilt: string;
}

export interface SalesMarketStats {
    /** Distribution of price-per-unit ($/door) across the comp set. */
    min: number;
    max: number;
    p25: number;
    median: number;
    p75: number;
    n: number;
    /** Median cap rate (%), or null when no comp reports a cap rate. */
    medianCapRate: number | null;
    /** Count of comps that reported a cap rate (medianCapRate's sample size). */
    capRateN: number;
}

const SALE_WINDOW_TO_MONTHS = { "6M": 6, "12M": 12, "24M": 24 } as const;

/** Convert a sale-window in months to an ISO cutoff date, or null for all-time. */
export function saleWindowToCutoff(months: number): string | null {
    if (!months) return null;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    return cutoff.toISOString().slice(0, 10);
}

/** Stable median of a numeric array (already-sorted not required). */
function median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function sortSalesComps(
    comps: SalesCompResult[],
    sortCol: SalesCompSortColumn | null,
    sortDir: SortDirection,
    subject: SalesSubjectInputs,
): SalesCompResult[] {
    if (!sortCol) return comps;

    const subjectUnits = subject.units ? parseInt(subject.units) : null;

    const getValue = (comp: SalesCompResult): number => {
        switch (sortCol) {
            case "saleDate":
                return comp.sale_date ? new Date(comp.sale_date).getTime() : -Infinity;
            case "price":
                return comp.sale_price ?? -Infinity;
            case "ppu":
                // When the user gave a unit count, rank by closeness; otherwise by raw $/door.
                return subjectUnits != null && comp.num_units != null ? Math.abs(comp.num_units - subjectUnits) : (comp.price_per_unit ?? Infinity);
            case "ppsf":
                return comp.price_per_sqft ?? Infinity;
            case "units":
                return comp.num_units ?? -Infinity;
            case "capRate":
                return comp.cap_rate ?? Infinity;
            case "distance":
                return comp.distance_m;
            case "score":
                return comp.composite_score;
            default:
                return 0;
        }
    };

    const multiplier = sortDir === "asc" ? 1 : -1;
    return [...comps].sort((left, right) => multiplier * (getValue(left) - getValue(right)));
}

export function buildSalesMarketStats(comps: SalesCompResult[]): SalesMarketStats | null {
    const ppu = comps
        .map((comp) => comp.price_per_unit)
        .filter((value): value is number => value != null && value > 0)
        .sort((left, right) => left - right);

    if (ppu.length === 0) return null;

    const count = ppu.length;
    const percentile = (value: number) => {
        const index = (value / 100) * (count - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        return lower === upper ? ppu[lower] : ppu[lower] + (ppu[upper] - ppu[lower]) * (index - lower);
    };

    const capRates = comps.map((comp) => comp.cap_rate).filter((value): value is number => value != null && value > 0);

    return {
        min: ppu[0],
        max: ppu[count - 1],
        p25: percentile(25),
        median: percentile(50),
        p75: percentile(75),
        n: count,
        medianCapRate: capRates.length > 0 ? median(capRates) : null,
        capRateN: capRates.length,
    };
}

export function metersToMiles(meters: number): string {
    return (meters / 1609.34).toFixed(2);
}

export function getScoreColor(score: number): string {
    if (score >= 0.75) return "text-green-600 dark:text-green-400";
    if (score >= 0.55) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
}

export { SALE_WINDOW_TO_MONTHS };
