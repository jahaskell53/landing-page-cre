"use client";

import { SegmentToggle } from "@/components/analytics/filters/segment-toggle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getScoreColor } from "@/lib/analytics/comps";
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
    street: "512 Elm St",
    city: "Fremont, CA",
    rent: "$2,850",
    bedBa: "2 / 2.0",
};

const MOCK_COMPS = [
    { street: "88 Oak Ave", city: "Fremont, CA", rent: "$2,650", bedBa: "2 / 2.0", score: 92 },
    { street: "140 Pine St", city: "Fremont, CA", rent: "$2,780", bedBa: "2 / 1.5", score: 88 },
    { street: "245 Stevenson", city: "Fremont, CA", rent: "$2,950", bedBa: "2 / 2.0", score: 85 },
];

export function RentCompsPreview() {
    return (
        <div aria-hidden className={cn(COMPS_PREVIEW_SHELL, "space-y-2.5")}>
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2.5 text-xs font-semibold text-gray-900 dark:text-gray-100">Find Comparable Rentals</h3>
                <div className="space-y-2.5">
                    <div className="min-w-0">
                        <Label className="mb-1 block text-[10px]">Subject Property Address</Label>
                        <MockAddressField value="512 Elm St, Fremont, CA" />
                    </div>

                    <div className="min-w-0">
                        <MockSearchByToggle />
                        <MockRadiusSlider value={2} />
                    </div>

                    <MockCompsMiniMap />

                    <div className="min-w-0">
                        <div className="grid grid-cols-2 gap-2">
                            <MockInputField label="Rent / mo" value="2850" />
                            <MockInputField label="Sq Ft" value="950" />
                            <MockInputField label="Beds" value="2" required />
                            <MockInputField label="Baths" value="2" required />
                        </div>
                        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
                            <Label className="shrink-0 text-[10px]">Segment</Label>
                            <SegmentToggle value="mid" onChange={() => {}} />
                        </div>
                    </div>

                    <Button type="button" tabIndex={-1} className="h-8 w-full text-xs">
                        Find Comps
                    </Button>
                </div>
            </div>

            <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Market Rent Distribution</h3>
                    <span className="shrink-0 text-[10px] text-gray-400">12 listings</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    <StatCell label="Min" value="$2,400" />
                    <StatCell label="Median" value="$2,750" highlight />
                    <StatCell label="Max" value="$3,100" />
                </div>
                <DistributionBar medianPos={50} subjectPos={65} />
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">12 comps found</h3>
                    <p className="truncate text-[10px] text-gray-500">512 Elm St, Fremont, CA</p>
                </div>
                <table className="w-full table-fixed text-[10px]">
                    <colgroup>
                        <col className="w-7" />
                        <col />
                        <col className="w-[3.25rem]" />
                        <col className="w-[3.25rem]" />
                        <col className="w-9" />
                    </colgroup>
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30">
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase">#</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase">Address</th>
                            <th className="px-1 py-1.5 text-right font-semibold text-gray-500 uppercase">Rent</th>
                            <th className="px-1 py-1.5 text-right font-semibold text-gray-500 uppercase">Bed/Ba</th>
                            <th className="px-1 py-1.5 text-right font-semibold text-gray-500 uppercase">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b-2 border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20">
                            <td className="px-2 py-1.5 font-semibold text-blue-600 dark:text-blue-400">Subj</td>
                            <td className="min-w-0 px-2 py-1.5">
                                <div className="truncate font-medium text-blue-900 dark:text-blue-100">{SUBJECT.street}</div>
                                <div className="truncate text-[9px] text-blue-600/70 dark:text-blue-400/70">{SUBJECT.city}</div>
                            </td>
                            <td className="px-1 py-1.5 text-right font-medium text-blue-900 dark:text-blue-100">{SUBJECT.rent}</td>
                            <td className="px-1 py-1.5 text-right text-blue-800 dark:text-blue-200">{SUBJECT.bedBa}</td>
                            <td className="px-1 py-1.5 text-right text-blue-600/70 dark:text-blue-400/70">—</td>
                        </tr>
                        {MOCK_COMPS.map((comp, i) => (
                            <tr key={comp.street} className="border-b border-gray-50 dark:border-gray-700/50">
                                <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                                <td className="min-w-0 px-2 py-1.5">
                                    <div className="truncate font-medium text-gray-900 dark:text-gray-100">{comp.street}</div>
                                    <div className="truncate text-[9px] text-gray-500">{comp.city}</div>
                                </td>
                                <td className="px-1 py-1.5 text-right font-medium text-gray-900 dark:text-gray-100">{comp.rent}</td>
                                <td className="px-1 py-1.5 text-right text-gray-700 dark:text-gray-300">{comp.bedBa}</td>
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
