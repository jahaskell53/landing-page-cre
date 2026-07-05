import { callTrendRpc } from "./trends-rpc-client";

export interface SalesTrendRow {
    month_start: string;
    median_price: number;
    avg_cap_rate: number | null;
    listing_count: number;
    cap_rate_count?: number | null;
}

function rpc<T>(fn: string, params: object): Promise<T[]> {
    return callTrendRpc<T[]>(fn, params);
}

export async function getAskingListingTrends(params: { p_zip: string }): Promise<SalesTrendRow[]> {
    return rpc("get_asking_listing_trends", params);
}

export async function getAskingListingTrendsByNeighborhood(params: { p_neighborhood_ids: number[] }): Promise<SalesTrendRow[]> {
    return rpc("get_asking_listing_trends_by_neighborhood", params);
}

export async function getAskingListingTrendsByCity(params: { p_city: string; p_state: string }): Promise<SalesTrendRow[]> {
    return rpc("get_asking_listing_trends_by_city", params);
}

export async function getAskingListingTrendsByCounty(params: { p_county_name: string; p_state: string }): Promise<SalesTrendRow[]> {
    return rpc("get_asking_listing_trends_by_county", params);
}

export async function getAskingListingTrendsByMsa(params: { p_geoid: string }): Promise<SalesTrendRow[]> {
    return rpc("get_asking_listing_trends_by_msa", params);
}

// ── Closed-sale variants (Crexi API comps source) ───────────────────────────

export async function getClosedSalesTrends(params: { p_zip: string }): Promise<SalesTrendRow[]> {
    return rpc("get_closed_sales_trends", params);
}

export async function getClosedSalesTrendsByNeighborhood(params: { p_neighborhood_ids: number[] }): Promise<SalesTrendRow[]> {
    return rpc("get_closed_sales_trends_by_neighborhood", params);
}

export async function getClosedSalesTrendsByCity(params: { p_city: string; p_state: string }): Promise<SalesTrendRow[]> {
    return rpc("get_closed_sales_trends_by_city", params);
}

export async function getClosedSalesTrendsByCounty(params: { p_county_name: string; p_state: string }): Promise<SalesTrendRow[]> {
    return rpc("get_closed_sales_trends_by_county", params);
}

export async function getClosedSalesTrendsByMsa(params: { p_geoid: string }): Promise<SalesTrendRow[]> {
    return rpc("get_closed_sales_trends_by_msa", params);
}

// ── Closed-sale v2 variants (unit filters + extended price columns) ─────────

export interface SalesTrendRowV2 extends SalesTrendRow {
    avg_price: number;
    p25_price: number;
    p75_price: number;
    median_cap_rate: number | null;
    min_cap_rate: number | null;
    max_cap_rate: number | null;
}

interface UnitFilterParams {
    p_min_units?: number | null;
    p_max_units?: number | null;
    p_months_per_bucket?: number | null;
}

export async function getClosedSalesTrendsV2(params: { p_zip: string } & UnitFilterParams): Promise<SalesTrendRowV2[]> {
    return rpc("get_closed_sales_trends_v2", params);
}

export async function getClosedSalesTrendsByNeighborhoodV2(params: { p_neighborhood_ids: number[] } & UnitFilterParams): Promise<SalesTrendRowV2[]> {
    return rpc("get_closed_sales_trends_by_neighborhood_v2", params);
}

export async function getClosedSalesTrendsByCityV2(params: { p_city: string; p_state: string } & UnitFilterParams): Promise<SalesTrendRowV2[]> {
    return rpc("get_closed_sales_trends_by_city_v2", params);
}

export async function getClosedSalesTrendsByCountyV2(params: { p_county_name: string; p_state: string } & UnitFilterParams): Promise<SalesTrendRowV2[]> {
    return rpc("get_closed_sales_trends_by_county_v2", params);
}

export async function getClosedSalesTrendsByMsaV2(params: { p_geoid: string } & UnitFilterParams): Promise<SalesTrendRowV2[]> {
    return rpc("get_closed_sales_trends_by_msa_v2", params);
}

// ── Bucket listings (drill-down) ─────────────────────────────────────────────

export interface BucketListingRow {
    id: number;
    crexi_id: string | null;
    property_name: string | null;
    address_full: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    property_price_total: number | null;
    num_units: number | null;
    price_per_door: number | null;
    sale_transaction_date: string | null;
    sale_cap_rate_percent: number | null;
    financials_cap_rate_percent: number | null;
    total_count: number;
}

export type BucketAreaKind = "zip" | "city" | "county" | "neighborhood" | "msa";

export interface GetBucketListingsParams {
    p_area_kind: BucketAreaKind;
    p_bucket_start: string;
    p_months_per_bucket: number;
    p_offset: number;
    p_limit: number;
    p_zip?: string | null;
    p_city?: string | null;
    p_state?: string | null;
    p_county_name?: string | null;
    p_geoid?: string | null;
    p_neighborhood_ids?: number[] | null;
    p_min_units?: number | null;
    p_max_units?: number | null;
}

export async function getClosedSalesTrendsBucketListings(params: GetBucketListingsParams): Promise<BucketListingRow[]> {
    return rpc("get_closed_sales_trends_bucket_listings", params);
}
