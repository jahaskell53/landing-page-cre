import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignupCtaButton } from "@/app/welcome/signup-cta";
import { SiteFooter } from "@/app/welcome/site-footer";
import { SiteHeader } from "@/app/welcome/site-header";
import { getMarketBySlug, getRelatedMarkets, MARKET_SLUGS, marketPath, marketPlaceName, marketRentPageUrl } from "@/lib/markets/catalog";
import { marketDetailJsonLd, marketDocumentTitle, marketFaqItems, marketInsightSentences, marketMetaDescription } from "@/lib/markets/copy";
import { getMarketSnapshot } from "@/lib/markets/server";
import { buildPageMetadata } from "@/lib/seo";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/utils/format";
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
    const insights = marketInsightSentences(snapshot);
    const faqs = marketFaqItems(snapshot);
    const relatedMarkets = getRelatedMarkets(market);
    const rentUrl = marketRentPageUrl(market);
    const jsonLd = marketDetailJsonLd(snapshot);

    // Reverse chronological table rows (most recent 12 quarters) so Googlebot sees the full data in HTML.
    const recentTableQuarters = [...snapshot.quarters].reverse().slice(0, 12);

    return (
        <div className="min-h-dvh bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <SiteHeader />

            <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/markets" className="inline-flex items-center gap-1.5 font-medium hover:text-gray-900 dark:hover:text-gray-100">
                        <ArrowLeft className="size-3.5" />
                        Bay Area Multifamily Markets
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-gray-900 dark:text-gray-100">{market.name}</span>
                </nav>

                <header className="mb-10 max-w-3xl">
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
                        {place} multifamily cap rates &amp; price per door
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{market.blurb}</p>
                    {insights.length > 0 ? (
                        <div className="mt-4 space-y-2.5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            {insights.map((sentence) => (
                                <p key={sentence}>{sentence}</p>
                            ))}
                        </div>
                    ) : null}
                </header>

                <section aria-label="Key market metrics" className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Median Cap Rate (T12)</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                            {snapshot.medianCapRate != null ? formatPercent(snapshot.medianCapRate, 2) : "—"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {snapshot.capRateSampleCount > 0
                                ? `From ${formatNumber(snapshot.capRateSampleCount)} sales w/ cap rate`
                                : "Trailing 4 quarters"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Median Price / Door (T12)</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                            {snapshot.medianPricePerDoor != null ? formatCompact(snapshot.medianPricePerDoor) : "—"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {snapshot.p25PricePerDoor != null && snapshot.p75PricePerDoor != null
                                ? `P25-P75: ${formatCompact(snapshot.p25PricePerDoor)}-${formatCompact(snapshot.p75PricePerDoor)}`
                                : snapshot.pricePerDoorYoYPct != null
                                  ? `${formatPercent(snapshot.pricePerDoorYoYPct, 1, { showSign: true })} YoY`
                                  : "Closed multifamily trades"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Closed Sales (T12)</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                            {snapshot.salesCount12Mo > 0 ? formatNumber(snapshot.salesCount12Mo) : "—"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {snapshot.latestQuarterLabel ? `Latest bucket: ${snapshot.latestQuarterLabel}` : "Quarterly closed comps"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Active Asking Rent</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                            {snapshot.medianRent1Br != null ? formatCurrency(snapshot.medianRent1Br) : "—"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {snapshot.medianRent2Br != null ? `1BR median · 2BR ${formatCurrency(snapshot.medianRent2Br)}` : "1-bedroom median"}
                        </p>
                    </div>
                </section>

                <section className="mb-10">
                    <MarketSalesChart marketName={market.name} quarters={snapshot.quarters} />
                </section>

                {recentTableQuarters.length > 0 ? (
                    <section className="mb-12">
                        <h2 className="mb-3 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                            {market.name} quarterly multifamily sales history
                        </h2>
                        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
                            <table className="w-full min-w-[540px] text-left text-sm">
                                <thead className="border-b border-gray-200 bg-gray-50/80 text-xs font-medium text-gray-500 uppercase dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Quarter</th>
                                        <th className="px-4 py-3 text-right">Median Cap Rate</th>
                                        <th className="px-4 py-3 text-right">Median $/Door</th>
                                        <th className="px-4 py-3 text-right">25th-75th $/Door</th>
                                        <th className="px-4 py-3 text-right">Closed Sales</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {recentTableQuarters.map((q) => (
                                        <tr key={q.bucketStart}>
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{q.quarterLabel}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums dark:text-gray-100">
                                                {q.medianCapRate != null ? formatPercent(q.medianCapRate, 2) : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums dark:text-gray-100">
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

                <section className="mb-12 rounded-2xl border border-blue-900/20 bg-blue-950/[0.03] p-6 sm:p-8 dark:border-blue-400/20 dark:bg-blue-950/20">
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                        Underwriting a {market.name} apartment building or pitching a BOV?
                    </h2>
                    <p className="mt-2 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        Pull photo-scored rent comps, verify true value-add rent upside, and match active {market.name} deals with local buyers
                        inside OpenMidmarket.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <SignupCtaButton trackingLocation="market_page_cta" audience={`market_${market.slug}`} />
                        <Link
                            href="/brokers"
                            className="text-sm font-semibold text-blue-900 hover:underline dark:text-blue-400"
                        >
                            For CRE brokers →
                        </Link>
                        <Link
                            href="/investors"
                            className="text-sm font-semibold text-blue-900 hover:underline dark:text-blue-400"
                        >
                            For multifamily investors →
                        </Link>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                        {market.name} multifamily FAQ
                    </h2>
                    <dl className="mt-6 divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                        {faqs.map((faq) => (
                            <div key={faq.question} className="py-5">
                                <dt className="text-base font-semibold text-gray-900 dark:text-gray-100">{faq.question}</dt>
                                <dd className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <section className="mb-12 grid gap-8 border-t border-gray-200 pt-8 sm:grid-cols-2 dark:border-gray-800">
                    <div>
                        <h2 className="text-sm font-semibold tracking-[0.08em] text-gray-500 uppercase dark:text-gray-400">
                            Nearby Bay Area markets
                        </h2>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {relatedMarkets.map((other) => (
                                <li key={other.slug}>
                                    <Link
                                        href={marketPath(other.slug)}
                                        className="inline-block rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:text-gray-300 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                                    >
                                        {other.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold tracking-[0.08em] text-gray-500 uppercase dark:text-gray-400">
                            Tools &amp; rent benchmarks
                        </h2>
                        <ul className="mt-3 space-y-2 text-sm">
                            {rentUrl ? (
                                <li>
                                    <a
                                        href={rentUrl}
                                        className="inline-flex items-center gap-1 font-medium text-blue-900 hover:underline dark:text-blue-400"
                                    >
                                        {market.name} apartment rent by bedroom &amp; neighborhood
                                        <ArrowUpRight className="size-3.5" />
                                    </a>
                                </li>
                            ) : null}
                            <li>
                                <Link href="/rent-comps" className="font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400">
                                    Multifamily rent comps &amp; survey tool →
                                </Link>
                            </li>
                            <li>
                                <Link href="/bov" className="font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400">
                                    Multifamily BOV software →
                                </Link>
                            </li>
                            <li>
                                <Link href="/costar-alternative" className="font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400">
                                    CoStar alternative for mid-market multifamily →
                                </Link>
                            </li>
                        </ul>
                    </div>
                </section>

                <footer className="border-t border-gray-200 pt-6 text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Methodology</p>
                    <p className="mt-1">
                        Closed multifamily sales are aggregated into quarterly buckets over a 5-year lookback. Price per door equals total sale price
                        divided by unit count, excluding non-market outliers below $20,000/door. Reported cap rates are bounded at 12% to exclude
                        data-entry outliers. Trailing 12-month headline metrics weight the four most recent quarters by transaction count. Active
                        asking rents reflect the latest weekly median advertised rents for 1-bedroom and 2-bedroom apartment listings.
                    </p>
                </footer>
            </main>

            <SiteFooter />
        </div>
    );
}
