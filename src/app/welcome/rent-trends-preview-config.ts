// Shared config for the landing-page rent-trends preview. Lives in its own
// plain module (no "use client") so both the server prefetch in `page.tsx`
// and the client `<RentTrendsPreview />` agree on which series to load and
// how each series is keyed.

export const PREVIEW_CITIES = [
    { city: "Burlingame", state: "CA" },
    { city: "Santa Clara", state: "CA" },
    { city: "San Mateo", state: "CA" },
    { city: "Redwood City", state: "CA" },
];

// 1BR median rent — one clean, comparable series per city.
export const PREVIEW_BEDS = [1];

export function previewAreaId(city: string, state: string): string {
    return `city:${city}:${state}`;
}
