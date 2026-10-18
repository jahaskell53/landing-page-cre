// Shared config for the landing-page rent-trends preview. Lives in its own
// plain module (no "use client") so the hero mockup and the cycling
// <AppPreview /> rent-charts tab agree on cities, colors keys, and series.

import type { TrendRow } from "@/app/(app)/analytics/rent-trends/trends-utils";

export const PREVIEW_CITIES = [
    { city: "Burlingame", state: "CA" },
    { city: "Santa Clara", state: "CA" },
    { city: "San Mateo", state: "CA" },
];

// 1BR median rent — one clean, comparable series per city.
export const PREVIEW_BEDS = [1];

export function previewAreaId(city: string, state: string): string {
    return `city:${city}:${state}`;
}

// Static 1BR weekly series for the public mockup — no RPC. Ends near the
// values shown in the previous live scrape so the hero still reads as real.
const PREVIEW_WEEK_COUNT = 32;
const PREVIEW_WEEK_START = "2026-03-09"; // Mondays through 2026-10-12

function previewWeeks(): string[] {
    const weeks: string[] = [];
    const cursor = new Date(`${PREVIEW_WEEK_START}T00:00:00Z`);
    for (let i = 0; i < PREVIEW_WEEK_COUNT; i += 1) {
        weeks.push(cursor.toISOString().slice(0, 10));
        cursor.setUTCDate(cursor.getUTCDate() + 7);
    }
    return weeks;
}

function mockSeries(weeks: string[], start: number, end: number, phase: number): TrendRow[] {
    return weeks.map((week_start, i) => {
        const t = i / (weeks.length - 1);
        const wobble = Math.round(Math.sin(i * 0.55 + phase) * 28);
        return {
            week_start,
            beds: PREVIEW_BEDS[0],
            median_rent: Math.round(start + (end - start) * t + wobble),
            listing_count: 12,
        };
    });
}

const WEEKS = previewWeeks();

export const PREVIEW_RENT_RESULTS: Record<string, TrendRow[]> = {
    [previewAreaId("Burlingame", "CA")]: mockSeries(WEEKS, 2700, 2850, 0.2),
    [previewAreaId("Santa Clara", "CA")]: mockSeries(WEEKS, 2390, 2600, 1.1),
    [previewAreaId("San Mateo", "CA")]: mockSeries(WEEKS, 2570, 2948, 2.4),
};
