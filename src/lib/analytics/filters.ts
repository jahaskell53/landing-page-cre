import type { AreaSelection } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { parseSerializedAreas, serializeAreasParam } from "@/lib/analytics/trends-page";

export const ANALYTICS_AREA_TYPES = ["Neighborhood", "ZIP Code", "City", "County", "MSA"] as const;
export type AnalyticsAreaType = (typeof ANALYTICS_AREA_TYPES)[number];

export const SALES_TREND_PERIODS = ["3M", "6M", "9M", "1Y", "2Y", "5Y", "10Y", "Max"] as const;
export type SalesTrendPeriod = (typeof SALES_TREND_PERIODS)[number];

export const SALES_TREND_SAMPLE_COMPS = ["1M", "3M", "6M", "1Y"] as const;
export type SalesTrendSampleComps = (typeof SALES_TREND_SAMPLE_COMPS)[number];

export const SAMPLE_COMPS_MONTHS: Record<SalesTrendSampleComps, number> = {
    "1M": 1,
    "3M": 3,
    "6M": 6,
    "1Y": 12,
};

export const SALES_METRIC_SOURCES = ["crexi", "loopnet"] as const;
export type SalesMetricSource = (typeof SALES_METRIC_SOURCES)[number];

export type SalesTrendDisplayType = "Average" | "Candle" | "Median";
export type SalesTrendMetric = "cap_rate" | "cost_per_unit" | "grm";
export type SalesTrendUnitFilter = "All" | "2-4" | "5-10" | "11+" | "custom";
export type SalesTrendRentBasis = "Current" | "Stabilized" | "Market";

export function parseSalesMetricSourceParam(value: string | null): SalesMetricSource {
    return value === "loopnet" ? "loopnet" : "crexi";
}

export function parseUnitFilterParam(value: string | null): SalesTrendUnitFilter {
    if (!value) return "All";
    if (value === "11-25" || value === "26-50" || value === "51+") return "11+";
    const allowed: SalesTrendUnitFilter[] = ["All", "2-4", "5-10", "11+", "custom"];
    return allowed.includes(value as SalesTrendUnitFilter) ? (value as SalesTrendUnitFilter) : "All";
}

export function parseAreasFromParams(param: string | null): AreaSelection[] {
    return parseSerializedAreas(param);
}

export function serializeAreasToParam(areas: AreaSelection[]): string {
    return serializeAreasParam(areas);
}

/**
 * Canonical analytics filter option lists.
 *
 * Centralizes the beds/baths/laundry/segment/unit choices that were previously
 * duplicated (and drifting) across `map-page.ts`, the sales-trends filter panel,
 * and the rent-trends panel. Each surface imports from here so the option set is
 * defined exactly once. `map-page.ts` re-exports the map-facing ones for
 * backward compatibility with its existing importers.
 */

/** Market segment (All / Mid-market / REIT) — shared by trends, comps, and the map's `propertyType`. */
export const MARKET_SEGMENTS = ["both", "mid", "reit"] as const;
export type MarketSegment = (typeof MARKET_SEGMENTS)[number];
export const MARKET_SEGMENT_OPTIONS: { value: MarketSegment; label: string }[] = [
    { value: "both", label: "All" },
    { value: "mid", label: "Mid-market" },
    { value: "reit", label: "REIT" },
];

/** Bedroom options for the map's multi-select bed filter (includes a "4+" bucket). */
export const MAP_BED_OPTIONS: { value: number; label: string }[] = [
    { value: 0, label: "Studio" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4+" },
];

/** Bedroom options for the rent-trends single-select bed filter (Studio–3BR). */
export const RENT_TREND_BED_OPTIONS: { value: number; label: string }[] = [
    { value: 0, label: "Studio" },
    { value: 1, label: "1BR" },
    { value: 2, label: "2BR" },
    { value: 3, label: "3BR" },
];

/** Minimum-bathrooms options for the map's bath filter. */
export const BATH_OPTIONS: { value: number; label: string }[] = [
    { value: 1, label: "1+" },
    { value: 1.5, label: "1.5+" },
    { value: 2, label: "2+" },
    { value: 3, label: "3+" },
    { value: 4, label: "4+" },
];

/** Zillow `cleaned_rental_listings.laundry` values users can filter by on the rent map. */
export type LaundryFilterValue = "in_unit" | "shared" | "none";
export const LAUNDRY_OPTIONS: { value: LaundryFilterValue; label: string }[] = [
    { value: "in_unit", label: "In unit" },
    { value: "shared", label: "Shared" },
    { value: "none", label: "None" },
];

/** Unit-count presets for the sales-trends `# of Units` filter (plus a custom min/max escape hatch). */
export const UNIT_PRESETS: { value: SalesTrendUnitFilter; label: string }[] = [
    { value: "All", label: "All" },
    { value: "2-4", label: "2–4" },
    { value: "5-10", label: "5–10" },
    { value: "11+", label: "11+" },
    { value: "custom", label: "Custom" },
];

export function buildUnitRange(unitFilter: SalesTrendUnitFilter, unitMin: string, unitMax: string): { p_min_units?: number; p_max_units?: number } {
    const PRESET_RANGES: Record<string, { min?: number; max?: number }> = {
        "2-4": { min: 2, max: 4 },
        "5-10": { min: 5, max: 10 },
        "11+": { min: 11 },
    };
    if (unitFilter === "All") return {};
    if (unitFilter === "custom") {
        const result: { p_min_units?: number; p_max_units?: number } = {};
        if (unitMin) result.p_min_units = parseInt(unitMin, 10);
        if (unitMax) result.p_max_units = parseInt(unitMax, 10);
        return result;
    }
    const preset = PRESET_RANGES[unitFilter];
    if (!preset) return {};
    const result: { p_min_units?: number; p_max_units?: number } = {};
    if (preset.min) result.p_min_units = preset.min;
    if (preset.max) result.p_max_units = preset.max;
    return result;
}
