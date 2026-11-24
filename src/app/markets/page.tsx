import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SignupCtaButton } from "@/app/welcome/signup-cta";
import { SiteFooter } from "@/app/welcome/site-footer";
import { SiteHeader } from "@/app/welcome/site-header";
import { APP_ORIGIN } from "@/lib/app-origin";
import { BAY_AREA_MARKETS, marketPath } from "@/lib/markets/catalog";
import { marketsHubJsonLd } from "@/lib/markets/copy";
import { getAllMarketSnapshots, type MarketSnapshot } from "@/lib/markets/server";
import { buildPageMetadata } from "@/lib/seo";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/utils/format";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
    title: "Bay Area Multifamily Cap Rates & Price Per Door | OpenMidmarket",
    description:
        "Live multifamily cap rates, closed-sale price per door, 12-month sales volume, and apartment rent benchmarks across San Francisco, Oakland, San Jose, and Bay Area counties.",
    pathname: "/markets",
});

function MarketTable({ title, subtitle, rows }: { title: string; subtitle: string; rows: readonly MarketSnapshot[] }) {
    return (
        <section className="mb-12">
            <div className="mb-4">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50/80 text-xs font-medium text-gray-500 uppercase dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">Market</th>
                            <th className="px-4 py-3 text-right">Median Cap Rate</th>
                            <th className="px-4 py-3 text-right">Median $/Door</th>
                            <th className="px-4 py-3 text-right">12-Mo Sales</th>
                            <th className="px-4 py-3 text-right">1BR Rent</th>
                            <th className="px-4 py-3 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {rows.map((snapshot) => (
                            <tr key={snapshot.market.slug} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-900/80">
                                <td className="px-4 py-3.5">
                                    <Link
                                        href={marketPath(snapshot.market.slug)}
                                        className="font-semibold text-gray-900 hover:text-blue-900 dark:text-gray-100 dark:hover:text-blue-400"
                                    >
                                        {snapshot.market.name}
                                    </Link>
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{snapshot.market.region}</span>
                                </td>
                                <td className="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                                    {snapshot.medianCapRate != null ? formatPercent(snapshot.medianCapRate, 2) : "—"}
                                </td>
                                <td className="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                                    {snapshot.medianPricePerDoor != null ? formatCompact(snapshot.medianPricePerDoor) : "—"}
                                </td>
                                <td className="px-4 py-3.5 text-right text-gray-600 tabular-nums dark:text-gray-300">
                                    {snapshot.salesCount12Mo > 0 ? formatNumber(snapshot.salesCount12Mo) : "—"}
                                </td>
                                <td className="px-4 py-3.5 text-right text-gray-600 tabular-nums dark:text-gray-300">
                                    {snapshot.medianRent1Br != null ? formatCurrency(snapshot.medianRent1Br) : "—"}
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                    <Link
                                        href={marketPath(snapshot.market.slug)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
                                    >
                                        View
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default async function MarketsHubPage() {
    const snapshots = await getAllMarketSnapshots();
    const counties = snapshots.filter((s) => s.market.kind === "county");
    const cities = snapshots.filter((s) => s.market.kind === "city");
    const jsonLd = marketsHubJsonLd(BAY_AREA_MARKETS);

    return (
        <div className="min-h-dvh bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <SiteHeader />

            <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <header className="mb-12 max-w-3xl">
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
                        Bay Area multifamily cap rates &amp; price per door
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                        Closed multifamily transaction benchmarks across San Francisco, East Bay, Peninsula, and South Bay submarkets. Built for
                        apartment brokers, investors, owners, and lenders underwriting 5 to 100+ unit deals.
                    </p>
                </header>

                <MarketTable
                    title="Bay Area Cities"
                    subtitle="Trailing 4-quarter closed multifamily cap rates, median price per door, and active 1-bedroom asking rents."
                    rows={cities}
                />

                <MarketTable
                    title="Bay Area Counties"
                    subtitle="Countywide multifamily sales rollups for broader submarket underwriting and BOV benchmarks."
                    rows={counties}
                />

                <section className="mb-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                                Underwriting a Bay Area apartment deal or building a BOV?
                            </h2>
                            <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                                Go beyond city averages. Pull photo-scored rent comps, quantify value-add rent upside, and export client-ready PDF
                                and Excel packets for any Bay Area address in seconds.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <SignupCtaButton trackingLocation="market_page_cta" audience="markets_hub" />
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Multifamily rent comps",
                            description: "Pull photo-scored rent surveys and export to Excel or PDF.",
                            href: "/rent-comps",
                            external: false,
                        },
                        {
                            title: "Multifamily BOV software",
                            description: "Build defensible Broker Opinions of Value in minutes.",
                            href: "/bov",
                            external: false,
                        },
                        {
                            title: "CoStar alternative",
                            description: "Purpose-built for mid-market 5-100 unit apartments.",
                            href: "/costar-alternative",
                            external: false,
                        },
                        {
                            title: "Bay Area rent by city",
                            description: "Daily studio, 1BR, and 2BR asking rent tables and trends.",
                            href: `${APP_ORIGIN}/rent`,
                            external: true,
                        },
                    ].map((card) => {
                        const cardClass =
                            "group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-900/40 hover:bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-blue-400/40";
                        const inner = (
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-900 dark:text-gray-100 dark:group-hover:text-blue-400">
                                        {card.title}
                                    </h3>
                                    {card.external ? (
                                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-gray-400 group-hover:text-blue-900 dark:group-hover:text-blue-400" />
                                    ) : (
                                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-gray-400 group-hover:text-blue-900 dark:group-hover:text-blue-400" />
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                            </div>
                        );
                        return card.external ? (
                            <a key={card.href} href={card.href} className={cardClass}>
                                {inner}
                            </a>
                        ) : (
                            <Link key={card.href} href={card.href} className={cardClass}>
                                {inner}
                            </Link>
                        );
                    })}
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
