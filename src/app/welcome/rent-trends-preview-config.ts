// Shared config for the landing-page rent-trends preview. Lives in its own
// plain module (no "use client") so the hero mockup and the cycling
// <AppPreview /> rent-charts tab agree on cities, colors keys, and series.

import type { TrendRow } from "@/app/(app)/analytics/rent-trends/trends-utils";

export const PREVIEW_CITIES = [
    { city: "Burlingame", state: "CA" },
    { city: "Santa Clara", state: "CA" },
    { city: "San Mateo", state: "CA" },
];

// Default the mockup on 1BR; the series includes Studio–3BR so the bed chips can switch.
export const PREVIEW_BEDS = [1];
const PREVIEW_ALL_BEDS = [0, 1, 2, 3] as const;
const PREVIEW_BED_SCALE: Record<number, number> = { 0: 0.78, 1: 1, 2: 1.32, 3: 1.65 };

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
    return PREVIEW_ALL_BEDS.flatMap((beds) =>
        weeks.map((week_start, i) => {
            const t = i / (weeks.length - 1);
            const wobble = Math.round(Math.sin(i * 0.55 + phase + beds) * 28);
            const oneBed = start + (end - start) * t + wobble;
            return {
                week_start,
                beds,
                median_rent: Math.round(oneBed * PREVIEW_BED_SCALE[beds]),
                listing_count: 12,
            };
        }),
    );
}

const WEEKS = previewWeeks();

export const PREVIEW_RENT_RESULTS: Record<string, TrendRow[]> = {
    [previewAreaId("Burlingame", "CA")]: mockSeries(WEEKS, 2700, 2850, 0.2),
    [previewAreaId("Santa Clara", "CA")]: mockSeries(WEEKS, 2390, 2600, 1.1),
    [previewAreaId("San Mateo", "CA")]: mockSeries(WEEKS, 2570, 2948, 2.4),
};
