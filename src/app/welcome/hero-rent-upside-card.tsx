import { Download } from "lucide-react";

const METRICS: { label: string; value: string; emphasis?: boolean }[] = [
    { label: "In-place rent / mo", value: "$71,000" },
    { label: "Market rent / mo", value: "$91,150" },
    { label: "Monthly gap", value: "+$20,150", emphasis: true },
    { label: "Annual upside", value: "$241,800" },
];

const SURVEY_ROWS = [
    { type: "Studio", low: "$2,450", median: "$2,695", high: "$2,950", inPlace: "$2,150" },
    { type: "1 bed", low: "$2,850", median: "$3,150", high: "$3,495", inPlace: "$2,475" },
    { type: "2 bed", low: "$3,600", median: "$3,975", high: "$4,400", inPlace: "$3,100" },
] as const;

export function HeroRentUpsideCard() {
    return (
        <div className="w-full rounded-[14px] border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-950">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rent upside</p>
                    <p className="mt-2 text-5xl font-semibold tracking-tight text-[#087443]">+28.4%</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Below market, room to push rents</p>
                </div>
                <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                    <Download className="size-4" />
                    Export PDF
                </span>
            </div>

            <div className="mt-6 h-px bg-gray-200 dark:bg-gray-700" />

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
                {METRICS.map((metric) => (
                    <div key={metric.label} className="min-w-[140px] flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</p>
                        <p
                            className={`mt-1 text-xl font-semibold tracking-tight ${
                                metric.emphasis ? "text-[#087443]" : "text-gray-900 dark:text-gray-100"
                            }`}
                        >
                            {metric.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 h-px bg-gray-200 dark:bg-gray-700" />

            <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Stabilized value swing</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">At 5.3% cap · Burlingame, CA</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">$4.6M</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">+40.9% of ask</p>
                </div>
            </div>

            <div className="mt-6 h-px bg-gray-200 dark:bg-gray-700" />

            <div className="mt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pb-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Rent survey by unit type</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Top 5 comps within 1 mile</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[20rem] text-left text-[13px] sm:text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                <th className="rounded-l-lg px-1.5 py-2 font-medium sm:px-3">Unit type</th>
                                <th className="px-1.5 py-2 text-right font-medium sm:px-3">Low</th>
                                <th className="px-1.5 py-2 text-right font-medium sm:px-3">Median</th>
                                <th className="px-1.5 py-2 text-right font-medium sm:px-3">High</th>
                                <th className="rounded-r-lg px-1.5 py-2 text-right font-medium sm:px-3">In-place</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SURVEY_ROWS.map((row) => (
                                <tr key={row.type} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-1.5 py-2.5 font-medium text-gray-900 sm:px-3 dark:text-gray-100">{row.type}</td>
                                    <td className="px-1.5 py-2.5 text-right text-gray-900 sm:px-3 dark:text-gray-100">{row.low}</td>
                                    <td className="px-1.5 py-2.5 text-right font-medium text-blue-900 sm:px-3 dark:text-blue-400">{row.median}</td>
                                    <td className="px-1.5 py-2.5 text-right text-gray-900 sm:px-3 dark:text-gray-100">{row.high}</td>
                                    <td className="px-1.5 py-2.5 text-right text-gray-900 sm:px-3 dark:text-gray-100">{row.inPlace}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
