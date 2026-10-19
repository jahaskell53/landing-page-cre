"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreviewNativeSelect({
    value,
    onChange,
    options,
    "aria-label": ariaLabel,
    align = "start",
}: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    "aria-label": string;
    align?: "start" | "end";
}) {
    return (
        <div className={cn("relative sm:hidden", align === "end" ? "ml-auto w-fit" : "w-fit")}>
            <select
                aria-label={ariaLabel}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={cn(
                    "appearance-none bg-transparent text-base font-normal text-gray-900 dark:text-gray-100",
                    "min-h-11 rounded-md py-2.5 pr-7",
                    "hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none",
                    "dark:hover:bg-gray-700/40 dark:focus:ring-gray-600",
                    align === "end" ? "pl-2 text-right" : "pl-1.5",
                )}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-0.5 size-[18px] -translate-y-1/2 text-gray-400" strokeWidth={2} />
        </div>
    );
}
