"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Triangle } from "lucide-react";
import { type ParentTrendContext, compareToParent, formatParentComparisonBadge } from "@/lib/analytics/area-hierarchy";
import { formatPercent } from "@/utils/format";
import { MarketActivitySection } from "./market-activity-section";
import { RentTrendsSection } from "./rent-trends-section";
import {
    type ActivityRow,
    type AreaSelection,
    BED_DASH,
    BED_KEYS,
    type Granularity,
    type TrendRow,
    aggregateTrendRows,
    formatDollars,
    getAvailableGranularities,
    latestPeriodLabel,
    pctChange,
} from "./trends-utils";

interface RentChartGridProps {
    displayAreas: AreaSelection[];
    displayRentResults: Record<string, TrendRow[]>;
    displayActivityResults: Record<string, ActivityRow[]>;
    selectedBeds: number[];
    hasActivity: boolean;
    parentContexts?: ParentTrendContext[];
    parentRentResults?: Record<string, TrendRow[]>;
    /** Render the color-key legend column under the stat panel. Defaults to true (the full tool). */
    showLegend?: boolean;
    /** Render the per-area median rent stat column. Defaults to true (the full tool). */
    showAreaStats?: boolean;
}

export function RentChartGrid({
    displayAreas,
    displayRentResults,
    displayActivityResults,
    selectedBeds,
    hasActivity,
    parentContexts = [],
    parentRentResults = {},
    showLegend = true,
    showAreaStats = true,
}: RentChartGridProps) {
    const parentByDisplayId = new Map(parentContexts.map((ctx) => [ctx.displayAreaId, ctx]));

    const [granularity, setGranularity] = useState<Granularity>("wow");
    const availableGranularities = useMemo(() => getAvailableGranularities(displayRentResults), [displayRentResults]);

    // Reset to WoW if the current median period is no longer supported by the loaded data
    useEffect(() => {
        if (!availableGranularities.includes(granularity)) {
            setGranularity("wow");
        }
    }, [availableGranularities]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={showAreaStats ? "grid grid-cols-4 gap-4" : "grid grid-cols-1 gap-4"}>
            {showAreaStats && (
                <div className="col-span-1 flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                    {displayAreas.map((area) => {
                        const parentCtx = parentByDisplayId.get(area.id);
                        return (
                            <div key={area.id}>
                                <div className="mb-2 flex items-center gap-1.5">
                                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                                    <span className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{area.label}</span>
                                </div>
                                <div className="space-y-2">
                                    {selectedBeds.map((beds) => {
                                        const bedEntry = BED_KEYS.find((b) => b.beds === beds)!;
                                        const rows = aggregateTrendRows(
                                            (displayRentResults[area.id] ?? []).filter((r) => r.beds === beds),
                                            granularity,
                                        );
                                        const latest = rows.length > 0 ? rows[rows.length - 1].median_rent : undefined;
                                        const first = rows.length > 0 ? rows[0].median_rent : undefined;
                                        const change = rows.length >= 2 ? pctChange(first, latest) : null;

                                        let parentComparison: { pctDelta: number; above: boolean } | null = null;
                                        if (parentCtx && selectedBeds.length === 1) {
                                            const parentRows = aggregateTrendRows(
                                                (parentRentResults[parentCtx.parentKey] ?? []).filter((r) => r.beds === beds),
                                                granularity,
                                            );
                                            const parentLatest = parentRows.length > 0 ? parentRows[parentRows.length - 1].median_rent : undefined;
                                            parentComparison = compareToParent(latest, parentLatest);
                                        }

                                        return (
                                            <div key={beds}>
                                                {selectedBeds.length > 1 && <p className="mb-0.5 text-xs text-gray-400 dark:text-gray-500">{bedEntry.label}</p>}
                                                {latest != null ? (
                                                    <>
                                                        <p className="text-lg font-semibold" style={{ color: area.color }}>
                                                            {formatDollars(latest)}
                                                        </p>
                                                        {selectedBeds.length === 1 && (
                                                            <p className="mt-0.5 text-xs text-gray-400">
                                                                {bedEntry.label} · {latestPeriodLabel(granularity)}
                                                            </p>
                                                        )}
                                                        {parentComparison && parentCtx && (
                                                            <div
                                                                className={`mt-1 flex items-center gap-1 text-xs font-medium ${parentComparison.above ? "text-green-600" : "text-red-600"}`}
                                                            >
                                                                <Triangle
                                                                    className={`size-3 fill-current ${parentComparison.above ? "" : "rotate-180"}`}
                                                                    aria-hidden
                                                                />
                                                                {formatParentComparisonBadge(
                                                                    parentComparison.pctDelta,
                                                                    parentComparison.above,
                                                                    parentCtx.badgeLabel,
                                                                )}
                                                            </div>
                                                        )}
                                                        {change != null && (
                                                            <div
                                                                className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}
                                                            >
                                                                {change >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                                                                {formatPercent(Math.abs(change), 1)} over period
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="text-lg font-semibold text-gray-400">—</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={showAreaStats ? "col-span-3 row-span-2" : "col-span-1"}>
                <RentTrendsSection
                    areas={displayAreas}
                    areaResults={displayRentResults}
                    selectedBeds={selectedBeds}
                    granularity={granularity}
                    onGranularityChange={setGranularity}
                    availableGranularities={availableGranularities}
                    parentContexts={parentContexts}
                    parentResults={parentRentResults}
                />
            </div>

            {showLegend && (
                <div className="col-span-1 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                    <div className="space-y-2">
                        {displayAreas.map((area) => (
                            <div key={area.id} className="flex items-center gap-1.5">
                                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                                <span className="truncate text-xs text-gray-600 dark:text-gray-400">{area.label}</span>
                            </div>
                        ))}
                    </div>
                    {parentContexts.length > 0 && (
                        <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                            {parentContexts.map((ctx) => (
                                <div key={ctx.parentKey} className="flex items-center gap-2">
                                    <svg width="28" height="10" viewBox="0 0 28 10" className="shrink-0 text-gray-400 dark:text-gray-500">
                                        <line x1="0" y1="5" x2="28" y2="5" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                                    </svg>
                                    <span className="truncate text-sm text-gray-500 dark:text-gray-400">{ctx.badgeLabel} avg</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {selectedBeds.length > 1 && (
                        <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                            {selectedBeds.map((beds) => {
                                const bedEntry = BED_KEYS.find((b) => b.beds === beds)!;
                                const dash = BED_DASH[beds] ?? "";
                                return (
                                    <div key={beds} className="flex items-center gap-2">
                                        <svg width="28" height="10" viewBox="0 0 28 10" className="shrink-0 text-gray-400 dark:text-gray-500">
                                            <line x1="0" y1="5" x2="28" y2="5" stroke="currentColor" strokeWidth="2" strokeDasharray={dash || undefined} />
                                        </svg>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{bedEntry.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {hasActivity && (
                <div className="col-span-4 mb-8">
                    <MarketActivitySection areas={displayAreas} areaResults={displayActivityResults} selectedBeds={selectedBeds} />
                </div>
            )}
        </div>
    );
}
