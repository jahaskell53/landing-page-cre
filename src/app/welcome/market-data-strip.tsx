import { ArrowUpRight } from "lucide-react";
import { APP_ORIGIN } from "@/lib/app-origin";

const MARKET_DATA_LINKS = [
    {
        title: "Bay Area rent by city",
        description: "Median studio, 1BR, and 2BR asking rents across 14 Bay Area cities.",
        href: `${APP_ORIGIN}/rent`,
    },
    {
        title: "San Francisco rent by neighborhood",
        description: "Neighborhood-level median rents, $/sqft, and building benchmarks across SF.",
        href: `${APP_ORIGIN}/rent/sf`,
    },
    {
        title: "San Jose rent by neighborhood",
        description: "Current median asking rents and weekly trends across San Jose submarkets.",
        href: `${APP_ORIGIN}/rent/san-jose`,
    },
    {
        title: "Oakland apartment rents",
        description: "Citywide and neighborhood median asking rents across Oakland.",
        href: `${APP_ORIGIN}/rent/oakland`,
    },
    {
        title: "Palo Alto rent & building comps",
        description: "Median rents and building-level fair rent estimates across Palo Alto.",
        href: `${APP_ORIGIN}/rent/palo-alto`,
    },
    {
        title: "Bay Area apartment parking fees",
        description: "Median monthly extra parking fees charged by apartment buildings by city.",
        href: `${APP_ORIGIN}/parking`,
    },
] as const;

export function MarketDataStrip({ className = "bg-white dark:bg-gray-950" }: { className?: string }) {
    return (
        <section className={className}>
            <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">Free Market Data</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                        Live Bay Area rent &amp; parking benchmarks
                    </h2>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                        Updated daily from active rental listings. Explore city medians, neighborhood breakdowns, and building-level rent data.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {MARKET_DATA_LINKS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-900/40 hover:bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-blue-400/40 dark:hover:bg-gray-900"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-900 dark:text-gray-100 dark:group-hover:text-blue-400">
                                        {item.title}
                                    </h3>
                                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-900 dark:group-hover:text-blue-400" />
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
