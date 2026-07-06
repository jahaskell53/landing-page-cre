import { ArrowRight, Brain, ChevronDown, TrendingUp, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { TrackedLink } from "@/components/tracking/tracked-link";
import { Button } from "@/components/ui/button";
import { APP_ORIGIN } from "@/lib/app-origin";
import { AppPreview } from "./welcome/app-preview";
import { AudienceCards } from "./welcome/audience-cards";
import { BrowserWindow } from "./welcome/browser-window";
import { HeroHighlight } from "./welcome/hero-highlight";
import { RentTrendsPreview } from "./welcome/rent-trends-preview";
import { getWelcomeRentTrends } from "./welcome/rent-trends-server";
import { SignupCta } from "./welcome/signup-cta";
import { getWelcomeSalesTrends } from "./welcome/sales-trends-server";
import { VideoPanel } from "./welcome/video-panel";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OpenMidmarket — Institutional-grade CRE platform. Built for the mid-market.",
  description:
    "A unified ecosystem leveraging predictive AI, real-time data, and a dedicated CRE professional network. Gain an edge with institutional power tailored for your speed.",
  openGraph: {
    title: "Institutional-grade CRE platform. Built for the mid-market.",
    description:
      "A unified ecosystem leveraging predictive AI, real-time data, and a dedicated CRE professional network. Gain an edge with institutional power tailored for your speed.",
    images: "/og-preview.jpeg",
  },
};

const PRIMARY =
  "bg-blue-900 text-white hover:bg-blue-950 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500";
const EMPHASIS = "font-semibold text-blue-900 dark:text-blue-400";

const SECTION_WHITE = "bg-white dark:bg-gray-950";
const SECTION_GRAY = "bg-gray-50 dark:bg-gray-900/40";
const SECTION_CONTAINER = "mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8";

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const NAV_LINKS: NavLink[] = [
  {
    label: "Features",
    href: "#features",
    children: [
      { label: "Holdings", href: "#preview-holdings" },
      { label: "Valuation", href: "#preview-valuation" },
      { label: "Rent Comps", href: "#preview-rent-comps" },
      { label: "Sales Comps", href: "#preview-sales-comps" },
      { label: "Rent Trends", href: "#preview-rent-trends" },
      { label: "Sales Trends", href: "#preview-sales-trends" },
      { label: "Listings", href: "#preview-listings" },
      { label: "Research", href: "#preview-research" },
      { label: "Network", href: "#preview-network" },
      { label: "News", href: "#preview-news" },
    ],
  },
  { label: "Property owners", href: "#owners" },
  { label: "CRE brokers", href: "#brokers" },
  { label: "CRE lenders", href: "#lenders" },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Property owners", href: "#owners" },
  { label: "CRE brokers", href: "#brokers" },
  { label: "CRE lenders", href: "#lenders" },
  { label: "Property managers", href: "#property-managers" },
  { label: "Appraisers", href: "#appraisers" },
  { label: "Insurance agents", href: "#insurance-agents" },
  { label: "1031 advisors", href: "#1031-advisors" },
];

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
    description:
      "Total number of physical commercial assets tracked by AI within the U.S. inventory core.",
  },
  {
    value: "$197B",
    label: "Traded Capital",
    description:
      "Total capital volume represented by mid-market transactions, accounting for roughly 35% of domestic deal volume.",
  },
  {
    value: "140K+",
    label: "Annual Transactions",
    description:
      "Continuous transactional liquidity happening strictly inside the mid-market commercial tier.",
  },
  {
    value: "85%",
    label: "Transactional Velocity",
    description:
      "The proportion of all annual U.S. commercial property trades by asset count driven consistently by mid-market transactions.",
  },
  {
    value: "1.5M+",
    label: "Unique Owners",
    description:
      "A highly fragmented network of operators, private LLCs, and family offices.",
  },
  {
    value: "120,000+",
    label: "Active Brokers",
    description:
      "Active mid-market specialized brokers seeking collaborative off-market deals.",
  },
  {
    value: "5,000",
    label: "Lenders",
    description:
      "Regional and institutional lenders supplying capital to mid-market debt.",
  },
  {
    value: "68%",
    label: "Fee Revenue Capture",
    description:
      "Total proportion of commercial brokerage fee revenue captured by regional boutique firms, independent brokerages, and localized operators.",
  },
];

export default async function HomePage() {
  const [initialRentResults, initialSalesResults] = await Promise.all([
    getWelcomeRentTrends(),
    getWelcomeSalesTrends(),
  ]);
  return (
    <div className="min-h-dvh bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <span className="flex size-6 items-center justify-center rounded bg-blue-900 text-[11px] font-bold text-white dark:bg-blue-600 dark:text-white">
              OM
            </span>
            OpenMidmarket
          </Link>
          <div className="hidden items-center gap-7 text-sm text-gray-600 lg:flex dark:text-gray-400">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="group relative">
                  <a
                    href={link.href}
                    className="flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    {link.label}
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                  </a>
                  <div className="invisible absolute top-full left-0 z-30 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    <div className="grid w-[26rem] grid-cols-2 gap-0.5 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                      {link.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <TrackedLink
                href={`${APP_ORIGIN}/login`}
                trackingLocation="header_login"
              >
                Log in
              </TrackedLink>
            </Button>
            <Button size="sm" className={PRIMARY} asChild>
              <SignupCta trackingLocation="header_signup" />
            </Button>
          </div>
        </nav>
      </header>

      <section className={SECTION_WHITE}>
        <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-4 sm:px-6 lg:px-8 lg:pt-16 lg:pb-5">
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-gray-900 sm:text-5xl sm:leading-[1.1] lg:text-6xl lg:leading-[1.1] dark:text-gray-100">
            <span className="mb-3 block">
              Institutional-grade CRE platform.
            </span>
            <span className="block">
              Built for the{" "}
              <HeroHighlight className="bg-blue-900 text-white dark:bg-blue-600 dark:text-white">
                mid-market.
              </HeroHighlight>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            A unified ecosystem leveraging{" "}
            <span className={EMPHASIS}>predictive AI</span>,{" "}
            <span className={EMPHASIS}>real-time data</span>, and a dedicated{" "}
            <span className={EMPHASIS}>CRE professional network</span>.{" "}
            <span className={EMPHASIS}>
              Gain an edge with institutional power tailored for your speed.
            </span>
          </p>
        </div>
      </section>

      <section className={SECTION_GRAY}>
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 pb-14 sm:px-6 lg:px-8 lg:pt-5 lg:pb-20">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-200 via-blue-100 to-transparent opacity-70 blur-2xl dark:from-blue-900/40 dark:via-blue-950/20 dark:opacity-40"
            />
            <BrowserWindow url="app.openmidmarket.com/analytics/rent-trends">
              <div className="bg-gray-50 p-6 dark:bg-gray-900/40">
                <RentTrendsPreview
                  initialRentResults={initialRentResults ?? undefined}
                />
              </div>
            </BrowserWindow>
          </div>
        </div>
      </section>

      <section className={SECTION_WHITE}>
        <div className={SECTION_CONTAINER}>
          <div className="grid gap-12 sm:grid-cols-3">
            {VALUE_PILLARS.map((pillar) => (
              <div key={pillar.title}>
                <pillar.icon className="size-8 text-blue-900 dark:text-blue-400" />
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button className={PRIMARY} asChild>
              <SignupCta trackingLocation="value_pillars_get_started" icon={<ArrowRight className="size-4" />} />
            </Button>
          </div>
        </div>
      </section>

      <section className={SECTION_GRAY}>
        <div className={SECTION_CONTAINER}>
          <p className="text-2xl font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
            Quick Stats
          </p>
          <dl className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="text-6xl font-semibold tracking-tight text-blue-900 dark:text-blue-400">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-base font-medium text-gray-900 dark:text-gray-100">
                  {stat.label}
                </dd>
                <dd className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {stat.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="features" className={SECTION_WHITE}>
        <div className={SECTION_CONTAINER}>
          <div className="max-w-2xl">
            <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              The AI-Native Workspace
            </h2>
            <p className="mt-4 text-2xl text-gray-600 dark:text-gray-400">
              Bring your tools, data, and workflows into a unified interface to
              accelerate your productivity.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <AppPreview
              initialRentResults={initialRentResults ?? undefined}
              initialSalesResults={initialSalesResults ?? undefined}
            />
          </div>
        </div>
      </section>

      <section id="audiences" className={SECTION_GRAY}>
        <div className={SECTION_CONTAINER}>
          <div className="max-w-5xl 2xl:max-w-6xl">
            <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Purpose-Built for Every Stakeholder
            </h2>
            <p className="mt-4 text-2xl text-gray-600 dark:text-gray-400">
              AI-tailored workflows for smarter execution
            </p>
          </div>
          <AudienceCards />
        </div>
      </section>

      <section className={SECTION_WHITE}>
        <div className={SECTION_CONTAINER}>
          <div className="max-w-3xl">
            <h2 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Fighting Unfair Regulation Through a Collective Midmarket Voice
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
              OpenMidmarket <span className={EMPHASIS}>pledges</span> ongoing
              capital and structural resources to{" "}
              <span className={EMPHASIS}>actively fight unfair regulation</span>{" "}
              and back balanced policy. Together, we give midmarket property
              owners the{" "}
              <span className={EMPHASIS}>
                collective institutional leverage
              </span>{" "}
              they need to thrive, <span className={EMPHASIS}>defend</span>{" "}
              their rights, and <span className={EMPHASIS}>protect</span> our
              investments long term.
            </p>
          </div>
        </div>
      </section>

      <VideoPanel
        videoSrc="/videos/sf-residential-aerial.mp4"
        posterSrc="/videos/sf-residential-aerial-poster.jpg"
        footer={
          <div className="space-y-6">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <p>© {new Date().getFullYear()} OpenMidmarket</p>
          </div>
        }
      >
        <div className="flex w-full flex-col items-start text-left">
          <h2 className="max-w-4xl text-left text-[clamp(1.125rem,4.8vw,6rem)] leading-[1.1] font-semibold tracking-tight text-white">
            <span className="block">Uncover opportunities</span>
            <span className="block">
              with{" "}
              <span className="text-blue-400">OpenMidmarket</span> AI
            </span>
          </h2>
          <div className="mt-10">
            <Button
              size="lg"
              className={`h-24 px-16 text-3xl ${PRIMARY}`}
              asChild
            >
              <SignupCta trackingLocation="footer_get_started" icon={<ArrowRight className="size-7" />} />
            </Button>
          </div>
        </div>
      </VideoPanel>
    </div>
  );
}
