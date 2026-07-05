import { apiFetch } from "@/lib/api/api-fetch";
import { type ZillowMapListingRow } from "@/lib/map-listings";

export type { ZillowMapListingRow };

export interface GetZillowMapListingsParams {
    p_zip: string | null;
    p_city: string | null;
    p_address_query: string | null;
    p_latest_only: boolean;
    p_price_min: number | null;
    p_price_max: number | null;
    p_sqft_min: number | null;
    p_sqft_max: number | null;
    p_beds: number[] | null;
    p_baths_min: number | null;
    p_home_types: string[] | null;
    p_property_type: "both" | "reit" | "mid";
    p_laundry: ("in_unit" | "shared" | "none")[] | null;
    p_bounds_south: number | null;
    p_bounds_north: number | null;
    p_bounds_west: number | null;
    p_bounds_east: number | null;
}

export async function getZillowMapListings(params: GetZillowMapListingsParams): Promise<ZillowMapListingRow[]> {
    return apiFetch<ZillowMapListingRow[]>("/api/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fn: "get_zillow_map_listings", params }),
    });
}
