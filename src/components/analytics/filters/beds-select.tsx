"use client";

import { Label } from "@/components/ui/label";
import { MAP_BED_OPTIONS, RENT_TREND_BED_OPTIONS } from "@/lib/analytics/filters";
import { cn } from "@/lib/utils";

interface BedsSelectProps {
    /** Bedroom options. Defaults to MAP_BED_OPTIONS (multi) or RENT_TREND_BED_OPTIONS (single). */
    options?: { value: number; label: string }[];
    selected: number[];
    onChange: (next: number[]) => void;
    /** "multi" = map-style border pills (toggle membership); "single" = rent-trends gray track (replace). */
    mode?: "single" | "multi";
    label?: string;
    className?: string;
}

/**
 * Shared bedroom picker supporting the two analytics surfaces. Replaces the
 * hand-rolled Bedrooms blocks in the map filters panel (multi-select border
 * pills) and the rent-trends filter panel (single-select gray track), so beds
 * are chosen the same way on both. Purely presentational — callers own state.
 */
export function BedsSelect({ options, selected, onChange, mode = "multi", label, className }: BedsSelectProps) {
    const resolvedOptions = options ?? (mode === "multi" ? MAP_BED_OPTIONS : RENT_TREND_BED_OPTIONS);

    if (mode === "single") {
        return (
            <div className={className}>
                {label && <Label className="text-xs">{label}</Label>}
                <div className={cn("flex flex-wrap items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 text-sm dark:bg-gray-700", label && "mt-1")}>
                    {resolvedOptions.map(({ value, label: optLabel }) => {
                        const active = selected.includes(value);
                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onChange([value])}
                                className={cn(
                                    "rounded-md px-3 py-1 font-medium whitespace-nowrap transition-colors",
                                    active
                                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400",
                                )}
                            >
                                {optLabel}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {label && <Label className="text-xs">{label}</Label>}
            <div className={cn("flex flex-wrap gap-1.5", label && "mt-1")}>
                {resolvedOptions.map(({ value, label: optLabel }) => {
                    const active = selected.includes(value);
                    return (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onChange(active ? selected.filter((b) => b !== value) : [...selected, value])}
                            className={cn(
                                "rounded-md border px-2.5 py-1 text-xs transition-colors",
                                active
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
                            )}
                        >
                            {optLabel}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
