"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { RentChartGrid } from "@/app/(app)/analytics/rent-trends/rent-chart-grid";
import { type AreaSelection, type TrendRow } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { AreaTypeSelect } from "@/components/analytics/filters/area-type-select";
import { BedsSelect } from "@/components/analytics/filters/beds-select";
import { SegmentToggle } from "@/components/analytics/filters/segment-toggle";
import { getRentTrendsByCity } from "@/db/rpc/rent-trends";
import { RENT_TREND_BED_OPTIONS } from "@/lib/analytics/filters";
import { MAP_ZOOM_EVENT } from "./market-map";
import { PREVIEW_BEDS, PREVIEW_CITIES, previewAreaId } from "./rent-trends-preview-config";

// A live slice of the /analytics/rent-trends tool for the public landing page:
// real median-rent history for a handful of Bay Area cities. Unlike the old
// <MarketMap /> (illustrative made-up $/door numbers), every value here is real
// and updates as new scrapes land — so the numbers on the page match the numbers
// inside the product. The page server-prefetches the series (see
// `rent-trends-server.ts`) so the chart ships with data in the initial HTML;
// the read-only, unauthenticated `/api/rpc` proxy fetch below is the fallback
// when the prefetch was unavailable. Renders the tool surface minus the
// inventory/volume chart: per-city stat panels, the trend chart with its
// granularity + %/$ selectors, and the legend.

// Landing-page series palette. The shared analytics `AREA_COLORS`
// (blue/orange/violet/green/red) mixes warm hues that clash with this page's
// navy/blue theme, so the preview uses its own cool-toned categorical set —
// navy → teal → violet → cool-pink, assigned to the four cities in fixed order.
// Validated (dataviz skill's validator) for CVD separation and ≥3:1 contrast on
// both the white and dark (gray-800) chart surfaces.
//
// The lead series is a deep brand navy for emphasis. Navy is intentionally
// darker than the other three (it visually leads, matching the page's blue-900
// accent) — but pure navy is unreadable on the dark chart surface, so in dark
// mode it lightens to blue-400, mirroring how the rest of the page's navy
// (buttons, the "mid-market" highlight) resolves in dark.
const LEAD_COLOR_LIGHT = "#1e3a8a"; // blue-900 — brand navy
const LEAD_COLOR_DARK = "#60a5fa"; // blue-400 — legible on gray-800
const PREVIEW_COLORS_REST = ["#0d9488", "#8b5cf6", "#ec4899"]; // teal, violet, cool-pink

const noop = () => {};

// A visual-only replica of the tool's <TrendsFilterPanel /> — the same Area type
// / Area / Bedrooms / Segment controls the real /analytics/rent-trends page shows,
// frozen to the preview's selection. It's decorative (pointer-events disabled, no
// state wired up) so the landing page reads like the actual product without making
// the hero interactive.
function MockFilterPanel({ areas }: { areas: AreaSelection[] }) {
    return (
        <div
            aria-hidden
            className="pointer-events-none mb-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 select-none dark:border-gray-700 dark:bg-gray-800"
        >
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">Area type</span>
                <AreaTypeSelect value="City" onChange={noop} />
            </div>

            <div className="flex items-start gap-4">
                <span className="w-24 shrink-0 pt-2 text-sm text-gray-500 dark:text-gray-400">Area</span>
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    {areas.map((area) => (
                        <span
                            key={area.id}
                            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
                            style={{ borderColor: area.color, color: area.color, backgroundColor: `${area.color}14` }}
                        >
                            <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                            {area.label}
                        </span>
                    ))}
                    <span className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-600">
                        <span className="mb-px text-base leading-none">+</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="w-24 shrink-0 text-sm text-gray-500 dark:text-gray-400">Bedrooms</span>
                <BedsSelect mode="single" options={RENT_TREND_BED_OPTIONS} selected={PREVIEW_BEDS} onChange={noop} />
            </div>

            <div className="flex items-center gap-4">
                <span className="w-24 shrink-0 text-sm text-gray-500 dark:text-gray-400">Segment</span>
                <SegmentToggle value="mid" onChange={noop} />
            </div>
        </div>
    );
}

export function RentTrendsPreview({ initialRentResults, showAreaStats = true }: { initialRentResults?: Record<string, TrendRow[]>; showAreaStats?: boolean }) {
    // Resolve the lead-series color against the active theme. Guard on `mounted`
    // so SSR and the first client paint both use the light navy (avoids a
    // hydration mismatch); the effect below flips it to blue-400 if dark.
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted && resolvedTheme === "dark";

    const colors = useMemo(() => [isDark ? LEAD_COLOR_DARK : LEAD_COLOR_LIGHT, ...PREVIEW_COLORS_REST], [isDark]);

    const areas = useMemo<AreaSelection[]>(
        () =>
            PREVIEW_CITIES.map((c, i) => ({
                id: previewAreaId(c.city, c.state),
                label: c.city,
                color: colors[i % colors.length],
                cityName: c.city,
                cityState: c.state,
            })),
        [colors],
    );

    const [rentResults, setRentResults] = useState<Record<string, TrendRow[]>>(initialRentResults ?? {});
    const hasInitialData = Object.values(initialRentResults ?? {}).some((rows) => rows.length > 0);

    useEffect(() => {
        if (hasInitialData) {
            // Server prefetch already provided the data; just fire the hero
            // "mid-market" underline draw that used to wait on the fetch.
            window.dispatchEvent(new CustomEvent(MAP_ZOOM_EVENT));
            return;
        }
        let cancelled = false;
        Promise.all(
            PREVIEW_CITIES.map((c) =>
                getRentTrendsByCity({ p_city: c.city, p_state: c.state, p_beds: PREVIEW_BEDS[0], p_reits_only: false, p_home_type: null })
                    .then((rows) => ({ id: previewAreaId(c.city, c.state), rows: rows as TrendRow[] }))
                    .catch(() => ({ id: previewAreaId(c.city, c.state), rows: [] as TrendRow[] })),
            ),
        ).then((results) => {
            if (cancelled) return;
            const next: Record<string, TrendRow[]> = {};
            for (const r of results) next[r.id] = r.rows;
            setRentResults(next);
            // Keep the hero "mid-market" underline draw in sync now that the
            // chart has data (the old map used to fire this on its fly-in).
            window.dispatchEvent(new CustomEvent(MAP_ZOOM_EVENT));
        });
        return () => {
            cancelled = true;
        };
    }, [hasInitialData]);

    const hasData = areas.some((a) => (rentResults[a.id]?.length ?? 0) > 0);

    if (!hasData) {
        return (
            <>
                <MockFilterPanel areas={areas} />
                <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-400">Loading live rent trends…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <MockFilterPanel areas={areas} />
            <RentChartGrid
                displayAreas={areas}
                displayRentResults={rentResults}
                displayActivityResults={{}}
                selectedBeds={PREVIEW_BEDS}
                hasActivity={false}
                showLegend={false}
                showAreaStats={showAreaStats}
            />
        </>
    );
}
