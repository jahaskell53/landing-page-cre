import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMarketBySlug, getRelatedMarkets, MARKET_SLUGS, marketPath, marketPlaceName, marketRentPageUrl } from "@/lib/markets/catalog";
import { marketDetailJsonLd, marketDocumentTitle, marketFaqItems, marketInsightHighlights, marketMetaDescription } from "@/lib/markets/copy";
import { getMarketSnapshot } from "@/lib/markets/server";
import { buildPageMetadata } from "@/lib/seo";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/utils/format";
import { MarketBreadcrumbs, MarketFaqAccordion, MarketHighlights, MarketIcpCta, MarketMethodology, MarketPageShell } from "../market-page-shell";
import { MarketSalesChart } from "../market-sales-chart";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
    return MARKET_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const market = getMarketBySlug(slug);
    if (!market) notFound();

    const snapshot = await getMarketSnapshot(market);
    return buildPageMetadata({
        title: marketDocumentTitle(snapshot),
        description: marketMetaDescription(snapshot),
        pathname: marketPath(market.slug),
    });
}

export default async function MarketDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const market = getMarketBySlug(slug);
    if (!market) notFound();

    const snapshot = await getMarketSnapshot(market);
    const place = marketPlaceName(market);
    const highlights = marketInsightHighlights(snapshot);
    const faqs = marketFaqItems(snapshot);
    const relatedMarkets = getRelatedMarkets(market);
    const rentUrl = marketRentPageUrl(market);
    const jsonLd = marketDetailJsonLd(snapshot);

    // Reverse chronological table rows (most recent 12 quarters) so Googlebot sees the full data in HTML.
    const recentTableQuarters = [...snapshot.quarters].reverse().slice(0, 12);

    const hero = (
        <div>
            <MarketBreadcrumbs items={[{ label: "Bay Area markets", href: "/markets" }, { label: market.name }]} />
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
                        {place} multifamily cap rates &amp; $/door
                    </h1>
                    <p className="mt-2.5 text-sm text-gray-600 sm:text-base dark:text-gray-400">
                        Trailing 4-quarter closed multifamily sales
                        {snapshot.salesCount12Mo > 0 ? ` · ${formatNumber(snapshot.salesCount12Mo)} closed trades` : ""}
                        {snapshot.latestQuarterLabel ? ` · Latest ${snapshot.latestQuarterLabel}` : ""}
                    </p>
                </div>
                {rentUrl ? (
                    <a
                        href={rentUrl}
                        className="inline-flex items-center rounded-full border border-gray-200/80 bg-gray-50/70 px-3.5 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                    >
                        {market.name} apartment rents →
                    </a>
                ) : null}
            </div>

            <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                <section className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-5 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/50">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">Median cap rate</h2>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-blue-900 tabular-nums sm:text-4xl dark:text-blue-400">
                        {snapshot.medianCapRate != null ? formatPercent(snapshot.medianCapRate, 2) : "—"}
                    </p>
                </section>

                <section className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-5 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/50">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">Median price / door</h2>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-blue-900 tabular-nums sm:text-4xl dark:text-blue-400">
                        {snapshot.medianPricePerDoor != null ? formatCompact(snapshot.medianPricePerDoor) : "—"}
                    </p>
                </section>

                <section className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-5 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/50">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">Closed sales</h2>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 tabular-nums sm:text-4xl dark:text-gray-100">
                        {snapshot.salesCount12Mo > 0 ? formatNumber(snapshot.salesCount12Mo) : "—"}
                    </p>
                </section>

                <section className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-5 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/50">
                    <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">1-bedroom asking rent</h2>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 tabular-nums sm:text-4xl dark:text-gray-100">
                        {snapshot.medianRent1Br != null ? formatCurrency(snapshot.medianRent1Br) : "—"}
                        {snapshot.medianRent1Br != null ? <span className="ml-0.5 text-sm font-normal text-gray-500">/mo</span> : null}
                    </p>
                </section>
            </div>
        </div>
    );

    return (
        <MarketPageShell jsonLd={jsonLd} hero={hero}>
            <MarketHighlights items={highlights} />

            <section>
                <MarketSalesChart marketName={market.name} quarters={snapshot.quarters} />
            </section>

            {recentTableQuarters.length > 0 ? (
                <section>
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl dark:text-gray-100">
                            {market.name} quarterly multifamily sales history
                        </h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Most recent {recentTableQuarters.length} quarters</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900/50">
                        <table className="w-full min-w-[540px] text-left text-sm">
                            <thead className="border-b border-gray-200/80 bg-gray-50/70 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Quarter</th>
                                    <th className="px-4 py-3 text-right font-medium">Median cap rate</th>
                                    <th className="px-4 py-3 text-right font-medium">Median $/door</th>
                                    <th className="px-4 py-3 text-right font-medium">25th-75th $/door</th>
                                    <th className="px-4 py-3 text-right font-medium">Closed sales</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800">
                                {recentTableQuarters.map((q) => (
                                    <tr key={q.bucketStart} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-900/80">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{q.quarterLabel}</td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums dark:text-gray-100">
                                            {q.medianCapRate != null ? formatPercent(q.medianCapRate, 2) : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums dark:text-gray-100">
                                            {formatCurrency(q.medianPricePerDoor)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600 tabular-nums dark:text-gray-400">
                                            {q.p25PricePerDoor != null && q.p75PricePerDoor != null
                                                ? `${formatCompact(q.p25PricePerDoor)}-${formatCompact(q.p75PricePerDoor)}`
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600 tabular-nums dark:text-gray-400">
                                            {formatNumber(q.salesCount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}

            <MarketFaqAccordion items={faqs} heading={`${market.name} multifamily FAQ`} />

            <section>
                <h2 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Other Bay Area markets</h2>
                <ul className="flex flex-wrap gap-2">
                    <li>
                        <Link
                            href="/markets"
                            className="inline-block rounded-full border border-gray-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                        >
                            All markets
                        </Link>
                    </li>
                    {relatedMarkets.map((other) => (
                        <li key={other.slug}>
                            <Link
                                href={marketPath(other.slug)}
                                className="inline-block rounded-full border border-gray-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                            >
                                {other.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            href="/rent-comps"
                            className="inline-block rounded-full border border-gray-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                        >
                            Multifamily rent comps
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/bov"
                            className="inline-block rounded-full border border-gray-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                        >
                            BOV software
                        </Link>
                    </li>
                </ul>
            </section>

            <MarketIcpCta placeLabel={market.name} audience={`market_${market.slug}`} />

            <MarketMethodology>
                Closed multifamily sales are aggregated into quarterly buckets over a 5-year lookback. Price per door equals total sale price
                divided by unit count, excluding non-market outliers below $20,000/door. Reported cap rates are bounded at 12% to exclude
                data-entry outliers. Trailing 12-month headline metrics weight the four most recent quarters by transaction count. Active asking
                rents reflect the latest weekly median advertised rents for 1-bedroom and 2-bedroom apartment listings.
            </MarketMethodology>
        </MarketPageShell>
    );
}
