"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { AreaSelection } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { SalesTrendsChart, SalesTrendsChartHeader } from "@/app/(app)/analytics/sales-trends/sales-trends-chart";
import { buildSalesTrendChartData } from "@/app/(app)/analytics/sales-trends/sales-trends-utils";
import { AreaTypeSelect } from "@/components/analytics/filters/area-type-select";
import { UnitRangeInput } from "@/components/analytics/filters/unit-range-input";
import { SalesMetricSelector } from "@/components/analytics/sales-metric-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SalesTrendRowV2 } from "@/db/rpc";
import { getClosedSalesTrendsByCityV2 } from "@/db/rpc/sales-trends";
import { SALES_TREND_PERIODS, SALES_TREND_SAMPLE_COMPS } from "@/lib/analytics/filters";
import { PREVIEW_SALES_AREA_ID, PREVIEW_SALES_CITY, PREVIEW_SALES_MONTHS_PER_BUCKET } from "./sales-trends-preview-config";

const LEAD_COLOR_LIGHT = "#1e3a8a";
const LEAD_COLOR_DARK = "#60a5fa";

const noop = () => {};

function MockSalesFilterPanel({ area }: { area: AreaSelection }) {
    return (
        <div
            aria-hidden
            className="pointer-events-none mb-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 select-none dark:border-gray-700 dark:bg-gray-800"
        >
            <SalesMetricSelector value="crexi" onChange={noop} />

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">Area</span>
                <AreaTypeSelect value="City" onChange={noop} />
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">Period</span>
                <Select value="5Y">
                    <SelectTrigger size="sm" className="min-w-[6rem]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {SALES_TREND_PERIODS.map((p) => (
                            <SelectItem key={p} value={p}>
                                {p}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">Sample Comps</span>
                <Select value="3M">
                    <SelectTrigger size="sm" className="min-w-[6rem]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {SALES_TREND_SAMPLE_COMPS.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">Sales Price</span>
                    <Select value="Median">
                        <SelectTrigger size="sm" className="min-w-[8rem]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Median">Median</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">Display</span>
                    <Select value="cost_per_unit">
                        <SelectTrigger size="sm" className="min-w-[8rem]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cost_per_unit">Cost/Unit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <span className="w-24 shrink-0 pt-2 text-sm text-gray-500 dark:text-gray-400">Search</span>
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
                        style={{ borderColor: area.color, color: area.color, backgroundColor: `${area.color}14` }}
                    >
                        <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                        {area.label}
                    </span>
                    <span className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-600">
                        <span className="mb-px text-base leading-none">+</span>
                    </span>
                </div>
            </div>

            <UnitRangeInput unitFilter="All" onUnitFilterChange={noop} unitMin="" onUnitMinChange={noop} unitMax="" onUnitMaxChange={noop} />
        </div>
    );
}

export function SalesTrendsPreview({ initialSalesResults }: { initialSalesResults?: SalesTrendRowV2[] }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted && resolvedTheme === "dark";
    const areaColor = isDark ? LEAD_COLOR_DARK : LEAD_COLOR_LIGHT;

    const area = useMemo<AreaSelection>(
        () => ({
            id: PREVIEW_SALES_AREA_ID,
            label: `${PREVIEW_SALES_CITY.city}, ${PREVIEW_SALES_CITY.state}`,
            color: areaColor,
            cityName: PREVIEW_SALES_CITY.city,
            cityState: PREVIEW_SALES_CITY.state,
        }),
        [areaColor],
    );

    const [salesResults, setSalesResults] = useState<SalesTrendRowV2[]>(initialSalesResults ?? []);
    const hasInitialData = (initialSalesResults?.length ?? 0) > 0;

    useEffect(() => {
        if (hasInitialData) return;
        let cancelled = false;
        getClosedSalesTrendsByCityV2({
            p_city: PREVIEW_SALES_CITY.city,
            p_state: PREVIEW_SALES_CITY.state,
            p_min_units: null,
            p_max_units: null,
            p_months_per_bucket: PREVIEW_SALES_MONTHS_PER_BUCKET,
        })
            .then((rows) => {
                if (!cancelled) setSalesResults(rows);
            })
            .catch(() => {
                if (!cancelled) setSalesResults([]);
            });
        return () => {
            cancelled = true;
        };
    }, [hasInitialData]);

    const chartData = useMemo(() => buildSalesTrendChartData({ [area.id]: salesResults }, [area], [], "5Y", "cost_per_unit", "Median"), [area, salesResults]);
    const hasData = chartData.length > 0;

    if (!hasData) {
        return (
            <>
                <MockSalesFilterPanel area={area} />
                <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-400">Loading live sales trends…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <MockSalesFilterPanel area={area} />
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <SalesTrendsChartHeader
                    metric="cost_per_unit"
                    displayType="Median"
                    chartHasSmallSample={false}
                    showVolume
                    salesSource="crexi"
                    yView="abs"
                    onYViewChange={noop}
                />
                <SalesTrendsChart
                    allDisplayAreas={[area]}
                    chartData={chartData}
                    metric="cost_per_unit"
                    displayType="Median"
                    period="5Y"
                    sampleComps="3M"
                    unitFilter="All"
                    showVolume
                    yView="abs"
                    salesSource="crexi"
                    onDotClick={noop}
                />
            </div>
        </>
    );
}
