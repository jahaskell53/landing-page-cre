"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { type AreaSelection } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { AreaTypeSelect } from "@/components/analytics/filters/area-type-select";
import { BedsSelect } from "@/components/analytics/filters/beds-select";
import { ANALYTICS_AREA_TYPES, RENT_TREND_BED_OPTIONS } from "@/lib/analytics/filters";
import { MAP_ZOOM_EVENT } from "./market-map";
import { PreviewChip, PreviewFadeStack, usePreviewToggle } from "./preview-interaction";
import { PreviewRentChart } from "./preview-rent-chart";
import { PREVIEW_BEDS, PREVIEW_CITIES, PREVIEW_RENT_RESULTS, previewAreaId } from "./rent-trends-preview-config";

// Landing-page series palette. The shared analytics `AREA_COLORS`
// (blue/orange/violet/green/red) mixes warm hues that clash with this page's
// navy/blue theme, so the preview uses its own cool-toned categorical set —
// navy → teal → violet, assigned to the three cities in fixed order.
// Validated (dataviz skill's validator) for CVD separation and ≥3:1 contrast on
// both the white and dark (gray-800) chart surfaces.
//
// The lead series is a deep brand navy for emphasis. Navy is intentionally
// darker than the other two (it visually leads, matching the page's blue-900
// accent) — but pure navy is unreadable on the dark chart surface, so in dark
// mode it lightens to blue-400, mirroring how the rest of the page's navy
// (buttons, the "mid-market" highlight) resolves in dark.
const LEAD_COLOR_LIGHT = "#1e3a8a"; // blue-900 — brand navy
const LEAD_COLOR_DARK = "#60a5fa"; // blue-400 — legible on gray-800
const PREVIEW_COLORS_REST = ["#0d9488", "#8b5cf6"]; // teal, violet

const noop = () => {};

function MockFilterPanel({
    areas,
    activeAreaId,
    onAreaSelect,
    selectedBeds,
    onBedsChange,
}: {
    areas: AreaSelection[];
    activeAreaId: string | null;
    onAreaSelect: (id: string) => void;
    selectedBeds: number[];
    onBedsChange: (beds: number[]) => void;
}) {
    return (
        <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="pointer-events-none flex min-w-0 flex-col gap-2 select-none sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">Area type</span>
                <select
                    aria-label="Area type"
                    value="City"
                    onChange={noop}
                    className="h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-900 sm:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                    {ANALYTICS_AREA_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <div className="hidden min-w-0 sm:block">
                    <AreaTypeSelect value="City" onChange={noop} />
                </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                <span className="shrink-0 text-sm text-gray-500 sm:w-24 sm:pt-2 dark:text-gray-400">Area</span>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {areas.map((area) => {
                        const isActive = activeAreaId === null || activeAreaId === area.id;
                        return (
                            <PreviewChip key={area.id} selected={isActive} onSelect={() => onAreaSelect(area.id)} color={area.color}>
                                <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                                {area.label}
                            </PreviewChip>
                        );
                    })}
                    <span className="pointer-events-none flex size-6 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-600">
                        <span className="mb-px text-base leading-none">+</span>
                    </span>
                </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">Bedrooms</span>
                <select
                    aria-label="Bedrooms"
                    value={selectedBeds[0] ?? 1}
                    onChange={(event) => onBedsChange([Number(event.target.value)])}
                    className="h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-900 sm:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                    {RENT_TREND_BED_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="hidden min-w-0 sm:block">
                    <BedsSelect mode="single" options={RENT_TREND_BED_OPTIONS} selected={selectedBeds} onChange={onBedsChange} />
                </div>
            </div>
        </div>
    );
}

export function RentTrendsPreview({ showAreaStats: _showAreaStats = true }: { showAreaStats?: boolean }) {
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

    const [activeAreaId, toggleArea] = usePreviewToggle<string>(null);
    const [selectedBeds, setSelectedBeds] = useState<number[]>(PREVIEW_BEDS);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent(MAP_ZOOM_EVENT));
    }, []);

    const views = useMemo(
        () => [{ id: "all" as const, areas }, ...areas.map((area) => ({ id: area.id, areas: [area] }))],
        [areas],
    );
    const activeViewId = activeAreaId ?? "all";

    return (
        <>
            <MockFilterPanel
                areas={areas}
                activeAreaId={activeAreaId}
                onAreaSelect={toggleArea}
                selectedBeds={selectedBeds}
                onBedsChange={setSelectedBeds}
            />
            <PreviewFadeStack items={views} activeId={activeViewId}>
                {(view) => (
                    <PreviewRentChart areas={view.areas} areaResults={PREVIEW_RENT_RESULTS} selectedBeds={selectedBeds} isDark={isDark} />
                )}
            </PreviewFadeStack>
        </>
    );
}
