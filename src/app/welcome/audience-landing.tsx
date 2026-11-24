import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import { AUDIENCE_PAGE_LIST, type AudiencePageConfig } from "@/lib/audience-pages";
import { decorateHeroSubtitle, HERO_HEADING_CLASS, renderHeroHeadline } from "./hero-block";
import { HeroRentChart } from "./hero-rent-chart";
import { QuickStatsSection } from "./landing-home";
import { AudienceBenefitsShowcase } from "./leads-benefits";
import { MarketDataStrip } from "./market-data-strip";
import { HeroRentChartFallback } from "./rent-trends-preview";
import { SignupCtaButton } from "./signup-cta";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { VideoPanel } from "./video-panel";

const AppPreview = dynamic(() => import("./app-preview").then((mod) => mod.AppPreview), {
    loading: () => <div className="min-h-[520px] w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />,
});

const EMPHASIS = "font-semibold text-blue-900 dark:text-blue-400";
const SECTION_WHITE = "bg-white dark:bg-gray-950";
const SECTION_GRAY = "bg-gray-50 dark:bg-gray-900/40";
const SECTION_CONTAINER = "mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8";

export function AudienceLanding({ page }: { page: AudiencePageConfig }) {
    const otherAudiences = AUDIENCE_PAGE_LIST.filter((other) => other.slug !== page.slug);

    return (
        <div className="min-h-dvh bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <SiteHeader />

            <main>
                <section className={SECTION_WHITE}>
                    <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6 sm:px-6 lg:px-8 lg:pt-16 lg:pb-8">
                        <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">{page.label}</p>
                        <h1 className={HERO_HEADING_CLASS}>{renderHeroHeadline(page.hero)}</h1>
                        <p className="mt-6 max-w-4xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
                            {decorateHeroSubtitle(page.hero.subtitle, page.hero.emphasis, page.hero.italic)}
                        </p>
                        <div className="mt-8">
                            <SignupCtaButton trackingLocation="audience_get_started" audience={page.slug} />
                        </div>
                    </div>
                </section>

                <section className={SECTION_GRAY}>
                    <div className="mx-auto w-full max-w-6xl px-4 pt-4 pb-14 sm:px-6 lg:px-8 lg:pt-5 lg:pb-20">
                        <Suspense fallback={<HeroRentChartFallback />}>
                            <HeroRentChart />
                        </Suspense>
                    </div>
                </section>

                <AudienceBenefitsShowcase
                    eyebrow={page.showcase.eyebrow}
                    heading={page.showcase.heading}
                    steps={page.showcase.steps}
                    audience={page.slug}
                />

                <section id="features" className={SECTION_WHITE}>
                    <div className={SECTION_CONTAINER}>
                        <div className="max-w-2xl">
                            <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                                The <span className={`${EMPHASIS} whitespace-nowrap`}>AI-Native</span> Workspace
                            </h2>
                            <p className="mt-4 text-2xl text-gray-600 dark:text-gray-400">
                                Comps, rent surveys, and market trends in one place, so you spend less time in spreadsheets.
                            </p>
                        </div>
                        <div className="relative mt-12">
                            <AppPreview
                                initialPanel={page.appPreview.panel}
                                enableAutoCycle={false}
                                browserUrl={page.appPreview.browserUrl}
                                showRentAreaStats
                            />
                        </div>
                    </div>
                </section>

                <QuickStatsSection />

                <section className={SECTION_WHITE}>
                    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">FAQ</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                            Common questions from {page.label.toLowerCase()}
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

                <MarketDataStrip className={SECTION_GRAY} />

                <section className={SECTION_WHITE}>
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold tracking-[0.08em] text-gray-500 uppercase dark:text-gray-400">Also built for</p>
                        <nav aria-label="Other CRE roles" className="mt-4 flex flex-wrap gap-2.5">
                            {otherAudiences.map((other) => (
                                <Link
                                    key={other.slug}
                                    href={`/${other.slug}`}
                                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-900/40 hover:text-blue-900 dark:border-gray-800 dark:text-gray-300 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
                                >
                                    {other.label}
                                </Link>
                            ))}
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
