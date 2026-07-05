import { callTrendRpc } from "./trends-rpc-client";

export interface MapSalesTrendZipRow {
    zip: string;
    geom_json: string;
    current_median: number;
    period_median: number;
    prior_median: number;
    pct_change: number | null;
    listing_count: number;
}

export interface MapSalesTrendNeighborhoodRow {
    neighborhood_id: number;
    name: string;
    city: string;
    geom_json: string;
    current_median: number;
    period_median: number;
    prior_median: number;
    pct_change: number | null;
    listing_count: number;
}

export interface MapSalesTrendCityRow {
    city_name: string;
    state: string;
    geom_json: string;
    current_median: number;
    period_median: number;
    prior_median: number;
    pct_change: number | null;
    listing_count: number;
}

export interface MapSalesTrendCountyRow {
    county_name: string;
    state: string;
    geom_json: string;
    current_median: number;
    period_median: number;
    prior_median: number;
    pct_change: number | null;
    listing_count: number;
}

export interface MapSalesTrendMsaRow {
    geoid: string;
    name: string;
    geom_json: string;
    current_median: number;
    period_median: number;
    prior_median: number;
    pct_change: number | null;
    listing_count: number;
}

interface BaseMapSalesTrendsParams {
    p_months_back: number;
}

function rpc<T>(fn: string, params: object): Promise<T[]> {
    return callTrendRpc<T[]>(fn, params);
}

// ── Asking-listing variants (LoopNet source) ───────────────────────────────────

export async function getMapAskingListingTrends(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendZipRow[]> {
    return rpc("get_map_asking_listing_trends", params);
}

export async function getMapAskingListingTrendsByNeighborhood(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendNeighborhoodRow[]> {
    return rpc("get_map_asking_listing_trends_by_neighborhood", params);
}

export async function getMapAskingListingTrendsByCity(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendCityRow[]> {
    return rpc("get_map_asking_listing_trends_by_city", params);
}

export async function getMapAskingListingTrendsByCounty(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendCountyRow[]> {
    return rpc("get_map_asking_listing_trends_by_county", params);
}

export async function getMapAskingListingTrendsByMsa(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendMsaRow[]> {
    return rpc("get_map_asking_listing_trends_by_msa", params);
}

// ── Closed-sale variants (Crexi source) ────────────────────────────────────────

export async function getMapClosedSalesTrends(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendZipRow[]> {
    return rpc("get_map_closed_sales_trends", params);
}

export async function getMapClosedSalesTrendsByNeighborhood(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendNeighborhoodRow[]> {
    return rpc("get_map_closed_sales_trends_by_neighborhood", params);
}

export async function getMapClosedSalesTrendsByCity(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendCityRow[]> {
    return rpc("get_map_closed_sales_trends_by_city", params);
}

export async function getMapClosedSalesTrendsByCounty(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendCountyRow[]> {
    return rpc("get_map_closed_sales_trends_by_county", params);
}

export async function getMapClosedSalesTrendsByMsa(params: BaseMapSalesTrendsParams): Promise<MapSalesTrendMsaRow[]> {
    return rpc("get_map_closed_sales_trends_by_msa", params);
}
