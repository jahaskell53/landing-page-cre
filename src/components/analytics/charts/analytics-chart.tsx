"use client";

import type { ReactNode } from "react";
import { CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const CHART_GRID_STROKE = "#e5e7eb";
export const CHART_AXIS_TICK = { fontSize: 12, fill: "#6b7280" };
export const CHART_TOOLTIP_STYLE = { borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 };

interface AnalyticsChartContainerProps {
    height?: number;
    children: ReactNode;
}

export function AnalyticsChartContainer({ height = 280, children }: AnalyticsChartContainerProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            {children}
        </ResponsiveContainer>
    );
}

export function AnalyticsCartesianGrid() {
    return <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />;
}

interface AnalyticsXAxisProps {
    dataKey: string;
}

export function AnalyticsXAxis({ dataKey }: AnalyticsXAxisProps) {
    return <XAxis dataKey={dataKey} tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />;
}

interface AnalyticsYAxisProps {
    yAxisId?: string;
    orientation?: "left" | "right";
    tickFormatter?: (value: number) => string;
    width?: number;
    tickFill?: string;
}

export function AnalyticsYAxis({ yAxisId, orientation = "left", tickFormatter, width = 40, tickFill }: AnalyticsYAxisProps) {
    return (
        <YAxis
            yAxisId={yAxisId}
            orientation={orientation}
            tickFormatter={tickFormatter}
            tick={{ ...CHART_AXIS_TICK, fill: tickFill ?? CHART_AXIS_TICK.fill }}
            axisLine={false}
            tickLine={false}
            width={width}
        />
    );
}

interface AnalyticsChartTooltipProps {
    label?: string;
    children: ReactNode;
    className?: string;
}

export function AnalyticsChartTooltip({ label, children, className }: AnalyticsChartTooltipProps) {
    return (
        <div className={className ?? "rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800"}>
            {label && <p className="mb-1 text-gray-500">{label}</p>}
            {children}
        </div>
    );
}

interface AnalyticsTooltipRowProps {
    color: string;
    name: string;
    value: ReactNode;
}

export function AnalyticsTooltipRow({ color, name, value }: AnalyticsTooltipRowProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-600 dark:text-gray-400">{name}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
        </div>
    );
}
