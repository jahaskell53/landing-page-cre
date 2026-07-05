"use client";

import { useState } from "react";
import { Line, LineChart, ReferenceLine, Tooltip } from "recharts";
import {
    AnalyticsCartesianGrid,
    AnalyticsChartContainer,
    AnalyticsXAxis,
    AnalyticsYAxis,
    CHART_TOOLTIP_STYLE,
} from "@/components/analytics/charts/analytics-chart";
import type { ParentTrendContext } from "@/lib/analytics/area-hierarchy";
import { formatPercent } from "@/utils/format";
import {
    AreaSelection,
    BED_KEYS,
    GRANULARITY_OPTIONS,
    Granularity,
    SeriesInfo,
    TrendRow,
    buildMultiAreaRentData,
    formatDollars,
    getParentRentSeriesList,
    getRentSeriesList,
} from "./trends-utils";

interface Props {
    areas: AreaSelection[];
    areaResults: Record<string, TrendRow[]>;
    selectedBeds: number[];
    granularity: Granularity;
    onGranularityChange: (granularity: Granularity) => void;
    availableGranularities: Granularity[];
    parentContexts?: ParentTrendContext[];
    parentResults?: Record<string, TrendRow[]>;
}

type YAxisView = "pct" | "abs";

function buildPctChangeData(absData: Array<Record<string, string | number>>, series: SeriesInfo[]): Array<Record<string, string | number>> {
    const baselines: Record<string, number> = {};
    for (const s of series) {
        for (const point of absData) {
            const v = point[s.key];
            if (typeof v === "number") {
                baselines[s.key] = v;
                break;
            }
        }
    }
    return absData.map((point) => {
        const out: Record<string, string | number> = { week: point.week, weekLabel: point.weekLabel };
        for (const s of series) {
            const v = point[s.key];
            const base = baselines[s.key];
            if (typeof v === "number" && base != null && base !== 0) {
                out[s.key] = parseFloat((((v - base) / base) * 100).toFixed(2));
            }
        }
        return out;
    });
}

export function RentTrendsSection({
    areas,
    areaResults,
    selectedBeds,
    granularity,
    onGranularityChange,
    availableGranularities,
    parentContexts = [],
    parentResults = {},
}: Props) {
    const [yView, setYView] = useState<YAxisView>("pct");

    const series = getRentSeriesList(areas, selectedBeds);
    const parentSeries = getParentRentSeriesList(parentContexts, selectedBeds);
    const allSeries = [...series, ...parentSeries];
    const parentChartSeries = parentContexts.map((ctx) => ({
        key: ctx.parentKey,
        rows: parentResults[ctx.parentKey] ?? [],
    }));
    const absData = buildMultiAreaRentData(areaResults, areas, selectedBeds, granularity, parentChartSeries);
    const pctData = buildPctChangeData(absData, allSeries);
    const chartData = yView === "pct" ? pctData : absData;
    const onlyOnePoint = chartData.length === 1;

    const bedLabel =
        selectedBeds.length === 1
            ? (BED_KEYS.find((b) => b.beds === selectedBeds[0])?.label ?? "")
            : selectedBeds.map((b) => BED_KEYS.find((k) => k.beds === b)?.label).join(" vs ");

    const yFormatter = yView === "pct" ? (v: number) => formatPercent(v, 1, { showSign: true }) : (v: number) => formatDollars(v);

    const showDashKey = selectedBeds.length > 1;

    const CustomTooltip = ({
        active,
        payload,
        label,
    }: {
        active?: boolean;
        payload?: Array<{ dataKey: string; name: string; color: string; value: number }>;
        label?: string;
    }) => {
        if (!active || !payload?.length) return null;
        return (
            <div style={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff", padding: "8px 12px" }}>
                <p className="mb-1 text-gray-500">{granularity === "wow" ? `Week of ${label}` : label}</p>
                {payload.map((entry) => {
                    const week = chartData.find((p) => p.weekLabel === label)?.week as string | undefined;
                    const absPoint = week ? absData.find((p) => p.week === week) : undefined;
                    const pctPoint = week ? pctData.find((p) => p.week === week) : undefined;
                    const absVal = absPoint?.[entry.dataKey] as number | undefined;
                    const pctVal = pctPoint?.[entry.dataKey] as number | undefined;
                    const dash = allSeries.find((s) => s.key === entry.dataKey)?.dash ?? "";
                    return (
                        <div key={entry.dataKey} className="flex items-center gap-2">
                            {showDashKey && (
                                <svg width={28} height={12} style={{ flexShrink: 0 }}>
                                    <line x1={1} y1={6} x2={27} y2={6} stroke={entry.color} strokeWidth={2} strokeDasharray={dash || undefined} />
                                </svg>
                            )}
                            <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}</span>
                            {yView === "abs" && absVal != null && <span>{formatDollars(absVal)}</span>}
                            {yView === "pct" && pctVal != null && (
                                <span className={pctVal >= 0 ? "text-green-600" : "text-red-500"}>{formatPercent(pctVal, 2, { showSign: true })}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="h-full rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Median Rent — {bedLabel}</h2>
                <div className="flex items-center gap-2">
                    {onlyOnePoint && (
                        <span className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-400 dark:border-gray-600 dark:bg-gray-700">
                            More data coming as scrapes accumulate
                        </span>
                    )}
                    {availableGranularities.length > 1 && (
                        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                            {GRANULARITY_OPTIONS.filter((opt) => availableGranularities.includes(opt.value)).map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => onGranularityChange(opt.value)}
                                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                        granularity === opt.value
                                            ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                        <button
                            onClick={() => setYView("pct")}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                yView === "pct"
                                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            %
                        </button>
                        <button
                            onClick={() => setYView("abs")}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                yView === "abs"
                                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            $
                        </button>
                    </div>
                </div>
            </div>
            <AnalyticsChartContainer height={280}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <AnalyticsCartesianGrid />
                    <AnalyticsXAxis dataKey="weekLabel" />
                    <AnalyticsYAxis tickFormatter={yFormatter} width={yView === "pct" ? 55 : 75} />
                    <Tooltip content={<CustomTooltip />} />

                    {yView === "pct" && <ReferenceLine y={0} stroke="#d1d5db" strokeDasharray="3 3" />}
                    {series.map((s) => (
                        <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.label}
                            stroke={s.color}
                            strokeWidth={2}
                            strokeDasharray={s.dash || undefined}
                            dot={onlyOnePoint ? { r: 5, fill: s.color } : { r: 3 }}
                            activeDot={{ r: 5 }}
                            connectNulls
                        />
                    ))}
                    {parentSeries.map((s) => (
                        <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.label}
                            stroke={s.color}
                            strokeWidth={1.5}
                            strokeDasharray={s.dash}
                            dot={onlyOnePoint ? { r: 4, fill: s.color } : false}
                            activeDot={{ r: 4 }}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </AnalyticsChartContainer>
        </div>
    );
}
