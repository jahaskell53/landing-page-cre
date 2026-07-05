import { callTrendRpc } from "./trends-rpc-client";

export interface RentTrendRow {
    week_start: string;
    beds: number;
    median_rent: number;
    listing_count: number;
}

interface BaseRentTrendsParams {
    p_beds: number | null;
    p_reits_only: boolean;
    p_home_type: string | null;
}

function rpc<T>(fn: string, params: object): Promise<T[]> {
    return callTrendRpc<T[]>(fn, params);
}

export async function getRentTrends(params: BaseRentTrendsParams & { p_zip: string }): Promise<RentTrendRow[]> {
    return rpc("get_rent_trends", params);
}

export async function getRentTrendsByNeighborhood(params: BaseRentTrendsParams & { p_neighborhood_ids: number[] }): Promise<RentTrendRow[]> {
    return rpc("get_rent_trends_by_neighborhood", params);
}

export async function getRentTrendsByCity(params: BaseRentTrendsParams & { p_city: string; p_state: string }): Promise<RentTrendRow[]> {
    return rpc("get_rent_trends_by_city", params);
}

export async function getRentTrendsByCounty(params: BaseRentTrendsParams & { p_county_name: string; p_state: string }): Promise<RentTrendRow[]> {
    return rpc("get_rent_trends_by_county", params);
}

export async function getRentTrendsByMsa(params: BaseRentTrendsParams & { p_geoid: string }): Promise<RentTrendRow[]> {
    return rpc("get_rent_trends_by_msa", params);
}
