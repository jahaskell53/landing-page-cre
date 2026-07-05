"use client";

import { SegmentedControl } from "@/components/analytics/filters/segmented-control";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function MockAddressField({ value }: { value: string }) {
    return (
        <div className="flex h-8 min-w-0 items-center truncate rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {value}
        </div>
    );
}

export function MockInputField({ label, value, required }: { label: string; value: string; required?: boolean }) {
    return (
        <div>
            <Label className="mb-1 block text-xs">
                {label}
                {required ? <span className="text-red-500"> *</span> : null}
            </Label>
            <div className="flex h-8 items-center rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                {value}
            </div>
        </div>
    );
}

export function MockRadiusSlider({ value }: { value: number }) {
    return (
        <div>
            <div className="mb-1.5 flex justify-between">
                <Label className="text-xs">Search Radius</Label>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{value} mi</span>
            </div>
            <div className="relative h-2 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-y-0 left-0 rounded-lg bg-blue-600" style={{ width: `${((value - 0.5) / 9.5) * 100}%` }} />
                <div
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 shadow dark:border-gray-800"
                    style={{ left: `calc(${((value - 0.5) / 9.5) * 100}% - 7px)` }}
                />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                <span>0.5 mi</span>
                <span>10 mi</span>
            </div>
        </div>
    );
}

export function MockSearchByToggle() {
    return (
        <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
            <Label className="shrink-0 text-xs">Search by</Label>
            <SegmentedControl
                size="sm"
                capitalize
                wrap
                ariaLabel="Search by"
                options={[
                    { value: "radius", label: "radius" },
                    { value: "neighborhood", label: "neighborhood" },
                ]}
                value="radius"
                onChange={() => {}}
            />
        </div>
    );
}

export const COMPS_PREVIEW_SHELL = "pointer-events-none -m-6 min-w-0 max-w-full overflow-hidden bg-gray-50 p-3 select-none dark:bg-gray-900";

export function DistributionBar({ medianPos, subjectPos }: { medianPos: number; subjectPos?: number }) {
    return (
        <div className="relative flex h-5 items-center">
            <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="absolute h-1.5 rounded-full bg-blue-300 dark:bg-blue-600" style={{ left: "25%", right: "25%" }} />
            <div className="absolute h-3.5 w-0.5 -translate-x-1/2 rounded-full bg-blue-600 dark:bg-blue-400" style={{ left: `${medianPos}%` }} />
            {subjectPos != null && (
                <div
                    className="absolute h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-white bg-orange-500 shadow dark:border-gray-800"
                    style={{ left: `${subjectPos}%` }}
                />
            )}
        </div>
    );
}

export function StatCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={cn("min-w-0 rounded-lg px-1 py-1.5 text-center", highlight ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-700/40")}>
            <p className="mb-0.5 truncate text-[9px] tracking-wide text-gray-400 uppercase dark:text-gray-500">{label}</p>
            <p
                className={cn(
                    "truncate text-xs font-semibold tabular-nums",
                    highlight ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-gray-200",
                )}
            >
                {value}
            </p>
        </div>
    );
}
