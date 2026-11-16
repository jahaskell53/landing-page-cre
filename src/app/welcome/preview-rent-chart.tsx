"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, usePlotArea, useXAxisScale, useYAxisScale, XAxis, YAxis } from "recharts";
import { AnalyticsChartContainer } from "@/components/analytics/charts/analytics-chart";
import { useChartAnimation } from "@/components/analytics/charts/use-chart-animation";
import { ANALYTICS_AREA_TYPES, type AnalyticsAreaType } from "@/lib/analytics/filters";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/utils/format";
import { PreviewChip } from "./preview-interaction";
import { PreviewNativeSelect } from "./preview-native-select";
import {
    type AreaSelection,
    BED_KEYS,
    type Granularity,
    type SeriesInfo,
    type TrendRow,
    buildMultiAreaRentData,
    formatDollars,
    getAvailableGranularities,
    getRentSeriesList,
} from "@/app/(app)/analytics/rent-trends/trends-utils";

type YView = "pct" | "abs";

const BUCKET_LABELS: { value: Granularity; label: string }[] = [
    { value: "wow", label: "Weekly" },
    { value: "mom", label: "Monthly" },
    { value: "qoq", label: "Quarterly" },
    { value: "yoy", label: "Yearly" },
];

const HERO_GRANULARITIES: Granularity[] = ["wow", "mom", "qoq"];

const HERO_BED_OPTIONS: { value: string; label: string }[] = [
    { value: "0", label: "Studio" },
    { value: "1", label: "1-bedroom" },
    { value: "2", label: "2-bedroom" },
    { value: "3", label: "3-bedroom+" },
];

export type PreviewRentChartVariant = "embedded" | "hero";

function useDismissibleMenu() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: PointerEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return { open, setOpen, containerRef };
}

function InlineDropdown<T extends string>({
    value,
    onChange,
    options,
    ariaLabel,
    align = "start",
    triggerClassName,
}: {
    value: T;
    onChange: (next: T) => void;
    options: readonly { value: T; label: string }[];
    ariaLabel: string;
    align?: "start" | "end";
    triggerClassName?: string;
}) {
    const { open, setOpen, containerRef } = useDismissibleMenu();
    const selectedLabel = options.find((opt) => opt.value === value)?.label ?? options[0]?.label ?? "";

    return (
        <div ref={containerRef} className="relative inline-flex">
            <button
                type="button"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className={triggerClassName}
            >
                <span>{selectedLabel}</span>
                <ChevronDown aria-hidden className={cn("size-3.5 shrink-0 text-gray-400 transition-transform dark:text-gray-500", open && "rotate-180")} />
            </button>
            {open && (
                <div
                    role="listbox"
                    aria-label={ariaLabel}
                    className={cn(
                        "absolute top-full z-40 mt-1.5 min-w-[9.5rem] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800",
                        align === "end" ? "right-0" : "left-0",
                    )}
                >
                    {options.map((opt) => {
                        const active = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                role="option"
                                aria-selected={active}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-xs font-medium whitespace-nowrap transition-colors",
                                    active
                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60",
                                )}
                            >
                                <span>{opt.label}</span>
                                {active && <Check aria-hidden className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function AreaAddMenu({
    availableAreas,
    selectedIds,
    onToggle,
}: {
    availableAreas: AreaSelection[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
}) {
    const { open, setOpen, containerRef } = useDismissibleMenu();

    return (
        <div ref={containerRef} className="relative inline-flex">
            <button
                type="button"
                aria-label="Add or remove areas"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex size-6 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300"
            >
                <span className="mb-px text-base leading-none">+</span>
            </button>
            {open && (
                <div
                    role="menu"
                    aria-label="Areas"
                    className="absolute top-full left-0 z-40 mt-1.5 min-w-[11rem] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                    {availableAreas.map((area) => {
                        const included = selectedIds.has(area.id);
                        const locked = included && selectedIds.size <= 1;
                        return (
                            <button
                                key={area.id}
                                type="button"
                                role="menuitemcheckbox"
                                aria-checked={included}
                                disabled={locked}
                                onClick={() => onToggle(area.id)}
                                className={cn(
                                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-xs font-medium whitespace-nowrap transition-colors",
                                    locked && "cursor-not-allowed opacity-50",
                                    included
                                        ? "bg-gray-100/80 text-gray-900 dark:bg-gray-700/70 dark:text-gray-100"
                                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60",
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                                    <span>{area.label}</span>
                                </span>
                                {included && <Check aria-hidden className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const TICK = { fontSize: 11, fill: "#9ca3af", fontVariantNumeric: "tabular-nums" as const };

function isNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

function buildPctChangeData(absData: Array<Record<string, string | number>>, series: SeriesInfo[]): Array<Record<string, string | number>> {
    const baselines: Record<string, number> = {};
    for (const s of series) {
        for (const point of absData) {
            const v = point[s.key];
            if (isNumber(v)) {
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
            if (isNumber(v) && base != null && base !== 0) {
                out[s.key] = parseFloat((((v - base) / base) * 100).toFixed(2));
            }
        }
        return out;
    });
}

function yDomain(values: number[], isPct: boolean): [number, number] {
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (isPct) {
        const top = Math.max(6, Math.ceil(Math.max(max, 0) / 6) * 6);
        return [0, top];
    }
    const span = max - min || 1;
    const pad = span * 0.12;
    return [min - pad, max + pad];
}

function pctTicks(top: number): number[] {
    return [0, top / 3, (2 * top) / 3, top];
}

function xTicks(labels: string[], count = 4): string[] {
    if (labels.length <= count) return labels;
    const out: string[] = [];
    for (let i = 0; i < count; i += 1) {
        out.push(labels[Math.round((i * (labels.length - 1)) / (count - 1))]);
    }
    return [...new Set(out)];
}

function bedTitle(selectedBeds: number[]): string {
    if (selectedBeds.length !== 1) {
        const labels = selectedBeds.map((beds) => BED_KEYS.find((b) => b.beds === beds)?.label ?? "").filter(Boolean);
        return `${labels.join(" vs ")} median rent`;
    }
    switch (selectedBeds[0]) {
        case 0:
            return "Studio median rent";
        case 1:
            return "1-bedroom median rent";
        case 2:
            return "2-bedroom median rent";
        default:
            return "3-bedroom+ median rent";
    }
}

function sinceMonth(week: string): string {
    return new Date(`${week}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
}

function lastNumeric(data: Array<Record<string, string | number>>, key: string): number | undefined {
    for (let i = data.length - 1; i >= 0; i -= 1) {
        const value = data[i][key];
        if (isNumber(value)) return value;
    }
    return undefined;
}

function separateYs(naturalYs: number[], minGap: number, top: number, bottom: number): number[] {
    const order = naturalYs.map((y, i) => ({ i, y })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < order.length; i += 1) {
        if (order[i].y < order[i - 1].y + minGap) {
            order[i].y = order[i - 1].y + minGap;
        }
    }
    const last = order[order.length - 1];
    if (last && last.y > bottom) {
        const shift = last.y - bottom;
        for (const item of order) item.y -= shift;
    }
    if (order[0] && order[0].y < top) {
        const shift = top - order[0].y;
        for (const item of order) item.y += shift;
    }
    const placed = new Array<number>(naturalYs.length);
    for (const item of order) placed[item.i] = item.y;
    return placed;
}

type EndItem = { key: string; text: string; color: string; value: number; weekLabel: string };

function EndLabels({ items, halo }: { items: EndItem[]; halo: string }) {
    const plot = usePlotArea();
    const xScale = useXAxisScale();
    const yScale = useYAxisScale();
    if (!plot || !xScale || !yScale || items.length === 0) return null;

    const naturalYs = items.map((item) => yScale(item.value));
    if (naturalYs.some((y) => y == null)) return null;
    const labelYs = separateYs(naturalYs as number[], 16, plot.y + 8, plot.y + plot.height - 8);

    return (
        <g pointerEvents="none">
            {items.map((item, i) => {
                const x = xScale(item.weekLabel);
                const y = naturalYs[i];
                if (x == null || y == null) return null;
                return (
                    <g key={item.key}>
                        <circle cx={x} cy={y} r={3.5} fill={item.color} stroke={halo} strokeWidth={1.5} />
                        <text
                            x={x + 8}
                            y={labelYs[i]}
                            fill={item.color}
                            fontSize={11}
                            fontWeight={600}
                            dominantBaseline="middle"
                            className="tabular-nums"
                            style={{ paintOrder: "stroke", stroke: halo, strokeWidth: 3, strokeLinejoin: "round" }}
                        >
                            {item.text}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}

export function PreviewRentChart({
    areas,
    areaResults,
    selectedBeds,
    isDark = false,
    variant = "embedded",
    defaultYView = "abs",
    height,
    chipAreas,
    activeAreaId = null,
    onAreaSelect,
    onBedsChange,
    areaType,
    onAreaTypeChange,
    availableAreas,
    onToggleAreaMembership,
}: {
    areas: AreaSelection[];
    areaResults: Record<string, TrendRow[]>;
    selectedBeds: number[];
    isDark?: boolean;
    variant?: PreviewRentChartVariant;
    defaultYView?: YView;
    height?: number;
    chipAreas?: AreaSelection[];
    activeAreaId?: string | null;
    onAreaSelect?: (id: string) => void;
    onBedsChange?: (beds: number[]) => void;
    areaType?: AnalyticsAreaType;
    onAreaTypeChange?: (next: AnalyticsAreaType) => void;
    availableAreas?: AreaSelection[];
    onToggleAreaMembership?: (id: string) => void;
}) {
    const isHero = variant === "hero";
    const [granularity, setGranularity] = useState<Granularity>(isHero ? "mom" : "wow");
    const [yView, setYView] = useState<YView>(defaultYView);
    const [hoverAreaId, setHoverAreaId] = useState<string | null>(null);
    const chartAnimation = useChartAnimation();
    const available = useMemo(() => getAvailableGranularities(areaResults), [areaResults]);
    const buckets = BUCKET_LABELS.filter(
        (opt) => available.includes(opt.value) && (!isHero || HERO_GRANULARITIES.includes(opt.value)),
    );

    const previewAreaId = isHero ? (hoverAreaId ?? activeAreaId) : activeAreaId;
    const chartAreas = useMemo(() => {
        const pool = isHero && chipAreas ? chipAreas : areas;
        if (isHero && previewAreaId) return pool.filter((area) => area.id === previewAreaId);
        return pool;
    }, [isHero, chipAreas, areas, previewAreaId]);

    const series = useMemo(() => getRentSeriesList(chartAreas, selectedBeds), [chartAreas, selectedBeds]);
    const absData = useMemo(
        () => buildMultiAreaRentData(areaResults, chartAreas, selectedBeds, granularity),
        [areaResults, chartAreas, selectedBeds, granularity],
    );
    const pctData = useMemo(() => buildPctChangeData(absData, series), [absData, series]);
    const chartData = yView === "pct" ? pctData : absData;

    const values = series.flatMap((s) => chartData.map((point) => point[s.key]).filter(isNumber));
    const domain = values.length > 0 ? yDomain(values, yView === "pct") : ([0, 1] as [number, number]);
    const yTicks = yView === "pct" ? pctTicks(domain[1]) : undefined;
    const weekLabels = chartData.map((point) => point.weekLabel).filter((label): label is string => typeof label === "string");
    const shownXTicks = xTicks(weekLabels);

    const firstWeek = typeof absData[0]?.week === "string" ? absData[0].week : "";
    const sinceLabel = firstWeek ? sinceMonth(firstWeek) : "March";
    const title =
        yView === "pct"
            ? `${bedTitle(selectedBeds)}, change since ${sinceLabel}`
            : `${bedTitle(selectedBeds)} since ${sinceLabel}`;

    const lastPoint = chartData[chartData.length - 1];
    const lastWeekLabel = typeof lastPoint?.weekLabel === "string" ? lastPoint.weekLabel : "";
    const halo = isDark ? "#111827" : "#ffffff";

    const endItems: EndItem[] = series.flatMap((s) => {
        const value = lastNumeric(chartData, s.key);
        if (value == null || !lastWeekLabel) return [];
        return [{ key: s.key, text: s.label, color: s.color, value, weekLabel: lastWeekLabel }];
    });

    const yFormatter = yView === "pct" ? (v: number) => formatPercent(v, 0, { showSign: true }) : (v: number) => formatDollars(v);

    const periodButtons = buckets.length > 1 && (
        <div className="hidden items-center gap-1 rounded-lg bg-gray-100 p-1 sm:flex dark:bg-gray-700">
            {buckets.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGranularity(opt.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium tabular-nums ${
                        granularity === opt.value
                            ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );

    const yViewButtons = isHero ? (
        <div className="flex items-center" role="group" aria-label="Y-axis unit">
            <button
                type="button"
                aria-pressed={yView === "pct"}
                onClick={() => setYView("pct")}
                className={`rounded-md bg-transparent px-1.5 py-2.5 text-base focus:ring-2 focus:ring-gray-200 focus:outline-none dark:focus:ring-gray-600 ${
                    yView === "pct" ? "font-medium text-gray-900 dark:text-gray-100" : "font-normal text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                }`}
            >
                %
            </button>
            <span aria-hidden className="h-3.5 w-px bg-gray-300 dark:bg-gray-600" />
            <button
                type="button"
                aria-pressed={yView === "abs"}
                onClick={() => setYView("abs")}
                className={`rounded-md bg-transparent px-1.5 py-2.5 text-base focus:ring-2 focus:ring-gray-200 focus:outline-none dark:focus:ring-gray-600 ${
                    yView === "abs" ? "font-medium text-gray-900 dark:text-gray-100" : "font-normal text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                }`}
            >
                $
            </button>
        </div>
    ) : (
        <div className="flex h-11 shrink-0 items-center gap-1 rounded-lg bg-gray-100 p-1 sm:h-auto dark:bg-gray-700">
            <button
                type="button"
                onClick={() => setYView("pct")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium min-h-9 min-w-9 text-base font-normal sm:min-h-0 sm:min-w-0 sm:text-xs sm:font-medium ${
                    yView === "pct"
                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
            >
                %
            </button>
            <button
                type="button"
                onClick={() => setYView("abs")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium min-h-9 min-w-9 text-base font-normal sm:min-h-0 sm:min-w-0 sm:text-xs sm:font-medium ${
                    yView === "abs"
                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
            >
                $
            </button>
        </div>
    );

    const toggles = (
        <div className={isHero ? "flex min-w-0 shrink-0 items-center justify-end gap-2" : "flex min-w-0 items-center justify-between gap-2 sm:justify-end"}>
            {buckets.length > 1 &&
                (isHero ? (
                    <InlineDropdown
                        ariaLabel="Time period"
                        value={granularity}
                        onChange={(next) => setGranularity(next as Granularity)}
                        options={buckets}
                        align="end"
                        triggerClassName="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    />
                ) : (
                    <>
                        <PreviewNativeSelect
                            aria-label="Time period"
                            value={granularity}
                            onChange={(next) => setGranularity(next as Granularity)}
                            options={buckets}
                        />
                        {periodButtons}
                    </>
                ))}
            {yViewButtons}
        </div>
    );

    const areaChips = chipAreas && onAreaSelect && (
        <div
            className="flex min-w-0 flex-wrap items-center gap-2"
            onMouseLeave={() => {
                if (isHero) setHoverAreaId(null);
            }}
        >
            {chipAreas.map((area) => {
                const isActive = previewAreaId === null || previewAreaId === area.id;
                return (
                    <PreviewChip
                        key={area.id}
                        selected={isActive}
                        onSelect={() => {
                            if (isHero) setHoverAreaId(null);
                            onAreaSelect(area.id);
                        }}
                        color={area.color}
                        onMouseEnter={() => {
                            if (isHero) setHoverAreaId(area.id);
                        }}
                        onMouseLeave={(event) => {
                            if (!isHero) return;
                            const next = event.relatedTarget;
                            const current = event.currentTarget;
                            const group = current instanceof Element ? current.parentElement : null;
                            if (next instanceof Node && group?.contains(next)) return;
                            setHoverAreaId(null);
                        }}
                    >
                        <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                        {area.label}
                    </PreviewChip>
                );
            })}
            {availableAreas && onToggleAreaMembership && (
                <AreaAddMenu
                    availableAreas={availableAreas}
                    selectedIds={new Set(chipAreas.map((area) => area.id))}
                    onToggle={onToggleAreaMembership}
                />
            )}
        </div>
    );

    const hasInlineSelectors = isHero && Boolean(onBedsChange);

    const header = hasInlineSelectors ? (
        <>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pb-3.5">
                <h2 className="flex flex-wrap items-baseline gap-x-1.5 text-lg leading-snug font-medium text-gray-900 sm:text-[19px] dark:text-gray-100">
                    <InlineDropdown
                        ariaLabel="Bedrooms"
                        value={String(selectedBeds[0] ?? 1)}
                        onChange={(next) => onBedsChange?.([Number(next)])}
                        options={HERO_BED_OPTIONS}
                        triggerClassName="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 -ml-1.5 text-lg leading-snug font-medium text-gray-900 transition-colors hover:bg-gray-100 sm:text-[19px] dark:text-gray-100 dark:hover:bg-gray-800"
                    />
                    <span>{yView === "pct" ? `median rent, change since ${sinceLabel}` : `median rent since ${sinceLabel}`}</span>
                </h2>
                {toggles}
            </div>
            <div className="flex flex-wrap items-center gap-2 pb-6">
                {areaType && onAreaTypeChange && (
                    <>
                        <InlineDropdown
                            ariaLabel="Area type"
                            value={areaType}
                            onChange={(next) => onAreaTypeChange(next as AnalyticsAreaType)}
                            options={ANALYTICS_AREA_TYPES.map((type) => ({ value: type, label: type }))}
                            triggerClassName="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 -ml-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        />
                        <span aria-hidden className="mx-0.5 h-3.5 w-px shrink-0 bg-gray-200 dark:bg-gray-700" />
                    </>
                )}
                {areaChips}
            </div>
        </>
    ) : isHero ? (
        <>
            <h2 className="pb-[18px] text-xl leading-snug font-medium text-gray-900 dark:text-gray-100">{title}</h2>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 pb-[27px]">
                {areaChips}
                {toggles}
            </div>
        </>
    ) : (
        <div className="mb-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="min-w-0 text-[15px] leading-snug font-medium text-gray-900 dark:text-gray-100">{title}</h2>
            {toggles}
        </div>
    );

    return (
        <div className="min-w-0">
            {header}

            <AnalyticsChartContainer height={height ?? (isHero ? 485 : 280)}>
                <LineChart data={chartData} margin={{ top: 8, right: 118, left: 4, bottom: 4 }}>
                    <CartesianGrid vertical={false} stroke={isDark ? "#1f2937" : "#f1f3f5"} strokeWidth={1} />
                    <XAxis
                        dataKey="weekLabel"
                        ticks={shownXTicks}
                        tick={TICK}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        tickMargin={8}
                    />
                    <YAxis
                        domain={domain}
                        ticks={yTicks}
                        tick={TICK}
                        tickFormatter={yFormatter}
                        axisLine={false}
                        tickLine={false}
                        width={yView === "pct" ? 40 : 48}
                        tickMargin={4}
                    />
                    <Tooltip
                        cursor={{ stroke: isDark ? "#374151" : "#e5e7eb", strokeWidth: 1 }}
                        content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            return (
                                <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <div className="mb-1 text-gray-500 dark:text-gray-400">{label}</div>
                                    {payload.map((entry) => {
                                        const key = String(entry.dataKey);
                                        const rent = lastNumeric(
                                            absData.filter((p) => p.weekLabel === label),
                                            key,
                                        );
                                        const pct = lastNumeric(
                                            pctData.filter((p) => p.weekLabel === label),
                                            key,
                                        );
                                        return (
                                            <div key={key} className="tabular-nums" style={{ color: String(entry.color) }}>
                                                {entry.name} {rent != null ? formatDollars(rent) : ""}
                                                {pct != null ? ` · ${formatPercent(pct, 1, { showSign: true })}` : ""}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }}
                    />
                    {series.map((s) => (
                        <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.label}
                            stroke={s.color}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            dot={false}
                            activeDot={{ r: 3, strokeWidth: 0, fill: s.color }}
                            connectNulls
                            {...chartAnimation}
                        />
                    ))}
                    <EndLabels items={endItems} halo={halo} />
                </LineChart>
            </AnalyticsChartContainer>
        </div>
    );
}
