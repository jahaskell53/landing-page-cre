import type { SalesCompRow } from "@/db/rpc/sales-comps";

export type SalesCompResult = SalesCompRow;

export interface SalesCompsMapboxFeature {
    id: string;
    place_name: string;
    center: [number, number];
    context?: Array<{ id: string; text: string }>;
}

export type NhData = { id: number; name: string; city: string; geojson: string };

/** Sale-recency window, in months. 0 means "all time" (no cutoff). */
export type SaleWindowMonths = 6 | 12 | 24 | 0;

export interface SalesCompsSearchParams {
    addr: string;
    coords: [number, number] | null;
    radius: number;
    units: string;
    area: string;
    yearBuilt: string;
    saleWindowMonths: SaleWindowMonths;
    filterMode: "radius" | "neighborhood";
    zip?: string | null;
}
