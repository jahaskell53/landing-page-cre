import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { APP_ORIGIN } from "@/lib/app-origin";

const MARKET_DATA_LINKS = [
    {
        title: "Bay Area cap rates & $/door",
        description: "Closed multifamily cap rates, median price per door, and sales volume across 14 Bay Area markets.",
        href: "/markets",
        external: false,
    },
    {
        title: "San Francisco multifamily cap rates",
        description: "Quarterly closed cap rates, price per door, and apartment rent benchmarks across SF.",
        href: "/markets/san-francisco",
        external: false,
    },
    {
        title: "Oakland multifamily cap rates",
        description: "East Bay apartment cap rates, median $/door trends, and trailing 12-month sales volume.",
        href: "/markets/oakland",
        external: false,
    },
    {
        title: "San Jose multifamily cap rates",
        description: "Silicon Valley closed multifamily pricing per door, cap rate history, and asking rents.",
        href: "/markets/san-jose",
        external: false,
    },
    {
        title: "San Mateo County cap rates",
        description: "Peninsula multifamily closed sales trends across San Mateo, Redwood City, and Burlingame.",
        href: "/markets/san-mateo-county",
        external: false,
    },
    {
        title: "Bay Area apartment rent by city",
        description: "Daily studio, 1BR, and 2BR asking rent medians and neighborhood breakdowns across 14 cities.",
        href: `${APP_ORIGIN}/rent`,
        external: true,
    },
] as const;

export function MarketDataStrip({ className = "bg-white dark:bg-gray-950" }: { className?: string }) {
    return (
        <section className={className}>
            <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">Free Market Data</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                        Live Bay Area multifamily cap rates, $/door &amp; rents
                    </h2>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                        Updated from closed multifamily transactions and active rental listings for Bay Area brokers, investors, and owners.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {MARKET_DATA_LINKS.map((item) => {
                        const cardClass =
                            "group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-900/40 hover:bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-blue-400/40 dark:hover:bg-gray-900";
                        const inner = (
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-900 dark:text-gray-100 dark:group-hover:text-blue-400">
                                        {item.title}
                                    </h3>
                                    {item.external ? (
                                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-900 dark:group-hover:text-blue-400" />
                                    ) : (
                                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-900 dark:group-hover:text-blue-400" />
                                    )}
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                        );

                        return item.external ? (
                            <a key={item.href} href={item.href} className={cardClass}>
                                {inner}
                            </a>
                        ) : (
                            <Link key={item.href} href={item.href} className={cardClass}>
                                {inner}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
