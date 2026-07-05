import { unstable_cache } from "next/cache";
import type { SalesTrendRowV2 } from "@/db/rpc";
import { stableStringify } from "@/db/rpc/trends-rpc-client";
import { fetchPublicRpc } from "@/lib/rpc-prefetch";
import { PREVIEW_SALES_CITY, PREVIEW_SALES_MONTHS_PER_BUCKET } from "./sales-trends-preview-config";

const RPC_CACHE_TTL_SECONDS = 3600;

const SALES_TRENDS_FN = "get_closed_sales_trends_by_city_v2";

function fetchCitySalesTrends(city: string, state: string): Promise<SalesTrendRowV2[]> {
    const params = {
        p_city: city,
        p_state: state,
        p_min_units: null,
        p_max_units: null,
        p_months_per_bucket: PREVIEW_SALES_MONTHS_PER_BUCKET,
    };
    return unstable_cache(
        async () => fetchPublicRpc<SalesTrendRowV2[]>(SALES_TRENDS_FN, params),
        ["rpc-cache", SALES_TRENDS_FN, stableStringify(params)],
        { revalidate: RPC_CACHE_TTL_SECONDS, tags: ["rpc-cache", `rpc-cache:${SALES_TRENDS_FN}`] },
    )();
}

/** Prefetch Oakland closed-sale trends for the app mockup sales tab. */
export async function getWelcomeSalesTrends(): Promise<SalesTrendRowV2[] | null> {
    try {
        const rows = await fetchCitySalesTrends(PREVIEW_SALES_CITY.city, PREVIEW_SALES_CITY.state);
        return rows.length > 0 ? rows : null;
    } catch {
        return null;
    }
}
