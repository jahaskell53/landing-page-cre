import { unstable_cache } from "next/cache";
import type { TrendRow } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { stableStringify } from "@/db/rpc/trends-rpc-client";
import { fetchPublicRpc } from "@/lib/rpc-prefetch";
import { PREVIEW_BEDS, PREVIEW_CITIES, previewAreaId } from "./rent-trends-preview-config";

const RPC_CACHE_TTL_SECONDS = 3600;

const RENT_TRENDS_FN = "get_rent_trends_by_city";

function fetchCityRentTrends(city: string, state: string): Promise<TrendRow[]> {
    const params = {
        p_beds: PREVIEW_BEDS[0],
        p_city: city,
        p_home_type: null,
        p_reits_only: false,
        p_state: state,
    };
    return unstable_cache(
        async () => fetchPublicRpc<TrendRow[]>(RENT_TRENDS_FN, params),
        ["rpc-cache", RENT_TRENDS_FN, stableStringify(params)],
        { revalidate: RPC_CACHE_TTL_SECONDS, tags: ["rpc-cache", `rpc-cache:${RENT_TRENDS_FN}`] },
    )();
}

/** Prefetch rent-trend series for the landing-page hero chart. */
export async function getWelcomeRentTrends(): Promise<Record<string, TrendRow[]> | null> {
    try {
        const results = await Promise.all(
            PREVIEW_CITIES.map(async (c) => ({
                id: previewAreaId(c.city, c.state),
                rows: await fetchCityRentTrends(c.city, c.state),
            })),
        );
        if (!results.some((r) => r.rows.length > 0)) {
            return null;
        }
        const next: Record<string, TrendRow[]> = {};
        for (const r of results) {
            next[r.id] = r.rows;
        }
        return next;
    } catch {
        return null;
    }
}
