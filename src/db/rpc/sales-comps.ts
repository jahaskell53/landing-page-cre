import { apiFetch } from "@/lib/api/api-fetch";

/**
 * One comparable closed sale returned by the `get_sales_comps` RPC. Unlike the
 * rental `CompRow`, every field comes straight from `crexi_api_comps` (which is
 * already geocoded), so no separate metadata join is needed on the client.
 */
export interface SalesCompRow {
    id: number;
    crexi_id: string | null;
    address_full: string | null;
    address_street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    latitude: number | null;
    longitude: number | null;
    property_subtype: string | null;
    class_type: string | null;
    year_built: number | null;
    num_units: number | null;
    building_sqft: number | null;
    sale_price: number | null;
    price_per_unit: number | null;
    price_per_sqft: number | null;
    cap_rate: number | null;
    noi: number | null;
    sale_date: string | null;
    distance_m: number;
    composite_score: number;
    /** First Crexi listing photo; only broker-reported comps carry a gallery, so null for most. */
    cover_photo_url: string | null;
}

export interface GetSalesCompsParams {
    subject_lng: number;
    subject_lat: number;
    radius_m: number;
    subject_units: number | null;
    subject_area: number | null;
    subject_year_built: number | null;
    /** ISO date (YYYY-MM-DD) floor on sale_transaction_date, or null for all-time. */
    sale_after: string | null;
    p_neighborhood_ids: number[] | null;
    p_subject_zip: string | null;
    p_limit: number;
}

export async function getSalesComps(params: GetSalesCompsParams, options?: { signal?: AbortSignal }): Promise<SalesCompRow[]> {
    return apiFetch<SalesCompRow[]>("/api/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fn: "get_sales_comps", params }),
        signal: options?.signal,
    });
}
