"use client";

import { useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { QuarterlySalesPoint } from "@/lib/markets/server";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/utils/format";

type ChartMetric = "price_per_door" | "cap_rate";

type Props = {
    marketName: string;
    quarters: readonly QuarterlySalesPoint[];
};

export function MarketSalesChart({ marketName, quarters }: Props) {
    const hasCapRate = quarters.some((q) => q.medianCapRate != null);
    const [metric, setMetric] = useState<ChartMetric>(hasCapRate ? "cap_rate" : "price_per_door");

    const data = quarters.map((q) => ({
        quarterLabel: q.quarterLabel,
        medianPricePerDoor: q.medianPricePerDoor,
        medianCapRate: q.medianCapRate,
        salesCount: q.salesCount,
        capRateCount: q.capRateCount,
    }));

    if (data.length === 0) {
        return null;
    }

    const activeMetric: ChartMetric = metric === "cap_rate" && !hasCapRate ? "price_per_door" : metric;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-900/60">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {marketName} quarterly {activeMetric === "cap_rate" ? "median cap rate" : "median price per door"}
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Closed multifamily transactions by quarter (bars show closed sales volume).
                    </p>
                </div>
                <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs font-medium dark:border-gray-800 dark:bg-gray-950">
                    {hasCapRate ? (
                        <button
                            type="button"
                            onClick={() => setMetric("cap_rate")}
                            className={`rounded-md px-3 py-1.5 transition-colors ${
                                activeMetric === "cap_rate"
                                    ? "bg-white text-blue-900 shadow-xs dark:bg-gray-800 dark:text-blue-400"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            }`}
                        >
                            Cap rate (%)
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => setMetric("price_per_door")}
                        className={`rounded-md px-3 py-1.5 transition-colors ${
                            activeMetric === "price_per_door"
                                ? "bg-white text-blue-900 shadow-xs dark:bg-gray-800 dark:text-blue-400"
                                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        }`}
                    >
                        Price / door ($)
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 12, bottom: 4, left: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-800" vertical={false} />
                        <XAxis
                            dataKey="quarterLabel"
                            tick={{ fontSize: 12, fill: "currentColor" }}
                            className="text-gray-500 dark:text-gray-400"
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                        />
                        <YAxis
                            yAxisId="metric"
                            tick={{ fontSize: 12, fill: "currentColor" }}
                            className="text-gray-500 dark:text-gray-400"
                            tickLine={false}
                            axisLine={false}
                            width={56}
                            domain={activeMetric === "cap_rate" ? ["auto", "auto"] : ["auto", "auto"]}
                            tickFormatter={(val: number) =>
                                activeMetric === "cap_rate" ? formatPercent(val, 1) : formatCompact(val)
                            }
                        />
                        <YAxis yAxisId="volume" orientation="right" hide domain={[0, (max: number) => Math.max(max * 4, 10)]} />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;
                                const row = payload[0]?.payload as (typeof data)[number] | undefined;
                                if (!row) return null;
                                return (
                                    <div className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
                                        <div className="mt-1.5 space-y-1 text-gray-600 dark:text-gray-300">
                                            {row.medianCapRate != null ? (
                                                <p className="flex justify-between gap-4">
                                                    <span>Median cap rate</span>
                                                    <span className="font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                                                        {formatPercent(row.medianCapRate, 2)}
                                                    </span>
                                                </p>
                                            ) : null}
                                            <p className="flex justify-between gap-4">
                                                <span>Median $/door</span>
                                                <span className="font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                                                    {formatCurrency(row.medianPricePerDoor)}
                                                </span>
                                            </p>
                                            <p className="flex justify-between gap-4">
                                                <span>Closed sales</span>
                                                <span className="font-medium tabular-nums">{formatNumber(row.salesCount)}</span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Bar yAxisId="volume" dataKey="salesCount" fill="#cbd5e1" fillOpacity={0.45} radius={[3, 3, 0, 0]} maxBarSize={26} />
                        <Line
                            yAxisId="metric"
                            type="monotone"
                            dataKey={activeMetric === "cap_rate" ? "medianCapRate" : "medianPricePerDoor"}
                            stroke="#1e3a8a"
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: "#1e3a8a", strokeWidth: 0 }}
                            activeDot={{ r: 5, fill: "#2563eb" }}
                            connectNulls
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
