"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
    value: T;
    label: ReactNode;
    disabled?: boolean;
    title?: string;
}

interface SegmentedControlProps<T extends string> {
    options: SegmentedOption<T>[];
    /** The currently active value, or null/undefined when nothing is selected. */
    value: T | null | undefined;
    onChange: (value: T) => void;
    /** Smaller padding + text, matching the compact pill groups (e.g. comps "Search by"). */
    size?: "sm" | "md";
    /** Allow the pills to wrap onto multiple lines when space is tight. */
    wrap?: boolean;
    /** Apply `capitalize` to the labels (used where option values are lowercase). */
    capitalize?: boolean;
    /** Accessible label for the group of pills. */
    ariaLabel?: string;
    className?: string;
}

/**
 * Shared segmented "pill group" control used across the analytics filter forms.
 *
 * This is the canonical implementation of the pattern that was previously
 * hand-rolled (with identical Tailwind classes) in the trends and comps panels:
 * a `bg-gray-100` track holding `rounded-md` buttons, the active one lifted with
 * `bg-white shadow-sm`. Purely presentational — callers own all state.
 */
export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    size = "md",
    wrap = false,
    capitalize = false,
    ariaLabel,
    className,
}: SegmentedControlProps<T>) {
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={cn(
                "flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-700",
                size === "sm" ? "text-xs" : "text-sm",
                wrap ? "min-w-0 flex-wrap" : undefined,
                className,
            )}
        >
            {options.map((option) => {
                const active = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        title={option.title}
                        disabled={option.disabled}
                        aria-pressed={active}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "rounded-md px-3 py-1 font-medium whitespace-nowrap transition-colors",
                            capitalize && "capitalize",
                            active
                                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                                : option.disabled
                                  ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400",
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
