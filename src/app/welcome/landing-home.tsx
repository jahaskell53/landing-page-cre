import { Brain, TrendingUp, Zap } from "lucide-react";
import type { Metadata } from "next";
import { AppPreview } from "./app-preview";
import { AudienceCards } from "./audience-cards";
import { HeroCopy } from "./hero-copy";
import { SignupCtaButton } from "./signup-cta";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { VideoPanel } from "./video-panel";

const LANDING_DESCRIPTION =
    "A unified ecosystem for mid-market multifamily: predictive AI, real-time data, rent comps, and a dedicated CRE professional network. Gain an edge with institutional power tailored for your speed.";

export const landingMetadata: Metadata = {
    title: "OpenMidmarket — Institutional-grade CRE platform. Multifamily rent comps for the mid-market.",
    description: LANDING_DESCRIPTION,
    openGraph: {
        title: "Institutional-grade CRE platform. Multifamily rent comps for the mid-market.",
        description: LANDING_DESCRIPTION,
        images: "/og-preview.jpeg",
    },
};

export const homepageMetadata: Metadata = {
    metadataBase: new URL("https://www.openmidmarket.com"),
    title: "OpenMidmarket | Multifamily Rent Comps & BOVs for Brokers",
    description: LANDING_DESCRIPTION,
    openGraph: {
        siteName: "OpenMidmarket",
        title: "OpenMidmarket — Institutional-grade CRE platform. Multifamily rent comps for the mid-market.",
        description: LANDING_DESCRIPTION,
        url: "https://www.openmidmarket.com/",
        images: "/og-preview.jpeg",
    },
};

const EMPHASIS = "font-semibold text-blue-900 dark:text-blue-400";

const SECTION_WHITE = "bg-white dark:bg-gray-950";
const SECTION_GRAY = "bg-gray-50 dark:bg-gray-900/40";
const SECTION_CONTAINER = "mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8";

const VALUE_PILLARS = [
    {
        icon: Brain,
        title: "Smarter Decisions",
        body: "Driven by AI predictive market intelligence and risk analytics.",
    },
    {
        icon: TrendingUp,
        title: "Superior Returns",
        body: "Unlock hidden opportunities with AI driven sourcing and qualification.",
    },
    {
        icon: Zap,
        title: "Improved Productivity",
        body: "Streamline workflows with AI unified data, analytics, and collaboration.",
    },
];

const STATS = [
    {
        value: "4.5M+",
        label: "Mid-Market Properties",
        description: "Total number of physical commercial assets tracked by AI within the U.S. inventory core.",
    },
    {
        value: "$197B",
        label: "Traded Capital",
        description: "Total capital volume represented by mid-market transactions, accounting for roughly 35% of domestic deal volume.",
    },
    {
        value: "140K+",
        label: "Annual Transactions",
        description: "Continuous transactional liquidity happening strictly inside the mid-market commercial tier.",
    },
    {
        value: "85%",
        label: "Transactional Velocity",
        description: "The proportion of all annual U.S. commercial property trades by asset count driven consistently by mid-market transactions.",
    },
    {
        value: "1.5M+",
        label: "Unique Owners",
        description: "A highly fragmented network of operators, private LLCs, and family offices.",
    },
    {
        value: "120,000+",
        label: "Active Brokers",
        description: "Active mid-market specialized brokers seeking collaborative off-market deals.",
    },
    {
        value: "5,000",
        label: "Lenders",
        description: "Regional and institutional lenders supplying capital to mid-market debt.",
    },
    {
        value: "68%",
        label: "Fee Revenue Capture",
        description:
            "Total proportion of commercial brokerage fee revenue captured by regional boutique firms, independent brokerages, and localized operators.",
    },
];

export function LandingHome({ showAudiences = true }: { showAudiences?: boolean }) {
    return (
        <div className="min-h-dvh bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <SiteHeader />

            <section className={SECTION_WHITE}>
                <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-4 sm:px-6 lg:px-8 lg:pt-16 lg:pb-5">
                    <HeroCopy />
                </div>
            </section>

            <section className={SECTION_GRAY}>
                <div className="mx-auto w-full max-w-6xl px-4 pt-4 pb-14 sm:px-6 lg:px-8 lg:pt-5 lg:pb-20">
                    <div className="relative">
                        <div
                            aria-hidden
                            className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-200 via-blue-100 to-transparent opacity-70 blur-2xl dark:from-blue-900/40 dark:via-blue-950/20 dark:opacity-40"
                        />
                        <AppPreview
                            initialPanel="rent-trends"
                            enableAutoCycle={false}
                            enableHashLinks={false}
                            browserUrl="app.openmidmarket.com/analytics/rent-trends"
                            showRentAreaStats
                        />
                    </div>
                </div>
            </section>

            <section className={SECTION_WHITE}>
                <div className={SECTION_CONTAINER}>
                    <div className="grid gap-12 sm:grid-cols-3">
                        {VALUE_PILLARS.map((pillar) => (
                            <div key={pillar.title}>
                                <pillar.icon className="size-8 text-blue-900 dark:text-blue-400" />
                                <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{pillar.title}</h3>
                                <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400">{pillar.body}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <SignupCtaButton trackingLocation="value_pillars_get_started" />
                    </div>
                </div>
            </section>

            <section className={SECTION_GRAY}>
                <div className={SECTION_CONTAINER}>
                    <p className="text-2xl font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">Quick Stats</p>
                    <dl className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                        {STATS.map((stat) => (
                            <div key={stat.label}>
                                <dt className="text-6xl font-semibold tracking-tight text-blue-900 dark:text-blue-400">{stat.value}</dt>
                                <dd className="mt-2 text-base font-medium text-gray-900 dark:text-gray-100">{stat.label}</dd>
                                <dd className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{stat.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section id="features" className={SECTION_WHITE}>
                <div className={SECTION_CONTAINER}>
                    <div className="max-w-2xl">
                        <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">The AI-Native Workspace</h2>
                        <p className="mt-4 text-2xl text-gray-600 dark:text-gray-400">
                            Bring your tools, data, and workflows into a unified interface to accelerate your productivity.
                        </p>
                    </div>
                    <div className="mx-auto mt-12 max-w-3xl">
                        <AppPreview />
                    </div>
                </div>
            </section>

            {showAudiences && (
                <section id="audiences" className={SECTION_GRAY}>
                    <div className={SECTION_CONTAINER}>
                        <div className="max-w-5xl 2xl:max-w-6xl">
                            <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Purpose-Built for Every Stakeholder</h2>
                            <p className="mt-4 text-2xl text-gray-600 dark:text-gray-400">AI-tailored workflows for smarter execution</p>
                        </div>
                        <AudienceCards />
                    </div>
                </section>
            )}

            <section className={SECTION_WHITE}>
                <div className={SECTION_CONTAINER}>
                    <div className="max-w-3xl">
                        <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                            Fighting Unfair Regulation Through a Collective Midmarket Voice
                        </h2>
                        <p className="mt-6 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
                            OpenMidmarket <span className={EMPHASIS}>pledges</span> ongoing capital and structural resources to{" "}
                            <span className={EMPHASIS}>actively fight unfair regulation</span> and back balanced policy. Together, we give midmarket property
                            owners the <span className={EMPHASIS}>collective institutional leverage</span> we need to <span className={EMPHASIS}>thrive</span>,{" "}
                            <span className={EMPHASIS}>defend our rights</span>, and <span className={EMPHASIS}>protect our investments</span> long term.
                        </p>
                    </div>
                </div>
            </section>

            <VideoPanel
                videoSrc="/videos/sf-residential-aerial.mp4"
                posterSrc="/videos/sf-residential-aerial-poster.jpg"
                footer={<SiteFooter variant="overlay" />}
            >
                <div className="flex w-full flex-col items-start text-left">
                    <h2 className="max-w-4xl text-left text-[clamp(1.125rem,4.8vw,6rem)] leading-[1.1] font-semibold tracking-tight text-white">
                        <span className="block">Uncover opportunities</span>
                        <span className="block">
                            with <span className="text-blue-400">OpenMidmarket</span> AI
                        </span>
                    </h2>
                    <div className="mt-10">
                        <SignupCtaButton trackingLocation="footer_get_started" />
                    </div>
                </div>
            </VideoPanel>
        </div>
    );
}
