"use client";

import { CompCoverageBadge } from "@/components/analytics/comp-coverage-badge";
import { SegmentedControl } from "@/components/analytics/filters/segmented-control";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getScoreColor } from "@/lib/analytics/sales-comps";
import { cn } from "@/lib/utils";
import {
    COMPS_PREVIEW_SHELL,
    DistributionBar,
    MockAddressField,
    MockCompsMiniMap,
    MockInputField,
    MockRadiusSlider,
    MockSearchByToggle,
    StatCell,
} from "./comps-preview-shared";

const SUBJECT = {
    street: "1420 Foothill Blvd",
    meta: "24 units · built 1965",
};

const MOCK_COMPS = [
    { street: "755 14th St", city: "Oakland, CA", price: "$3.6M", ppu: "$150k", cap: "5.6%", score: 94 },
    { street: "892 34th St", city: "Oakland, CA", price: "$2.9M", ppu: "$161k", cap: "5.2%", score: 89 },
    { street: "2100 Webster", city: "Oakland, CA", price: "$5.2M", ppu: "$173k", cap: "5.4%", score: 86 },
];

export function SalesCompsPreview() {
    return (
        <div aria-hidden className={cn(COMPS_PREVIEW_SHELL, "space-y-2.5")}>
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2.5 text-xs font-semibold text-gray-900 dark:text-gray-100">Find Comparable Sales</h3>
                <div className="space-y-2.5">
                    <div className="min-w-0">
                        <Label className="mb-1 block text-[10px]">Subject Property Address</Label>
                        <MockAddressField value="1420 Foothill Blvd, Oakland, CA" />
                    </div>

                    <div className="min-w-0">
                        <MockSearchByToggle />
                        <MockRadiusSlider value={2} />
                    </div>

                    <MockCompsMiniMap />

                    <div className="min-w-0 space-y-1.5">
                        <Label className="text-[10px]">Sale window</Label>
                        <SegmentedControl
                            size="sm"
                            wrap
                            ariaLabel="Sale window"
                            options={[
                                { value: "6", label: "6 mo" },
                                { value: "12", label: "12 mo" },
                                { value: "24", label: "24 mo" },
                                { value: "0", label: "All" },
                            ]}
                            value="12"
                            onChange={() => {}}
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="grid grid-cols-3 gap-1.5">
                            <MockInputField label="Units" value="24" />
                            <MockInputField label="Sq Ft" value="18k" />
                            <MockInputField label="Built" value="1965" />
                        </div>
                    </div>

                    <Button type="button" tabIndex={-1} className="h-8 w-full text-xs">
                        Find Sales Comps
                    </Button>
                </div>
            </div>

            <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-1.5">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Price-per-Door Distribution</h3>
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <CompCoverageBadge counts={{ totalCount: 11, capRateCount: 9 }} source="closed_sales" />
                        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">Med cap 5.4%</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    <StatCell label="Min" value="$140k" />
                    <StatCell label="Median" value="$156k" highlight />
                    <StatCell label="Max" value="$185k" />
                </div>
                <DistributionBar medianPos={48} />
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">11 comps found</h3>
                    <p className="truncate text-[10px] text-gray-500">1420 Foothill Blvd, Oakland, CA</p>
                </div>
                <table className="w-full table-fixed text-[10px]">
                    <colgroup>
                        <col className="w-7" />
                        <col />
                        <col className="w-10" />
                        <col className="w-10" />
                        <col className="w-9" />
                        <col className="w-8" />
                    </colgroup>
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30">
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase">#</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase">Address</th>
                            <th className="px-1 py-1.5 text-right font-semibold text-gray-500 uppercase">Price</th>
                            <th className="px-1 py-1.5 text-right font-semibold text-gray-500 uppercase">$/Dr</th>
                            <th className="px-1 py-1.5 text-right font-semibold text-gray-500 uppercase">Cap</th>
                            <th className="px-1 py-1.5 text-right font-semibold text-gray-500 uppercase">Scr</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b-2 border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20">
                            <td className="px-2 py-1.5 font-semibold text-blue-600 dark:text-blue-400">Subj</td>
                            <td className="min-w-0 px-2 py-1.5">
                                <div className="truncate font-medium text-blue-900 dark:text-blue-100">{SUBJECT.street}</div>
                                <div className="truncate text-[9px] text-blue-600/70 dark:text-blue-400/70">{SUBJECT.meta}</div>
                            </td>
                            <td className="px-1 py-1.5 text-right text-blue-600/70 dark:text-blue-400/70">—</td>
                            <td className="px-1 py-1.5 text-right text-blue-600/70 dark:text-blue-400/70">—</td>
                            <td className="px-1 py-1.5 text-right text-blue-600/70 dark:text-blue-400/70">—</td>
                            <td className="px-1 py-1.5 text-right text-blue-600/70 dark:text-blue-400/70">—</td>
                        </tr>
                        {MOCK_COMPS.map((comp, i) => (
                            <tr key={comp.street} className="border-b border-gray-50 dark:border-gray-700/50">
                                <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                                <td className="min-w-0 px-2 py-1.5">
                                    <div className="truncate font-medium text-gray-900 dark:text-gray-100">{comp.street}</div>
                                    <div className="truncate text-[9px] text-gray-500">{comp.city}</div>
                                </td>
                                <td className="px-1 py-1.5 text-right font-medium text-gray-900 dark:text-gray-100">{comp.price}</td>
                                <td className="px-1 py-1.5 text-right text-gray-700 dark:text-gray-300">{comp.ppu}</td>
                                <td className="px-1 py-1.5 text-right text-gray-700 dark:text-gray-300">{comp.cap}</td>
                                <td className="px-1 py-1.5 text-right">
                                    <span className={cn("font-semibold tabular-nums", getScoreColor(comp.score / 100))}>{comp.score}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
