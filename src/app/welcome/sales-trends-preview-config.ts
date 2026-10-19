import type { SalesTrendRowV2 } from "@/db/rpc";

export const PREVIEW_SALES_CITY = { city: "Oakland", state: "CA" } as const;

export const PREVIEW_SALES_AREA_ID = `city:${PREVIEW_SALES_CITY.city}:${PREVIEW_SALES_CITY.state}`;

export const PREVIEW_SALES_MONTHS_PER_BUCKET = 3;

function mockSalesSeries(startPrice: number, endPrice: number, cap: number): SalesTrendRowV2[] {
    const rows: SalesTrendRowV2[] = [];
    const start = Date.UTC(2021, 9, 1);
    for (let i = 0; i < 21; i += 1) {
        const month = new Date(start);
        month.setUTCMonth(month.getUTCMonth() + i * PREVIEW_SALES_MONTHS_PER_BUCKET);
        const t = i / 20;
        const wobble = Math.sin(i * 0.7) * 9000;
        const median = Math.round(startPrice + (endPrice - startPrice) * t + wobble);
        rows.push({
            month_start: month.toISOString().slice(0, 10),
            median_price: median,
            avg_price: Math.round(median * 1.04),
            p25_price: Math.round(median * 0.88),
            p75_price: Math.round(median * 1.15),
            listing_count: 8 + (i % 5),
            avg_cap_rate: cap,
            median_cap_rate: cap - 0.001,
            min_cap_rate: cap - 0.006,
            max_cap_rate: cap + 0.007,
            cap_rate_count: 6,
        });
    }
    return rows;
}

export const PREVIEW_SALES_RESULTS = {
    crexi: mockSalesSeries(310_000, 355_000, 0.054),
    loopnet: mockSalesSeries(335_000, 392_000, 0.051),
} as const;
