"use client";

import { type SyntheticEvent, useCallback, useEffect, useMemo, useRef } from "react";
import { TrendingUp, Triangle } from "lucide-react";
import { Bar, ComposedChart, ErrorBar, Line, ReferenceLine, Tooltip } from "recharts";
import type { AreaSelection } from "@/app/(app)/analytics/rent-trends/trends-utils";
import {
    SALES_TREND_SMALL_SAMPLE_THRESHOLD,
    salesTrendChartHasAnySmallSample,
    salesTrendChartPointHasSmallSample,
} from "@/app/(app)/analytics/rent-trends/trends-utils";
import {
    type ParentComparison,
    type SalesTrendYView,
    formatMetricValue,
    formatPctChange,
    formatYAxisValue,
    verticalScaleLabel,
} from "@/app/(app)/analytics/sales-trends/sales-trends-utils";
import {
    AnalyticsCartesianGrid,
    AnalyticsChartContainer,
    AnalyticsChartTooltip,
    AnalyticsTooltipRow,
    AnalyticsXAxis,
    AnalyticsYAxis,
} from "@/components/analytics/charts/analytics-chart";
import { CompCoverageBadge } from "@/components/analytics/comp-coverage-badge";
import { PARENT_LINE_COLOR, PARENT_LINE_DASH, type ParentTrendContext, formatParentComparisonBadge } from "@/lib/analytics/area-hierarchy";
import { chartPointCoverage, formatCompCoverageLabel, latestTrendCoverage, salesSourceToCoverageSource } from "@/lib/analytics/comp-coverage";
import type {
    SalesMetricSource,
    SalesTrendDisplayType,
    SalesTrendMetric,
    SalesTrendPeriod,
    SalesTrendSampleComps,
    SalesTrendUnitFilter,
} from "@/lib/analytics/filters";
import { formatNumber } from "@/utils/format";

const METRIC_OPTIONS: { value: SalesTrendMetric; label: string }[] = [
    { value: "cap_rate", label: "Cap Rate" },
    { value: "cost_per_unit", label: "Cost/Unit" },
    { value: "grm", label: "GRM" },
];

/** Labels for the %/abs (normalization) toggle, by metric. */
function yViewLabels(metric: SalesTrendMetric): { pct: string; abs: string } {
    if (metric === "cap_rate") return { pct: "Δ%", abs: "%" };
    if (metric === "grm") return { pct: "%", abs: "x" };
    return { pct: "%", abs: "$" };
}

interface SalesTrendsChartProps {
    allDisplayAreas: AreaSelection[];
    chartData: Array<Record<string, string | number | [number, number]>>;
    metric: SalesTrendMetric;
    displayType: SalesTrendDisplayType;
    period: SalesTrendPeriod;
    sampleComps: SalesTrendSampleComps;
    unitFilter: SalesTrendUnitFilter;
    showVolume: boolean;
    yView?: SalesTrendYView;
    salesSource?: SalesMetricSource;
    parentContexts?: ParentTrendContext[];
    parentComparisons?: ParentComparison[];
    onDotClick: (area: AreaSelection, payload: { month?: string; monthLabel?: string }) => void;
}

export function SalesTrendsChart({
    allDisplayAreas,
    chartData,
    metric,
    displayType,
    period,
    sampleComps,
    unitFilter,
    showVolume,
    yView = "abs",
    salesSource = "crexi",
    parentContexts = [],
    parentComparisons = [],
    onDotClick,
}: SalesTrendsChartProps) {
    const comparisonByAreaId = useMemo(() => new Map(parentComparisons.map((c) => [c.ctx.displayAreaId, c])), [parentComparisons]);
    const isPct = yView === "pct";
    const isClosed = salesSource === "crexi";
    const sampleLabel = isClosed ? "closed sale" : "listing";
    const lastTouchTooltipDrillKeyRef = useRef<string | null>(null);
    const hasData = chartData.length > 0;
    const chartHasSmallSample = useMemo(() => salesTrendChartHasAnySmallSample(chartData), [chartData]);

    const handleChartPointerSelect = useCallback(
        (state: unknown) => {
            const s = state as {
                activeTooltipIndex?: number | string;
                activeIndex?: number | string;
                activeDataKey?: string | number;
            };
            const rawIdx = s.activeTooltipIndex ?? s.activeIndex;
            const idx = typeof rawIdx === "number" && Number.isFinite(rawIdx) ? rawIdx : typeof rawIdx === "string" && rawIdx !== "" ? Number(rawIdx) : NaN;
            if (!Number.isFinite(idx) || idx < 0 || idx >= chartData.length) return;

            const datum = chartData[idx] as Record<string, unknown>;
            const month = datum.month;
            const monthLabel = datum.monthLabel;
            if (typeof month !== "string" || typeof monthLabel !== "string") return;

            const dk = s.activeDataKey;
            let area: AreaSelection | undefined;
            if (typeof dk === "string" && allDisplayAreas.some((a) => a.id === dk)) {
                area = allDisplayAreas.find((a) => a.id === dk);
            } else if (dk === "volume") {
                area = allDisplayAreas.find((a) => typeof datum[a.id] === "number");
            } else if (allDisplayAreas.length === 1) {
                [area] = allDisplayAreas;
            } else {
                area = allDisplayAreas.find((a) => typeof datum[a.id] === "number");
            }
            if (!area) return;
            onDotClick(area, { month, monthLabel });
        },
        [allDisplayAreas, chartData, onDotClick],
    );

    const renderTrendDot = useCallback(
        (area: AreaSelection, radius: number, active = false) =>
            (props: unknown) => {
                const dot = props as { cx?: number; cy?: number; payload?: { month?: string; monthLabel?: string } };
                if (typeof dot.cx !== "number" || typeof dot.cy !== "number") return null;
                const selectDot = (event: SyntheticEvent<SVGElement>) => {
                    event.stopPropagation();
                    onDotClick(area, { month: dot.payload?.month, monthLabel: dot.payload?.monthLabel });
                };
                return (
                    <g className="cursor-pointer" onClick={selectDot} onTouchEnd={selectDot}>
                        <circle cx={dot.cx} cy={dot.cy} r={active ? 12 : 10} fill="transparent" />
                        <circle cx={dot.cx} cy={dot.cy} r={radius} fill={area.color} stroke={active ? "#fff" : area.color} strokeWidth={active ? 2 : 0} />
                    </g>
                );
            },
        [onDotClick],
    );

    const CustomTooltip = ({
        active,
        payload,
        label,
    }: {
        active?: boolean;
        payload?: Array<{
            dataKey: string;
            name: string;
            color: string;
            value: number;
            payload?: { _minListingCount?: number; _minCapRateCount?: number; month?: string; monthLabel?: string };
        }>;
        label?: string;
    }) => {
        const touchEntry = payload?.find((entry) => allDisplayAreas.some((area) => area.id === entry.dataKey));
        const touchArea = allDisplayAreas.find((area) => area.id === touchEntry?.dataKey);
        const touchPoint = touchEntry?.payload;

        useEffect(() => {
            if (!active || !touchArea || !touchPoint?.month || !touchPoint.monthLabel) {
                lastTouchTooltipDrillKeyRef.current = null;
                return;
            }
            const isTouchDevice = typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.navigator.maxTouchPoints > 0);
            if (!isTouchDevice) return;
            const key = `${touchArea.id}:${touchPoint.month}`;
            if (lastTouchTooltipDrillKeyRef.current === key) return;
            lastTouchTooltipDrillKeyRef.current = key;
            onDotClick(touchArea, { month: touchPoint.month, monthLabel: touchPoint.monthLabel });
        }, [active, touchArea, touchPoint?.month, touchPoint?.monthLabel]);

        if (!active || !payload?.length) return null;
        const datum = payload[0]?.payload;
        const n = datum?._minListingCount;
        const small = salesTrendChartPointHasSmallSample(n);
        const coverage = datum ? chartPointCoverage(datum) : null;
        const coverageSource = salesSourceToCoverageSource(salesSource);
        return (
            <AnalyticsChartTooltip label={label}>
                {payload.map((entry) => (
                    <AnalyticsTooltipRow
                        key={entry.dataKey}
                        color={entry.color}
                        name={entry.name}
                        value={
                            entry.dataKey === "volume"
                                ? formatNumber(entry.value)
                                : isPct
                                  ? formatPctChange(entry.value, 2)
                                  : formatMetricValue(entry.value, metric)
                        }
                    />
                ))}
                {small && n != null && (
                    <p className="mt-2 border-t border-gray-100 pt-2 text-xs text-amber-700 dark:border-gray-600 dark:text-amber-400">
                        Small sample: {n} {sampleLabel}
                        {n !== 1 ? "s" : ""} in this period (fewer than {SALES_TREND_SMALL_SAMPLE_THRESHOLD}).
                    </p>
                )}
                {coverage && metric === "cap_rate" && (
                    <p className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                        {formatCompCoverageLabel(coverage, coverageSource)}
                    </p>
                )}
            </AnalyticsChartTooltip>
        );
    };

    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <TrendingUp className="mb-3 size-10 text-gray-300" />
                <p className="text-gray-500 dark:text-gray-400">No sales data for the selected area and period</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {allDisplayAreas.map((area) => {
                    const comparison = comparisonByAreaId.get(area.id);
                    return (
                        <div key={area.id} className="flex items-center gap-1.5">
                            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{area.label}</span>
                            {comparison && (
                                <span
                                    className={`ml-0.5 flex items-center gap-0.5 text-xs font-medium ${comparison.above ? "text-green-600" : "text-red-600"}`}
                                >
                                    <Triangle className={`size-2.5 fill-current ${comparison.above ? "" : "rotate-180"}`} aria-hidden />
                                    {formatParentComparisonBadge(comparison.pctDelta, comparison.above, comparison.ctx.badgeLabel)}
                                </span>
                            )}
                        </div>
                    );
                })}
                {parentContexts.map((ctx) => (
                    <div key={ctx.parentKey} className="flex items-center gap-1.5">
                        <svg width="22" height="8" viewBox="0 0 22 8" className="shrink-0" aria-hidden>
                            <line x1="0" y1="4" x2="22" y2="4" stroke={PARENT_LINE_COLOR} strokeWidth="2" strokeDasharray={PARENT_LINE_DASH} />
                        </svg>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{ctx.badgeLabel} avg</span>
                    </div>
                ))}
            </div>

            <AnalyticsChartContainer height={340}>
                <ComposedChart
                    data={chartData}
                    onClick={handleChartPointerSelect}
                    onTouchEnd={handleChartPointerSelect}
                    margin={{ top: 5, right: showVolume ? 60 : 20, left: 10, bottom: 5 }}
                >
                    <AnalyticsCartesianGrid />
                    <AnalyticsXAxis dataKey="monthLabel" />
                    <AnalyticsYAxis yAxisId="left" tickFormatter={(v: number) => (isPct ? formatPctChange(v) : formatYAxisValue(v, metric))} width={75} />
                    {showVolume && (
                        <AnalyticsYAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => formatNumber(v)} width={50} tickFill="#9ca3af" />
                    )}
                    <Tooltip content={<CustomTooltip />} />
                    {isPct && <ReferenceLine yAxisId="left" y={0} stroke="#d1d5db" strokeDasharray="3 3" />}
                    {showVolume && <Bar yAxisId="right" dataKey="volume" name="Volume" fill="#d1d5db" opacity={0.5} barSize={20} />}
                    {allDisplayAreas.map((area) => (
                        <Line
                            key={area.id}
                            yAxisId="left"
                            type="monotone"
                            dataKey={area.id}
                            name={area.label}
                            stroke={area.color}
                            strokeWidth={2}
                            dot={renderTrendDot(area, 3)}
                            activeDot={renderTrendDot(area, 6, true)}
                            connectNulls
                        >
                            {displayType === "Candle" && (metric === "cost_per_unit" || metric === "cap_rate") && (
                                <ErrorBar
                                    dataKey={`${area.id}_rangeErr`}
                                    width={4}
                                    stroke={area.color}
                                    strokeWidth={1.5}
                                    direction="y"
                                    isAnimationActive={false}
                                />
                            )}
                        </Line>
                    ))}
                    {parentContexts.map((ctx) => (
                        <Line
                            key={ctx.parentKey}
                            yAxisId="left"
                            type="monotone"
                            dataKey={ctx.parentKey}
                            name={`${ctx.badgeLabel} avg`}
                            stroke={PARENT_LINE_COLOR}
                            strokeWidth={1.5}
                            strokeDasharray={PARENT_LINE_DASH}
                            dot={false}
                            activeDot={{ r: 4 }}
                            connectNulls
                        />
                    ))}
                </ComposedChart>
            </AnalyticsChartContainer>

            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                {metric === "cap_rate" &&
                    `${displayType === "Average" ? "Average" : displayType === "Candle" ? (isClosed ? "Min–max range with median" : "Median") : "Median"} cap rate from ${isClosed ? "Crexi closed sales comps" : "LoopNet for-sale listings"}. Period: ${period}${isClosed ? `, Sample: ${sampleComps}` : ""}.${unitFilter !== "All" && isClosed ? ` Units: ${unitFilter}.` : ""}`}
                {metric === "cost_per_unit" &&
                    `${displayType === "Average" ? "Average" : displayType === "Candle" ? (isClosed ? "P25–P75 range with median" : "Median") : "Median"} ${isClosed ? "closed-sale price per door from Crexi API comps" : "asking price per door from LoopNet for-sale listings"}. Period: ${period}${isClosed ? `, Sample: ${sampleComps}` : ""}.${unitFilter !== "All" && isClosed ? ` Units: ${unitFilter}.` : ""}`}
                {isClosed && (
                    <>
                        {" · "}
                        <span className="italic">Click any data point to see individual listings below the chart.</span>
                    </>
                )}
            </p>
        </>
    );
}

export function SalesTrendsChartHeader({
    metric,
    displayType,
    chartHasSmallSample,
    showVolume,
    salesSource = "crexi",
    headerCoverage = null,
    yView = "abs",
    onYViewChange,
}: {
    metric: SalesTrendMetric;
    displayType: SalesTrendDisplayType;
    chartHasSmallSample: boolean;
    showVolume: boolean;
    salesSource?: SalesMetricSource;
    headerCoverage?: ReturnType<typeof latestTrendCoverage>;
    yView?: SalesTrendYView;
    onYViewChange?: (view: SalesTrendYView) => void;
}) {
    const isClosed = salesSource === "crexi";
    const labels = yViewLabels(metric);
    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                    {METRIC_OPTIONS.find((m) => m.value === metric)?.label ?? "Sales"} — {displayType} · {isClosed ? "Closed Sales" : "Asking Listings"}
                </h2>
                {chartHasSmallSample && (
                    <span className="shrink-0 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                        Some periods have fewer than {SALES_TREND_SMALL_SAMPLE_THRESHOLD} {isClosed ? "closed sales" : "listings"}
                    </span>
                )}
                {headerCoverage && metric === "cap_rate" && <CompCoverageBadge counts={headerCoverage} source={salesSourceToCoverageSource(salesSource)} />}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <span>Vertical Scale: {yView === "pct" ? "% change" : verticalScaleLabel(metric)}</span>
                {onYViewChange && (
                    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                        <button
                            type="button"
                            onClick={() => onYViewChange("pct")}
                            className={`rounded-md px-3 py-1 font-medium transition-colors ${
                                yView === "pct"
                                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            {labels.pct}
                        </button>
                        <button
                            type="button"
                            onClick={() => onYViewChange("abs")}
                            className={`rounded-md px-3 py-1 font-medium transition-colors ${
                                yView === "abs"
                                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            {labels.abs}
                        </button>
                    </div>
                )}
                {showVolume && (
                    <span className="ml-2 rounded border border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-700">Volume ▶ right axis</span>
                )}
            </div>
        </div>
    );
}
