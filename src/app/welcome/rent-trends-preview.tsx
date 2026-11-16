"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { type AreaSelection, type TrendRow } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { AreaTypeSelect } from "@/components/analytics/filters/area-type-select";
import { BedsSelect } from "@/components/analytics/filters/beds-select";
import { ANALYTICS_AREA_TYPES, type AnalyticsAreaType, RENT_TREND_BED_OPTIONS } from "@/lib/analytics/filters";
import { MAP_ZOOM_EVENT } from "./market-map";
import { PreviewChip, PreviewFadeStack, usePreviewToggle } from "./preview-interaction";
import { PreviewNativeSelect } from "./preview-native-select";
import { PreviewRentChart } from "./preview-rent-chart";
import {
    PREVIEW_BEDS,
    PREVIEW_CITIES,
    PREVIEW_RENT_RESULTS,
    PREVIEW_SHOWCASE_AREAS_BY_TYPE,
    PREVIEW_SHOWCASE_RESULTS,
    previewAreaId,
} from "./rent-trends-preview-config";

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
const PREVIEW_COLORS_REST = ["#0d9488", "#8b5cf6", "#d97706", "#ec4899"]; // teal, violet, amber, pink

const noop = () => {};

function MockFilterPanel({
    areaType = "City",
    areas,
    activeAreaId,
    onAreaSelect,
    selectedBeds,
    onBedsChange,
}: {
    areaType?: AnalyticsAreaType;
    areas: AreaSelection[];
    activeAreaId: string | null;
    onAreaSelect: (id: string) => void;
    selectedBeds: number[];
    onBedsChange: (beds: number[]) => void;
}) {
    return (
        <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="pointer-events-none flex min-w-0 items-center justify-between gap-3 select-none sm:justify-start sm:gap-4">
                <span className="shrink-0 text-[15px] text-gray-500 sm:w-24 sm:text-sm dark:text-gray-400">Area type</span>
                <PreviewNativeSelect
                    aria-label="Area type"
                    value={areaType}
                    onChange={noop}
                    align="end"
                    options={ANALYTICS_AREA_TYPES.map((type) => ({ value: type, label: type }))}
                />
                <div className="hidden min-w-0 sm:block">
                    <AreaTypeSelect value={areaType} onChange={noop} />
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

            <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start sm:gap-4">
                <span className="shrink-0 text-[15px] text-gray-500 sm:w-24 sm:text-sm dark:text-gray-400">Bedrooms</span>
                <PreviewNativeSelect
                    aria-label="Bedrooms"
                    value={String(selectedBeds[0] ?? 1)}
                    onChange={(next) => onBedsChange([Number(next)])}
                    align="end"
                    options={RENT_TREND_BED_OPTIONS.map((option) => ({ value: String(option.value), label: option.label }))}
                />
                <div className="hidden min-w-0 sm:block">
                    <BedsSelect mode="single" options={RENT_TREND_BED_OPTIONS} selected={selectedBeds} onChange={onBedsChange} />
                </div>
            </div>
        </div>
    );
}

const subscribe = () => () => {};

function usePreviewThemeColors() {
    // Resolve the lead-series color against the active theme. Guard on `mounted`
    // so SSR and the first client paint both use the light navy (avoids a
    // hydration mismatch); after hydration it flips to blue-400 if dark.
    const { resolvedTheme } = useTheme();
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);
    const isDark = mounted && resolvedTheme === "dark";
    const colors = useMemo(() => [isDark ? LEAD_COLOR_DARK : LEAD_COLOR_LIGHT, ...PREVIEW_COLORS_REST], [isDark]);
    return { isDark, colors };
}

function buildInitialShowcaseSelection(): Record<AnalyticsAreaType, string[]> {
    return {
        Neighborhood: PREVIEW_SHOWCASE_AREAS_BY_TYPE.Neighborhood.filter((a) => a.defaultSelected).map((a) => a.id),
        "ZIP Code": PREVIEW_SHOWCASE_AREAS_BY_TYPE["ZIP Code"].filter((a) => a.defaultSelected).map((a) => a.id),
        City: PREVIEW_SHOWCASE_AREAS_BY_TYPE.City.filter((a) => a.defaultSelected).map((a) => a.id),
        County: PREVIEW_SHOWCASE_AREAS_BY_TYPE.County.filter((a) => a.defaultSelected).map((a) => a.id),
        MSA: PREVIEW_SHOWCASE_AREAS_BY_TYPE.MSA.filter((a) => a.defaultSelected).map((a) => a.id),
    };
}

function usePreviewRentAreas(preset: "cities" | "sf-neighborhoods" = "cities") {
    const { isDark, colors } = usePreviewThemeColors();

    const areas = useMemo<AreaSelection[]>(() => {
        const list = preset === "sf-neighborhoods" ? PREVIEW_SHOWCASE_AREAS_BY_TYPE.Neighborhood : PREVIEW_CITIES;
        return list.map((item, i) =>
            "id" in item
                ? {
                      id: item.id,
                      label: item.label,
                      color: colors[i % colors.length],
                      cityName: item.city,
                      cityState: item.state,
                  }
                : {
                      id: previewAreaId(item.city, item.state),
                      label: item.city,
                      color: colors[i % colors.length],
                      cityName: item.city,
                      cityState: item.state,
                  },
        );
    }, [colors, preset]);

    return { areas, isDark };
}

const HERO_CARD_CLASS = "overflow-hidden rounded-[14px] bg-white px-6 pt-[34px] pb-12 sm:px-12 dark:bg-gray-950";
const HERO_CARD_MIN_HEIGHT = "min-h-[520px] sm:min-h-[679px]";

export function HeroRentChartFallback() {
    return <div className={`${HERO_CARD_CLASS} ${HERO_CARD_MIN_HEIGHT}`} aria-hidden />;
}

export function HeroRentTrendsCard({ areaResults }: { areaResults: Record<string, TrendRow[]> }) {
    return (
        <ShowcaseRentTrendsCard
            defaultAreaType="City"
            height={485}
            areaResults={areaResults}
            className={`${HERO_CARD_CLASS} ${HERO_CARD_MIN_HEIGHT}`}
        />
    );
}

export function ShowcaseRentTrendsCard({
    preset = "sf-neighborhoods",
    defaultAreaType,
    height = 360,
    areaResults,
    className = "flex min-h-0 flex-1 flex-col bg-white px-6 pt-6 pb-5 sm:px-8 dark:bg-gray-900",
}: {
    preset?: "cities" | "sf-neighborhoods";
    defaultAreaType?: AnalyticsAreaType;
    height?: number;
    areaResults?: Record<string, TrendRow[]>;
    className?: string;
}) {
    const { isDark, colors } = usePreviewThemeColors();
    const [areaType, setAreaType] = useState<AnalyticsAreaType>(defaultAreaType ?? (preset === "cities" ? "City" : "Neighborhood"));
    const [selectedBeds, setSelectedBeds] = useState<number[]>(PREVIEW_BEDS);
    const [selectedIdsByType, setSelectedIdsByType] = useState<Record<AnalyticsAreaType, string[]>>(buildInitialShowcaseSelection);
    const [activeAreaId, setActiveAreaId] = useState<string | null>(null);

    const mergedResults = useMemo(() => {
        if (!areaResults) return PREVIEW_SHOWCASE_RESULTS;
        const next = { ...PREVIEW_SHOWCASE_RESULTS };
        for (const [id, rows] of Object.entries(areaResults)) {
            if (rows.length === 0) continue;
            const liveBeds = new Set(rows.map((r) => r.beds));
            const fallback = (PREVIEW_SHOWCASE_RESULTS[id] ?? []).filter((r) => !liveBeds.has(r.beds));
            next[id] = [...rows, ...fallback];
        }
        return next;
    }, [areaResults]);

    const availableAreas = useMemo<AreaSelection[]>(
        () =>
            PREVIEW_SHOWCASE_AREAS_BY_TYPE[areaType].map((item, i) => ({
                id: item.id,
                label: item.label,
                color: colors[i % colors.length],
                cityName: item.city,
                cityState: item.state,
            })),
        [areaType, colors],
    );

    const selectedIds = selectedIdsByType[areaType];
    const chipAreas = useMemo(() => availableAreas.filter((area) => selectedIds.includes(area.id)), [availableAreas, selectedIds]);
    const chartAreas = activeAreaId ? chipAreas.filter((area) => area.id === activeAreaId) : chipAreas;

    const handleAreaSelect = (id: string) => {
        setActiveAreaId((current) => (current === id ? null : id));
    };

    const handleAreaTypeChange = (next: AnalyticsAreaType) => {
        setAreaType(next);
        setActiveAreaId(null);
    };

    const handleToggleAreaMembership = (id: string) => {
        setSelectedIdsByType((prev) => {
            const current = prev[areaType];
            const included = current.includes(id);
            if (included) {
                if (current.length <= 1) return prev;
                if (activeAreaId === id) setActiveAreaId(null);
                return { ...prev, [areaType]: current.filter((item) => item !== id) };
            }
            return { ...prev, [areaType]: [...current, id] };
        });
    };

    return (
        <div className={className}>
            <PreviewRentChart
                variant="hero"
                areas={chartAreas.length > 0 ? chartAreas : chipAreas}
                chipAreas={chipAreas}
                activeAreaId={activeAreaId}
                onAreaSelect={handleAreaSelect}
                areaResults={mergedResults}
                selectedBeds={selectedBeds}
                onBedsChange={setSelectedBeds}
                areaType={areaType}
                onAreaTypeChange={handleAreaTypeChange}
                availableAreas={availableAreas}
                onToggleAreaMembership={handleToggleAreaMembership}
                isDark={isDark}
                height={height}
            />
        </div>
    );
}

export function RentTrendsPreview({
    preset = "cities",
}: {
    showAreaStats?: boolean;
    preset?: "cities" | "sf-neighborhoods";
}) {
    const { areas, isDark } = usePreviewRentAreas(preset);
    const [activeAreaId, toggleArea] = usePreviewToggle<string>(null);
    const [selectedBeds, setSelectedBeds] = useState<number[]>(PREVIEW_BEDS);
    const areaResults = preset === "sf-neighborhoods" ? PREVIEW_SHOWCASE_RESULTS : PREVIEW_RENT_RESULTS;

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
                areaType={preset === "sf-neighborhoods" ? "Neighborhood" : "City"}
                areas={areas}
                activeAreaId={activeAreaId}
                onAreaSelect={toggleArea}
                selectedBeds={selectedBeds}
                onBedsChange={setSelectedBeds}
            />
            <PreviewFadeStack items={views} activeId={activeViewId}>
                {(view) => (
                    <PreviewRentChart
                        areas={view.areas}
                        areaResults={areaResults}
                        selectedBeds={selectedBeds}
                        isDark={isDark}
                    />
                )}
            </PreviewFadeStack>
        </>
    );
}
