"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { RentChartGrid } from "@/app/(app)/analytics/rent-trends/rent-chart-grid";
import { type AreaSelection } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { AreaTypeSelect } from "@/components/analytics/filters/area-type-select";
import { BedsSelect } from "@/components/analytics/filters/beds-select";
import { SegmentToggle } from "@/components/analytics/filters/segment-toggle";
import { RENT_TREND_BED_OPTIONS } from "@/lib/analytics/filters";
import { cn } from "@/lib/utils";
import { MAP_ZOOM_EVENT } from "./market-map";
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
}: {
    areas: AreaSelection[];
    activeAreaId: string | null;
    onAreaSelect: (id: string) => void;
}) {
    return (
        <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="pointer-events-none flex min-w-0 flex-col gap-2 select-none sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">Area type</span>
                <AreaTypeSelect value="City" onChange={noop} />
            </div>

            <div className="flex items-start gap-4">
                <span className="w-24 shrink-0 pt-2 text-sm text-gray-500 dark:text-gray-400">Area</span>
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    {areas.map((area) => {
                        const isActive = activeAreaId === null || activeAreaId === area.id;
                        return (
                            <button
                                key={area.id}
                                type="button"
                                aria-pressed={activeAreaId === area.id}
                                onClick={() => onAreaSelect(area.id)}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-opacity",
                                    "cursor-pointer hover:opacity-100",
                                    isActive ? "opacity-100" : "opacity-40",
                                )}
                                style={{ borderColor: area.color, color: area.color, backgroundColor: `${area.color}${activeAreaId === area.id ? "28" : "14"}` }}
                            >
                                <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                                {area.label}
                            </button>
                        );
                    })}
                    <span className="pointer-events-none flex size-6 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-600">
                        <span className="mb-px text-base leading-none">+</span>
                    </span>
                </div>
            </div>

            <div className="pointer-events-none flex items-center gap-4 select-none">
                <span className="w-24 shrink-0 text-sm text-gray-500 dark:text-gray-400">Bedrooms</span>
                <BedsSelect mode="single" options={RENT_TREND_BED_OPTIONS} selected={PREVIEW_BEDS} onChange={noop} />
            </div>

            <div className="pointer-events-none flex items-center gap-4 select-none">
                <span className="w-24 shrink-0 text-sm text-gray-500 dark:text-gray-400">Segment</span>
                <SegmentToggle value="mid" onChange={noop} />
            </div>
        </div>
    );
}

export function RentTrendsPreview({ showAreaStats = true }: { showAreaStats?: boolean }) {
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

    const [activeAreaId, setActiveAreaId] = useState<string | null>(null);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent(MAP_ZOOM_EVENT));
    }, []);

    const views = useMemo(
        () => [{ id: "all" as const, areas }, ...areas.map((area) => ({ id: area.id, areas: [area] }))],
        [areas],
    );
    const activeViewId = activeAreaId ?? "all";

    const handleAreaSelect = (id: string) => {
        setActiveAreaId((current) => (current === id ? null : id));
    };

    return (
        <>
            <MockFilterPanel areas={areas} activeAreaId={activeAreaId} onAreaSelect={handleAreaSelect} />
            <div className="grid min-w-0 overflow-hidden">
                {views.map((view) => {
                    const isActive = view.id === activeViewId;
                    return (
                        <motion.div
                            key={view.id}
                            className="col-start-1 row-start-1 min-w-0"
                            animate={{ opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            aria-hidden={!isActive}
                            style={{ pointerEvents: isActive ? "auto" : "none", zIndex: isActive ? 1 : 0 }}
                        >
                            <RentChartGrid
                                displayAreas={view.areas}
                                displayRentResults={PREVIEW_RENT_RESULTS}
                                displayActivityResults={{}}
                                selectedBeds={PREVIEW_BEDS}
                                hasActivity={false}
                                showLegend={false}
                                showAreaStats={showAreaStats}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}
