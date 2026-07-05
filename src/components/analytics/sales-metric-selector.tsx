"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SalesMetricSource = "crexi" | "loopnet";

const OPTIONS: { value: SalesMetricSource; label: string; title: string }[] = [
    { value: "crexi", label: "Closed sales", title: "Closed-sale price per door, bucketed by transaction date" },
    { value: "loopnet", label: "Asking", title: "Asking price of active for-sale listings, bucketed by scrape date" },
];

interface SalesMetricSelectorProps {
    value: SalesMetricSource;
    onChange: (value: SalesMetricSource) => void;
}

export function SalesMetricSelector({ value, onChange }: SalesMetricSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sales metric</span>
            <Select value={value} onValueChange={(v) => onChange(v as SalesMetricSource)}>
                <SelectTrigger size="sm" className="min-w-[9rem]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value} title={o.title}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
