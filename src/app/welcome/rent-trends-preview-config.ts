// Shared config for the landing-page rent-trends preview. Lives in its own
// plain module (no "use client") so the hero chart card and the
// <AppPreview /> rent-charts tab agree on cities, colors keys, and series.

import type { TrendRow } from "@/app/(app)/analytics/rent-trends/trends-utils";
import type { AnalyticsAreaType } from "@/lib/analytics/filters";

export const PREVIEW_CITIES = [
    { city: "Burlingame", state: "CA" },
    { city: "Santa Clara", state: "CA" },
    { city: "San Mateo", state: "CA" },
];

export const PREVIEW_SF_NEIGHBORHOODS = [
    { name: "Mission", city: "San Francisco", state: "CA" },
    { name: "Hayes Valley", city: "San Francisco", state: "CA" },
    { name: "Pacific Heights", city: "San Francisco", state: "CA" },
];

// Default the mockup on 1BR; the series includes Studio–3BR so the bed chips can switch.
export const PREVIEW_BEDS = [1];
const PREVIEW_ALL_BEDS = [0, 1, 2, 3] as const;
const PREVIEW_BED_SCALE: Record<number, number> = { 0: 0.78, 1: 1, 2: 1.32, 3: 1.65 };

export function previewAreaId(city: string, state: string): string {
    return `city:${city}:${state}`;
}

export function previewNeighborhoodId(name: string, city: string, state: string): string {
    return `nh:${name}:${city}:${state}`;
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

export const PREVIEW_SF_NEIGHBORHOOD_RESULTS: Record<string, TrendRow[]> = {
    [previewNeighborhoodId("Mission", "San Francisco", "CA")]: mockSeries(WEEKS, 3405, 4045, 0.4),
    [previewNeighborhoodId("Hayes Valley", "San Francisco", "CA")]: mockSeries(WEEKS, 4000, 4298, 1.5),
    [previewNeighborhoodId("Pacific Heights", "San Francisco", "CA")]: mockSeries(WEEKS, 4990, 5195, 2.3),
};

export type ShowcaseAreaOption = {
    id: string;
    label: string;
    city: string;
    state: string;
    defaultSelected?: boolean;
};

export const PREVIEW_SHOWCASE_AREAS_BY_TYPE: Record<AnalyticsAreaType, readonly ShowcaseAreaOption[]> = {
    Neighborhood: [
        { id: previewNeighborhoodId("Mission", "San Francisco", "CA"), label: "Mission", city: "San Francisco", state: "CA", defaultSelected: true },
        { id: previewNeighborhoodId("Hayes Valley", "San Francisco", "CA"), label: "Hayes Valley", city: "San Francisco", state: "CA", defaultSelected: true },
        { id: previewNeighborhoodId("Pacific Heights", "San Francisco", "CA"), label: "Pacific Heights", city: "San Francisco", state: "CA", defaultSelected: true },
        { id: previewNeighborhoodId("Marina", "San Francisco", "CA"), label: "Marina", city: "San Francisco", state: "CA", defaultSelected: false },
        { id: previewNeighborhoodId("Noe Valley", "San Francisco", "CA"), label: "Noe Valley", city: "San Francisco", state: "CA", defaultSelected: false },
    ],
    "ZIP Code": [
        { id: "zip:94110", label: "94110", city: "San Francisco", state: "CA", defaultSelected: true },
        { id: "zip:94102", label: "94102", city: "San Francisco", state: "CA", defaultSelected: true },
        { id: "zip:94115", label: "94115", city: "San Francisco", state: "CA", defaultSelected: true },
        { id: "zip:94123", label: "94123", city: "San Francisco", state: "CA", defaultSelected: false },
    ],
    City: [
        { id: previewAreaId("Burlingame", "CA"), label: "Burlingame", city: "Burlingame", state: "CA", defaultSelected: true },
        { id: previewAreaId("Santa Clara", "CA"), label: "Santa Clara", city: "Santa Clara", state: "CA", defaultSelected: true },
        { id: previewAreaId("San Mateo", "CA"), label: "San Mateo", city: "San Mateo", state: "CA", defaultSelected: true },
        { id: previewAreaId("Redwood City", "CA"), label: "Redwood City", city: "Redwood City", state: "CA", defaultSelected: false },
    ],
    County: [
        { id: "county:San Francisco:CA", label: "San Francisco", city: "San Francisco", state: "CA", defaultSelected: true },
        { id: "county:San Mateo:CA", label: "San Mateo", city: "San Mateo", state: "CA", defaultSelected: true },
        { id: "county:Santa Clara:CA", label: "Santa Clara", city: "Santa Clara", state: "CA", defaultSelected: true },
        { id: "county:Alameda:CA", label: "Alameda", city: "Oakland", state: "CA", defaultSelected: false },
    ],
    MSA: [
        { id: "msa:sf-oakland", label: "SF-Oakland MSA", city: "San Francisco", state: "CA", defaultSelected: true },
        { id: "msa:san-jose", label: "San Jose MSA", city: "San Jose", state: "CA", defaultSelected: true },
        { id: "msa:sacramento", label: "Sacramento MSA", city: "Sacramento", state: "CA", defaultSelected: true },
    ],
};

export const PREVIEW_SHOWCASE_RESULTS: Record<string, TrendRow[]> = {
    ...PREVIEW_RENT_RESULTS,
    ...PREVIEW_SF_NEIGHBORHOOD_RESULTS,
    [previewNeighborhoodId("Marina", "San Francisco", "CA")]: mockSeries(WEEKS, 4350, 4680, 0.9),
    [previewNeighborhoodId("Noe Valley", "San Francisco", "CA")]: mockSeries(WEEKS, 3890, 4210, 1.9),
    "zip:94110": mockSeries(WEEKS, 3390, 4010, 0.5),
    "zip:94102": mockSeries(WEEKS, 3850, 4190, 1.4),
    "zip:94115": mockSeries(WEEKS, 4820, 5095, 2.1),
    "zip:94123": mockSeries(WEEKS, 4310, 4640, 1.0),
    [previewAreaId("Redwood City", "CA")]: mockSeries(WEEKS, 2640, 2890, 1.7),
    "county:San Francisco:CA": mockSeries(WEEKS, 3690, 4120, 0.6),
    "county:San Mateo:CA": mockSeries(WEEKS, 2720, 2940, 1.3),
    "county:Santa Clara:CA": mockSeries(WEEKS, 2580, 2790, 2.2),
    "county:Alameda:CA": mockSeries(WEEKS, 2290, 2485, 0.8),
    "msa:sf-oakland": mockSeries(WEEKS, 3120, 3390, 0.5),
    "msa:san-jose": mockSeries(WEEKS, 2650, 2860, 1.6),
    "msa:sacramento": mockSeries(WEEKS, 1840, 1975, 2.4),
};
