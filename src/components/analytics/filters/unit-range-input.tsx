"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type SalesTrendUnitFilter, UNIT_PRESETS } from "@/lib/analytics/filters";

interface UnitRangeInputProps {
    unitFilter: SalesTrendUnitFilter;
    onUnitFilterChange: (value: SalesTrendUnitFilter) => void;
    unitMin: string;
    onUnitMinChange: (value: string) => void;
    unitMax: string;
    onUnitMaxChange: (value: string) => void;
    label?: string;
}

/**
 * Shared sales-trends "# of Units" control. Encapsulates the exact behavior of
 * the inline block in the sales-trends filter panel: a preset `<Select>` over
 * UNIT_PRESETS that clears min/max on any non-custom choice, plus raw min/max
 * number inputs that flip the filter to "custom" when either has a value and
 * back to "All" when both are empty. Purely presentational — callers own state.
 */
export function UnitRangeInput({
    unitFilter,
    onUnitFilterChange,
    unitMin,
    onUnitMinChange,
    unitMax,
    onUnitMaxChange,
    label = "# of Units",
}: UnitRangeInputProps) {
    return (
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="shrink-0 text-sm text-gray-500 sm:w-24 dark:text-gray-400">{label}</span>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Select
                    value={unitFilter}
                    onValueChange={(v) => {
                        const next = v as SalesTrendUnitFilter;
                        onUnitFilterChange(next);
                        if (next === "All" || next !== "custom") {
                            onUnitMinChange("");
                            onUnitMaxChange("");
                        }
                    }}
                >
                    <SelectTrigger size="sm" className="min-w-[8rem]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {UNIT_PRESETS.map((u) => (
                            <SelectItem key={u.value} value={u.value}>
                                {u.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">Min</span>
                    <input
                        type="number"
                        value={unitMin}
                        aria-label="Unit min"
                        onChange={(e) => {
                            onUnitMinChange(e.target.value);
                            if (e.target.value || unitMax) onUnitFilterChange("custom");
                            else onUnitFilterChange("All");
                        }}
                        className="w-16 rounded-md border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        placeholder="—"
                    />
                    <span className="text-gray-400 dark:text-gray-500">Max</span>
                    <input
                        type="number"
                        value={unitMax}
                        aria-label="Unit max"
                        onChange={(e) => {
                            onUnitMaxChange(e.target.value);
                            if (e.target.value || unitMin) onUnitFilterChange("custom");
                            else onUnitFilterChange("All");
                        }}
                        className="w-16 rounded-md border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        placeholder="—"
                    />
                </div>
            </div>
        </div>
    );
}
