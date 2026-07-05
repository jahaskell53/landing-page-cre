import type { AreaSelection } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { getCountyForCity, getMsaForCounty, getNeighborhoodCity, getZipCity } from "@/db/rpc";

export const PARENT_LINE_COLOR = "#9ca3af";
export const PARENT_LINE_DASH = "6 4";

export interface ParentTrendContext {
    /** Display area id this parent belongs to (may include :mid/:reit suffix). */
    displayAreaId: string;
    /** Key used in chart data / results maps. */
    parentKey: string;
    /** Area passed to geo-fetch trend RPCs. */
    parentArea: AreaSelection;
    /** Short label for badge, e.g. "San Francisco". */
    badgeLabel: string;
}

type AreaKind = "zip" | "neighborhood" | "city" | "county" | "msa";

function areaKind(area: AreaSelection): AreaKind {
    if (area.neighborhoodId != null) return "neighborhood";
    if (area.cityName != null) return "city";
    if (area.countyName != null) return "county";
    if (area.msaGeoid != null) return "msa";
    return "zip";
}

/** Strip :mid / :reit segment suffix from a display area id. */
export function baseAreaId(displayAreaId: string): string {
    return displayAreaId.replace(/:(mid|reit)$/, "");
}

export function parentTrendKey(displayAreaId: string): string {
    return `parent:${displayAreaId}`;
}

function cityParentArea(cityName: string, cityState: string, childDisplayId: string): ParentTrendContext {
    const key = parentTrendKey(childDisplayId);
    return {
        displayAreaId: childDisplayId,
        parentKey: key,
        parentArea: {
            id: key,
            label: `${cityName} avg`,
            color: PARENT_LINE_COLOR,
            cityName,
            cityState,
        },
        badgeLabel: cityName,
    };
}

function countyParentArea(countyName: string, countyState: string, childDisplayId: string): ParentTrendContext {
    const key = parentTrendKey(childDisplayId);
    const shortLabel = countyName.replace(/\s+County$/i, "");
    return {
        displayAreaId: childDisplayId,
        parentKey: key,
        parentArea: {
            id: key,
            label: `${countyName} avg`,
            color: PARENT_LINE_COLOR,
            countyName,
            countyState,
        },
        badgeLabel: shortLabel,
    };
}

function msaParentArea(geoid: string, name: string, childDisplayId: string): ParentTrendContext {
    const key = parentTrendKey(childDisplayId);
    return {
        displayAreaId: childDisplayId,
        parentKey: key,
        parentArea: {
            id: key,
            label: `${name} avg`,
            color: PARENT_LINE_COLOR,
            msaGeoid: geoid,
        },
        badgeLabel: name,
    };
}

/** Resolve the parent area for a single selected area (no segment suffix). */
export async function resolveParentArea(area: AreaSelection): Promise<ParentTrendContext | null> {
    const kind = areaKind(area);

    if (kind === "msa") return null;

    if (kind === "county") {
        const rows = await getMsaForCounty({ p_county_name: area.countyName!, p_state: area.countyState! }).catch(() => []);
        const msa = rows[0];
        if (!msa) return null;
        return msaParentArea(msa.geoid, msa.name, area.id);
    }

    if (kind === "city") {
        const rows = await getCountyForCity({ p_city: area.cityName!, p_state: area.cityState! }).catch(() => []);
        const county = rows[0];
        if (!county) return null;
        return countyParentArea(county.name_lsad, county.state, area.id);
    }

    if (kind === "neighborhood") {
        const rows = await getNeighborhoodCity({ p_neighborhood_id: area.neighborhoodId! }).catch(() => []);
        const row = rows[0];
        if (!row?.city || !row?.state) return null;
        return cityParentArea(row.city, row.state, area.id);
    }

    const rows = await getZipCity({ p_zip: area.id }).catch(() => []);
    const row = rows[0];
    if (!row?.city || !row?.state) return null;
    return cityParentArea(row.city, row.state, area.id);
}

/** Resolve parent contexts for display areas (handles :mid/:reit suffixes). */
export async function resolveParentContextsForDisplayAreas(displayAreas: AreaSelection[]): Promise<ParentTrendContext[]> {
    const contexts: ParentTrendContext[] = [];
    const seen = new Set<string>();

    for (const displayArea of displayAreas) {
        const baseId = baseAreaId(displayArea.id);
        if (seen.has(baseId)) continue;
        seen.add(baseId);

        const baseArea: AreaSelection = { ...displayArea, id: baseId };
        const parent = await resolveParentArea(baseArea);
        if (!parent) continue;

        const displayId = displayArea.id;
        if (displayId === baseId) {
            contexts.push(parent);
        } else {
            contexts.push({
                ...parent,
                displayAreaId: displayId,
                parentKey: parentTrendKey(displayId),
                parentArea: { ...parent.parentArea, id: parentTrendKey(displayId) },
            });
        }
    }

    return contexts;
}

/** Compare child latest value to parent latest; returns signed % delta (positive = above). */
export function compareToParent(childLatest: number | undefined, parentLatest: number | undefined): { pctDelta: number; above: boolean } | null {
    if (childLatest == null || parentLatest == null || parentLatest === 0) return null;
    const pctDelta = ((childLatest - parentLatest) / parentLatest) * 100;
    return { pctDelta, above: pctDelta >= 0 };
}

export function formatParentComparisonBadge(pctDelta: number, above: boolean, parentLabel: string): string {
    const direction = above ? "above" : "below";
    return `${Math.abs(pctDelta).toFixed(0)}% ${direction} ${parentLabel} avg`;
}
