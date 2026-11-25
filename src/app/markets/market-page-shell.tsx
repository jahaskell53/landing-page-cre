import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SignupCta } from "@/app/welcome/signup-cta";
import { SiteFooter } from "@/app/welcome/site-footer";
import { SiteHeader } from "@/app/welcome/site-header";
import type { MarketFaq } from "@/lib/markets/copy";
import { SITE_ORIGIN } from "@/lib/organization";

export type MarketBreadcrumbItem = {
    label: string;
    href?: string;
};

export function MarketBreadcrumbs({ items }: { items: readonly MarketBreadcrumbItem[] }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            {items.map((item, index) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                    {index > 0 ? <ChevronRight className="size-3.5 text-gray-400/80 dark:text-gray-600" aria-hidden="true" /> : null}
                    {item.href ? (
                        <Link href={item.href} className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

/**
 * Shared chrome for `/markets` and `/markets/[slug]`, matching the redesigned
 * `/rent` and `/parking` public data layout: crisp white hero band separated
 * from a softly tinted canvas below so cards, charts, and tables breathe.
 */
export function MarketPageShell({
    jsonLd,
    hero,
    children,
}: {
    jsonLd: Record<string, unknown>;
    hero: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="min-h-dvh bg-gray-50/70 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <SiteHeader />
            <div className="border-b border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="mx-auto max-w-5xl px-5 pt-8 pb-10 sm:px-8 sm:pt-12 sm:pb-12">{hero}</div>
            </div>
            <main className="mx-auto max-w-5xl space-y-12 px-5 py-10 sm:px-8 sm:py-12">{children}</main>
            <SiteFooter />
        </div>
    );
}

/** Compact executive takeaway card replacing stacked prose paragraphs above the fold. */
export function MarketHighlights({ items }: { items: readonly string[] }) {
    if (items.length === 0) return null;
    return (
        <section aria-label="Market highlights" className="rounded-xl border border-gray-200/80 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Market snapshot</p>
            <ul className={`mt-3 grid gap-4 ${items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                {items.map((sentence) => (
                    <li key={sentence} className="flex gap-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-900 dark:bg-blue-400" />
                        <span>{sentence}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

/** Native `<details>` accordion FAQ matching `/rent` and `/parking` while keeping full SSR HTML for FAQPage schema. */
export function MarketFaqAccordion({ items, heading = "Frequently asked questions" }: { items: readonly MarketFaq[]; heading?: string }) {
    if (items.length === 0) return null;
    return (
        <section>
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-gray-900 sm:text-xl dark:text-gray-100">{heading}</h2>
            <div className="divide-y divide-gray-200/80 overflow-hidden rounded-xl border border-gray-200/80 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900/50">
                {items.map((item, index) => (
                    <details key={item.question} open={index === 0} className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 sm:text-base dark:text-gray-100 dark:hover:bg-gray-900 [&::-webkit-details-marker]:hidden">
                            <span>{item.question}</span>
                            <ChevronDown
                                className="size-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                                aria-hidden="true"
                            />
                        </summary>
                        <div className="px-5 pt-0 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</div>
                    </details>
                ))}
            </div>
        </section>
    );
}

/** Deep navy ICP conversion card matching `PublicRentIcpCta` on `/rent` and `/parking`. */
export function MarketIcpCta({ placeLabel, audience }: { placeLabel: string; audience: string }) {
    return (
        <section className="rounded-2xl bg-[#0f1f4b] p-6 text-white ring-1 ring-white/10 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                    <p className="text-xs font-semibold tracking-wider text-blue-300 uppercase">OpenMidmarket Platform</p>
                    <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white sm:text-xl">
                        Underwriting a {placeLabel} multifamily deal or building a BOV?
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-blue-100/80">
                        Go beyond submarket averages. Pull photo-scored rent comps, quantify value-add rent upside, and export client-ready PDF
                        and Excel packets in seconds.
                    </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                    <SignupCta
                        trackingLocation="market_page_cta"
                        audience={audience}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-[#0f1f4b] transition-colors hover:bg-blue-50 sm:text-sm"
                    />
                    <Link
                        href="/brokers"
                        className="inline-flex items-center rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/15 sm:text-sm"
                    >
                        For brokers →
                    </Link>
                    <Link
                        href="/investors"
                        className="inline-flex items-center rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/15 sm:text-sm"
                    >
                        For investors →
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function MarketMethodology({ children }: { children: ReactNode }) {
    return (
        <footer className="space-y-2.5 border-t border-gray-200/80 pt-8 pb-4 text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Methodology</h2>
            <p>{children}</p>
            <p>
                Built by{" "}
                <a href={SITE_ORIGIN} className="font-semibold text-gray-900 hover:underline dark:text-gray-100">
                    OpenMidmarket
                </a>
                , commercial real estate market intelligence for Bay Area multifamily brokers and investors.
            </p>
        </footer>
    );
}
