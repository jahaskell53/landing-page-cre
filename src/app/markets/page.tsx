import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { APP_ORIGIN } from "@/lib/app-origin";
import { BAY_AREA_MARKETS, marketPath } from "@/lib/markets/catalog";
import { marketsHubJsonLd } from "@/lib/markets/copy";
import { getAllMarketSnapshots, type MarketSnapshot } from "@/lib/markets/server";
import { buildPageMetadata } from "@/lib/seo";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/utils/format";
import { MarketIcpCta, MarketMethodology, MarketPageShell } from "./market-page-shell";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
    title: "Bay Area Multifamily Cap Rates & Price Per Door | OpenMidmarket",
    description:
        "Live multifamily cap rates, closed-sale price per door, 12-month sales volume, and apartment rent benchmarks across San Francisco, Oakland, San Jose, and Bay Area counties.",
    pathname: "/markets",
});

function MarketCardGrid({
    title,
    rightLink,
    rows,
}: {
    title: string;
    rightLink?: { label: string; href: string; external?: boolean };
    rows: readonly MarketSnapshot[];
}) {
    return (
        <section>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl dark:text-gray-100">{title}</h2>
                {rightLink ? (
                    rightLink.external ? (
                        <a
                            href={rightLink.href}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-900 hover:underline dark:text-blue-400"
                        >
                            {rightLink.label}
                            <ArrowUpRight className="size-3.5" />
                        </a>
                    ) : (
                        <Link href={rightLink.href} className="text-xs font-medium text-blue-900 hover:underline dark:text-blue-400">
                            {rightLink.label}
                        </Link>
                    )
                ) : null}
            </div>
            <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((snapshot) => (
                    <li key={snapshot.market.slug}>
                        <Link
                            href={marketPath(snapshot.market.slug)}
                            className="group flex h-full flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-2xs transition-all hover:border-blue-900/40 hover:shadow-xs dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-blue-400/40"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-base font-semibold tracking-tight text-gray-900 group-hover:text-blue-900 dark:text-gray-100 dark:group-hover:text-blue-400">
                                        {snapshot.market.name}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                        {snapshot.market.region}
                                        {snapshot.salesCount12Mo > 0 ? ` · ${formatNumber(snapshot.salesCount12Mo)} T12 sales` : ""}
                                    </p>
                                </div>
                                <ArrowRight className="mt-0.5 size-4 shrink-0 text-gray-400/70 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-900 dark:group-hover:text-blue-400" />
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-200/70 pt-3 dark:border-gray-800">
                                <div>
                                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Cap rate</p>
                                    <p className="mt-0.5 text-lg font-semibold tracking-tight text-blue-900 tabular-nums dark:text-blue-400">
                                        {snapshot.medianCapRate != null ? formatPercent(snapshot.medianCapRate, 2) : "—"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Median $/door</p>
                                    <p className="mt-0.5 text-lg font-semibold tracking-tight text-gray-900 tabular-nums dark:text-gray-100">
                                        {snapshot.medianPricePerDoor != null ? formatCompact(snapshot.medianPricePerDoor) : "—"}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default async function MarketsHubPage() {
    const snapshots = await getAllMarketSnapshots();
    const counties = snapshots.filter((s) => s.market.kind === "county");
    const cities = snapshots.filter((s) => s.market.kind === "city");
    const jsonLd = marketsHubJsonLd(BAY_AREA_MARKETS);

    const citiesWithPrice = cities.filter((s): s is MarketSnapshot & { medianPricePerDoor: number } => s.medianPricePerDoor != null);
    const highestPpd = [...citiesWithPrice].sort((a, b) => b.medianPricePerDoor - a.medianPricePerDoor)[0] ?? null;

    const citiesWithCap = cities.filter((s): s is MarketSnapshot & { medianCapRate: number } => s.medianCapRate != null);
    const highestCap = [...citiesWithCap].sort((a, b) => b.medianCapRate - a.medianCapRate)[0] ?? null;

    const hero = (
        <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
                Bay Area multifamily cap rates &amp; price per door
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg dark:text-gray-400">
                Trailing 4-quarter closed multifamily cap rates, per-door pricing, and asking rent benchmarks across San Francisco, East Bay,
                Peninsula, and South Bay submarkets.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Published markets</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 tabular-nums sm:text-3xl dark:text-gray-100">
                        {cities.length} cities · {counties.length} counties
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Quarterly closed multifamily comps</p>
                </div>
                {highestCap ? (
                    <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Highest median cap rate</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-blue-900 tabular-nums sm:text-3xl dark:text-blue-400">
                            {formatPercent(highestCap.medianCapRate, 2)}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{highestCap.market.name}</p>
                    </div>
                ) : null}
                {highestPpd ? (
                    <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Highest median $/door</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 tabular-nums sm:text-3xl dark:text-gray-100">
                            {formatCompact(highestPpd.medianPricePerDoor)}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{highestPpd.market.name}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );

    return (
        <MarketPageShell jsonLd={jsonLd} hero={hero}>
            <MarketCardGrid
                title="Bay Area cities"
                rightLink={{ label: "Compare Bay Area apartment rents", href: `${APP_ORIGIN}/rent`, external: true }}
                rows={cities}
            />

            <MarketCardGrid title="Bay Area counties" rows={counties} />

            <section>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl dark:text-gray-100">Side-by-side comparison</h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Trailing 4-quarter closed sales &amp; latest 1BR rent</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900/50">
                    <table className="w-full min-w-[600px] text-left text-sm">
                        <thead className="border-b border-gray-200/80 bg-gray-50/70 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">Market</th>
                                <th className="px-4 py-3 text-right font-medium">Cap rate</th>
                                <th className="px-4 py-3 text-right font-medium">Median $/door</th>
                                <th className="px-4 py-3 text-right font-medium">12-mo sales</th>
                                <th className="px-4 py-3 text-right font-medium">1BR rent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800">
                            {snapshots.map((snapshot) => (
                                <tr key={snapshot.market.slug} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-900/80">
                                    <td className="px-4 py-3">
                                        <Link
                                            href={marketPath(snapshot.market.slug)}
                                            className="font-medium text-gray-900 hover:text-blue-900 hover:underline dark:text-gray-100 dark:hover:text-blue-400"
                                        >
                                            {snapshot.market.name}
                                        </Link>
                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{snapshot.market.region}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums dark:text-gray-100">
                                        {snapshot.medianCapRate != null ? formatPercent(snapshot.medianCapRate, 2) : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums dark:text-gray-100">
                                        {snapshot.medianPricePerDoor != null ? formatCompact(snapshot.medianPricePerDoor) : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-600 tabular-nums dark:text-gray-400">
                                        {snapshot.salesCount12Mo > 0 ? formatNumber(snapshot.salesCount12Mo) : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-600 tabular-nums dark:text-gray-400">
                                        {snapshot.medianRent1Br != null ? formatCurrency(snapshot.medianRent1Br) : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Workflows &amp; benchmarks</h2>
                <ul className="flex flex-wrap gap-2">
                    {[
                        { label: "Multifamily rent comps", href: "/rent-comps", external: false },
                        { label: "Multifamily BOV software", href: "/bov", external: false },
                        { label: "CoStar alternative", href: "/costar-alternative", external: false },
                        { label: "Bay Area rent by city", href: `${APP_ORIGIN}/rent`, external: true },
                        { label: "Bay Area parking fees", href: `${APP_ORIGIN}/parking`, external: true },
                    ].map((item) => (
                        <li key={item.href}>
                            {item.external ? (
                                <a
                                    href={item.href}
                                    className="inline-block rounded-full border border-gray-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                                >
                                    {item.label} →
                                </a>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="inline-block rounded-full border border-gray-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

            <MarketIcpCta placeLabel="Bay Area" audience="markets_hub" />

            <MarketMethodology>
                Closed multifamily transactions are aggregated into quarterly buckets over a 5-year lookback. Price per door equals total sale
                price divided by unit count, excluding non-market outliers below $20,000/door. Reported cap rates are bounded at 12% to filter
                reporting errors. Trailing 12-month headline figures weight the four most recent quarters by transaction count.
            </MarketMethodology>
        </MarketPageShell>
    );
}
