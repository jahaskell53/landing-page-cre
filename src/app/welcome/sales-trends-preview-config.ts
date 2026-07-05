// Shared config for the landing-page sales-trends preview in the app mockup.

export const PREVIEW_SALES_CITY = { city: "Oakland", state: "CA" } as const;

export const PREVIEW_SALES_AREA_ID = `city:${PREVIEW_SALES_CITY.city}:${PREVIEW_SALES_CITY.state}`;

// Matches the frozen filter panel defaults in `sales-trends-preview.tsx`.
export const PREVIEW_SALES_MONTHS_PER_BUCKET = 3;
