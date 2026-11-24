import { CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { WORKFLOW_PAGE_LIST, type WorkflowPageConfig } from "@/lib/workflow-pages";
import { decorateHeroSubtitle, HERO_HEADING_CLASS, renderHeroHeadline } from "./hero-block";
import { AudienceBenefitsShowcase } from "./leads-benefits";
import { MarketDataStrip } from "./market-data-strip";
import { SignupCtaButton } from "./signup-cta";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { VideoPanel } from "./video-panel";

const AppPreview = dynamic(() => import("./app-preview").then((mod) => mod.AppPreview), {
    loading: () => <div className="min-h-[520px] w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />,
});

const SECTION_WHITE = "bg-white dark:bg-gray-950";
const SECTION_GRAY = "bg-gray-50 dark:bg-gray-900/40";
const SECTION_CONTAINER = "mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8";

export function WorkflowLanding({ page }: { page: WorkflowPageConfig }) {
    const otherWorkflows = WORKFLOW_PAGE_LIST.filter((other) => other.slug !== page.slug);

    return (
        <div className="min-h-dvh bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <SiteHeader />

            <main>
                <section className={SECTION_WHITE}>
                    <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-14 sm:px-6 lg:px-8 lg:pt-16 lg:pb-20">
                        <h1 className={HERO_HEADING_CLASS}>{renderHeroHeadline(page.hero)}</h1>
                        <p className="mt-6 max-w-4xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
                            {decorateHeroSubtitle(page.hero.subtitle, page.hero.emphasis, page.hero.italic)}
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <SignupCtaButton trackingLocation="workflow_page_cta" audience={page.slug} />
                            <Link
                                href="/markets"
                                className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:text-gray-200 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                            >
                                Explore Bay Area cap rates →
                            </Link>
                        </div>
                        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">{page.coverageNote}</p>
                    </div>
                </section>

                {page.comparison ? (
                    <section className={SECTION_GRAY}>
                        <div className={SECTION_CONTAINER}>
                            <div className="max-w-3xl">
                                <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">
                                    {page.comparison.eyebrow}
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                                    {page.comparison.heading}
                                </h2>
                                <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{page.comparison.subtitle}</p>
                            </div>

                            <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/60">
                                <table className="w-full min-w-[640px] text-left text-sm">
                                    <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                                        <tr>
                                            <th className="w-1/4 px-5 py-3.5">Category</th>
                                            <th className="w-3/8 px-5 py-3.5 text-blue-900 dark:text-blue-400">OpenMidmarket</th>
                                            <th className="w-3/8 px-5 py-3.5">{page.comparison.incumbentName}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {page.comparison.rows.map((row) => (
                                            <tr key={row.dimension} className="align-top">
                                                <td className="px-5 py-4 font-semibold text-gray-900 dark:text-gray-100">{row.dimension}</td>
                                                <td className="px-5 py-4 leading-relaxed text-gray-800 dark:text-gray-200">{row.openMidmarket}</td>
                                                <td className="px-5 py-4 leading-relaxed text-gray-600 dark:text-gray-400">{row.incumbent}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {page.comparison.honestNote}
                            </p>
                        </div>
                    </section>
                ) : null}

                {page.deliverables ? (
                    <section className={SECTION_GRAY}>
                        <div className={SECTION_CONTAINER}>
                            <div className="max-w-3xl">
                                <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">
                                    {page.deliverables.eyebrow}
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                                    {page.deliverables.heading}
                                </h2>
                                <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{page.deliverables.subtitle}</p>
                            </div>

                            <div className="mt-10 grid gap-6 sm:grid-cols-2">
                                {page.deliverables.items.map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/60"
                                    >
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-blue-900 dark:text-blue-400" />
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                                                <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.body}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : null}

                <AudienceBenefitsShowcase
                    eyebrow={page.showcase.eyebrow}
                    heading={page.showcase.heading}
                    steps={page.showcase.steps}
                    audience={page.slug}
                />

                <section className={SECTION_WHITE}>
                    <div className={SECTION_CONTAINER}>
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                                {page.appPreview.heading}
                            </h2>
                            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{page.appPreview.subtitle}</p>
                        </div>
                        <div className="relative mt-10">
                            <AppPreview
                                initialPanel={page.appPreview.panel}
                                enableAutoCycle={false}
                                browserUrl={page.appPreview.browserUrl}
                                showRentAreaStats
                            />
                        </div>
                    </div>
                </section>

                <section className={SECTION_GRAY}>
                    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">FAQ</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                            Common questions
                        </h2>
                        <dl className="mt-10 divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                            {page.faqs.map((faq) => (
                                <div key={faq.question} className="py-6">
                                    <dt className="text-lg font-semibold text-gray-900 dark:text-gray-100">{faq.question}</dt>
                                    <dd className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <MarketDataStrip className={SECTION_WHITE} />

                <section className={SECTION_GRAY}>
                    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold tracking-[0.08em] text-gray-500 uppercase dark:text-gray-400">
                            Explore more workflows &amp; roles
                        </p>
                        <nav aria-label="Related workflows and roles" className="mt-4 flex flex-wrap gap-2.5">
                            {otherWorkflows.map((other) => (
                                <Link
                                    key={other.slug}
                                    href={`/${other.slug}`}
                                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                                >
                                    {other.label}
                                </Link>
                            ))}
                            <Link
                                href="/brokers"
                                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                            >
                                For CRE brokers
                            </Link>
                            <Link
                                href="/investors"
                                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                            >
                                For multifamily investors
                            </Link>
                            <Link
                                href="/markets"
                                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                            >
                                Bay Area cap rates &amp; markets
                            </Link>
                        </nav>
                    </div>
                </section>
            </main>

            <VideoPanel
                videoSrc="/videos/sf-residential-aerial.mp4"
                posterSrc="/videos/sf-residential-aerial-poster.jpg"
                footer={<SiteFooter variant="overlay" />}
            >
                <div className="flex w-full flex-col items-start text-left">
                    <h2 className="max-w-4xl text-left text-[clamp(1.125rem,4.8vw,6rem)] leading-[1.1] font-semibold tracking-tight text-white">
                        <span className="block">{page.footerCta.leadLine}</span>
                        <span className="block">
                            {page.footerCta.brandPrefix} <span className="text-blue-400">OpenMidmarket</span>
                        </span>
                    </h2>
                    <div className="mt-10">
                        <SignupCtaButton trackingLocation="footer_get_started" audience={page.slug} />
                    </div>
                </div>
            </VideoPanel>
        </div>
    );
}
