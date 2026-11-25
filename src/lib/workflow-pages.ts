/**
 * High-intent workflow and comparison landing pages (`/rent-comps`, `/bov`, `/costar-alternative`).
 *
 * Intentionally targets non-geo ICP search terms ("multifamily rent comps",
 * "multifamily BOV software", "CoStar alternative") in titles and H1s while
 * clearly stating live San Francisco Bay Area coverage in the body copy.
 */
import type { PreviewPanelId } from "@/app/welcome/preview-app-shell";
import type { AudienceFaq, ShowcaseStep } from "./audience-pages";
import type { HeroCopy } from "./hero-copy";
import { ORGANIZATION_ID, SITE_ORIGIN, WEBSITE_ID } from "./organization";
import { canonicalUrl, ORGANIZATION_NAME } from "./seo";

export const WORKFLOW_SLUGS = ["rent-comps", "bov", "costar-alternative"] as const;
export type WorkflowSlug = (typeof WORKFLOW_SLUGS)[number];

export type ComparisonRow = {
    dimension: string;
    openMidmarket: string;
    incumbent: string;
};

export type DeliverableItem = {
    title: string;
    body: string;
};

export type WorkflowPageConfig = {
    slug: WorkflowSlug;
    /** Short nav / breadcrumb label. */
    label: string;
    seo: {
        title: string;
        description: string;
    };
    hero: HeroCopy;
    coverageNote: string;
    showcase: {
        eyebrow: string;
        heading: string;
        steps: readonly ShowcaseStep[];
    };
    deliverables?: {
        eyebrow: string;
        heading: string;
        subtitle: string;
        items: readonly DeliverableItem[];
    };
    comparison?: {
        eyebrow: string;
        heading: string;
        subtitle: string;
        incumbentName: string;
        rows: readonly ComparisonRow[];
        honestNote: string;
    };
    appPreview: {
        panel: PreviewPanelId;
        browserUrl: string;
        heading: string;
        subtitle: string;
    };
    faqs: readonly AudienceFaq[];
    footerCta: {
        leadLine: string;
        brandPrefix: string;
    };
};

export const WORKFLOW_PAGES: Record<WorkflowSlug, WorkflowPageConfig> = {
    "rent-comps": {
        slug: "rent-comps",
        label: "Multifamily rent comps",
        seo: {
            title: "Multifamily Rent Comps & Rent Survey Software | OpenMidmarket",
            description:
                "Pull photo-scored multifamily rent comps and build apartment rent surveys in seconds. Compare condition, finishes, amenities, and export to Excel or PDF.",
        },
        hero: {
            lines: ["Multifamily rent comps scored by photos, not guesswork."],
            accent: "scored by photos",
            subtitle:
                "Drop in any apartment address to pull the top comparable units ranked on interior condition, finish quality, amenities, and block-level location, then export a client-ready rent survey in seconds.",
            italic: ["client-ready rent survey"],
        },
        coverageNote: "Live coverage across 580,000+ cleaned rental listings in the San Francisco Bay Area (SF, East Bay, Peninsula, and South Bay).",
        showcase: {
            eyebrow: "MULTIFAMILY RENT SURVEY WORKFLOW",
            heading: "From subject address to defensible rent survey",
            steps: [
                {
                    feature: "Photo-scored comps",
                    title: "Rank nearby apartment comps by actual interior condition and finishes",
                    body: "Stop opening 30 browser tabs to tell a renovated 1BR apart from an original-condition unit. Every comp is graded on condition, finish quality, amenities, and micro-location with photos attached.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Submarket trends",
                    title: "Pair building comps with weekly neighborhood rent curves",
                    body: "Check whether studio, 1BR, and 2BR asking rents in the surrounding neighborhood are accelerating or softening before you finalize pro-forma rent assumptions.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Rent upside",
                    title: "Turn comp spreads into underwriting conviction and owner pitches",
                    body: "Compare in-place rent rolls against vetted market rent estimates to quantify real loss-to-lease and value-add renovation upside across 5 to 100+ unit buildings.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "investor-alerts",
                },
            ],
        },
        deliverables: {
            eyebrow: "WHAT EVERY RENT SURVEY INCLUDES",
            heading: "Built for real underwriting workfiles and owner decks",
            subtitle: "Every search exports cleanly to Excel (.xlsx) and PDF with zero manual copy-pasting.",
            items: [
                {
                    title: "Standardized condition & quality grades",
                    body: "Transparent C/Q-style interior condition and finish-quality scores backed by written photo rationales you can audit immediately.",
                },
                {
                    title: "Inline cover photos in Excel & PDF",
                    body: "Export formatted rent comp tables with embedded listing thumbnails, addresses, distances, unit specs, and $/sqft ready for BOVs and IC memos.",
                },
                {
                    title: "Block-level location ranking",
                    body: "Account for street-by-street desirability instead of blindly averaging listings inside a wide radius.",
                },
                {
                    title: "Deduplicated unit history",
                    body: "Reposted listings are deduplicated per unit so asking medians and comp sets stay clean and unskewed.",
                },
            ],
        },
        appPreview: {
            panel: "rent-comps",
            browserUrl: "app.openmidmarket.com/analytics/rent-comps",
            heading: "See the rent comps workspace",
            subtitle: "Inspect side-by-side unit specs, photo grades, distances, and market rent ranges in one view.",
        },
        faqs: [
            {
                question: "How is OpenMidmarket different from generic rent-estimate websites?",
                answer: "Consumer rent tools average raw listings in a radius without distinguishing a gut-renovated unit with in-unit laundry from an untouched 1960s apartment. OpenMidmarket grades listing photos on interior condition, finishes, amenities, and block-level location so brokers and investors get an auditable comp set.",
            },
            {
                question: "Can I export multifamily rent comps to Excel and PDF?",
                answer: "Yes. Every rent comp run exports directly to structured Excel (.xlsx) workbooks with embedded cover photo thumbnails and clean PDF rent surveys ready to drop into a BOV, lender package, or investment committee memo.",
            },
            {
                question: "Which markets are covered today?",
                answer: "OpenMidmarket currently provides deep mid-market multifamily coverage across the San Francisco Bay Area, including San Francisco, Oakland, Berkeley, San Jose, San Mateo, Redwood City, Palo Alto, Mountain View, Sunnyvale, and surrounding Peninsula, East Bay, and South Bay cities.",
            },
            {
                question: "What apartment building sizes is this built for?",
                answer: "OpenMidmarket is purpose-built for mid-market 5 to 100+ unit multifamily properties, the exact segment where institutional tools often have thin coverage or enterprise-only pricing.",
            },
        ],
        footerCta: {
            leadLine: "Pull better rent comps",
            brandPrefix: "with",
        },
    },
    bov: {
        slug: "bov",
        label: "Multifamily BOV software",
        seo: {
            title: "Multifamily BOV Software & Broker Opinion of Value | OpenMidmarket",
            description:
                "Build defensible multifamily Broker Opinions of Value (BOVs) in minutes. Pull photo-scored rent comps, closed sales comps, cap rates, and Excel/PDF exports.",
        },
        hero: {
            lines: ["Build a multifamily BOV in minutes, not weeks."],
            accent: "minutes",
            subtitle:
                "Combine photo-scored rent comps, closed sales cap rates, and in-place vs. pro-forma rent upside in one workflow so you win more exclusive apartment listings.",
            italic: ["win more exclusive apartment listings"],
        },
        coverageNote: "Purpose-built for 5 to 100+ unit multifamily brokerages across the San Francisco Bay Area.",
        showcase: {
            eyebrow: "BROKER OPINION OF VALUE WORKFLOW",
            heading: "Every piece of a winning owner pitch, automated",
            steps: [
                {
                    feature: "Rent survey",
                    title: "Show owners exact market rent upside unit by unit",
                    body: "Drop in the subject address to pull the top photo-scored comparable apartments, grade finishes transparently, and prove loss-to-lease with zero spreadsheet wrangling.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Market trends",
                    title: "Back your pricing guidance with live submarket curves",
                    body: "Pair neighborhood rent trajectories with closed multifamily cap rates and $/door trends so owners see real street-level pricing instead of stale quarterly PDFs.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Buyer matching",
                    title: "Walk into the pitch knowing who the top likely buyers are",
                    body: "Surface active local multifamily buyers who have recently closed similar unit counts and vintages nearby, turning a static valuation into a concrete marketing plan.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "broker-alerts",
                },
            ],
        },
        deliverables: {
            eyebrow: "WHAT GOES INTO YOUR BOV",
            heading: "Institutional-grade valuation exhibits without analyst bottlenecks",
            subtitle: "Everything an apartment owner expects to see before signing an exclusive listing agreement.",
            items: [
                {
                    title: "Photo-backed rent comp grid",
                    body: "Clean Excel and PDF rent surveys complete with listing thumbnails, bedroom mix, square footage, condition grades, and market rent ranges.",
                },
                {
                    title: "Closed sales comps & cap rate trends",
                    body: "Benchmark $/door, reported cap rates, and quarterly transaction velocity across San Francisco, East Bay, Peninsula, and South Bay submarkets.",
                },
                {
                    title: "In-place vs. pro-forma valuation P&L",
                    body: "Model current NOI alongside stabilized market-rent upside and cap rate sensitivity to frame realistic pricing expectations.",
                },
                {
                    title: "Likely-buyer list by submarket",
                    body: "Connect your valuation directly to real local acquisition demand so owners trust your ability to execute.",
                },
            ],
        },
        appPreview: {
            panel: "sales-comps",
            browserUrl: "app.openmidmarket.com/analytics/sales-comps",
            heading: "Inspect closed sales comps and valuation metrics",
            subtitle: "Move seamlessly between closed multifamily trades, rent comps, and submarket trend charts.",
        },
        faqs: [
            {
                question: "What should a multifamily Broker Opinion of Value (BOV) include?",
                answer: "A strong multifamily BOV combines an executive pricing range, in-place vs. pro-forma NOI and cap rate sensitivity, a photo-backed rent survey proving loss-to-lease, recent closed comparable sales ($/door and cap rates), submarket rent trends, and a targeted buyer list.",
            },
            {
                question: "How fast can a broker generate a rent survey and valuation backup in OpenMidmarket?",
                answer: "Instead of spending hours scraping rental sites and formatting comp grids, you enter the subject address and unit mix to pull photo-scored comps, market rent estimates, and export-ready Excel and PDF exhibits in seconds.",
            },
            {
                question: "Can boutique and regional brokerages use OpenMidmarket without an enterprise CoStar seat?",
                answer: "Yes. OpenMidmarket is built specifically for mid-market multifamily teams handling 5 to 100+ unit buildings who want fast, defensible BOV data without paying enterprise multi-year contracts.",
            },
        ],
        footerCta: {
            leadLine: "Win your next listing pitch",
            brandPrefix: "with",
        },
    },
    "costar-alternative": {
        slug: "costar-alternative",
        label: "CoStar alternative",
        seo: {
            title: "CoStar Alternative for Mid-Market Multifamily | OpenMidmarket",
            description:
                "Looking for a CoStar alternative for 5-100 unit multifamily? Compare photo-scored rent comps, closed sales trends, BOV exports, and mid-market focus.",
        },
        hero: {
            lines: ["The CoStar alternative built for mid-market multifamily."],
            accent: "mid-market multifamily",
            subtitle:
                "Skip clunky enterprise bundles and manual comp digging. Get photo-scored apartment rent comps, closed sales trends, and instant BOV exports designed for 5 to 100+ unit deals.",
            italic: ["5 to 100+ unit deals"],
        },
        coverageNote: "Focused deeply on San Francisco Bay Area multifamily today, built for boutique brokers, private investors, and local owners.",
        showcase: {
            eyebrow: "WHY TEAMS SWITCH",
            heading: "Built around how apartment deals actually get underwritten",
            steps: [
                {
                    feature: "AI rent comps",
                    title: "Photo-scored unit comps instead of manual filtering",
                    body: "Traditional databases give you a raw list of buildings and leave you to click through every listing. OpenMidmarket scores interior photos, finishes, and micro-location automatically.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Live submarket data",
                    title: "Weekly neighborhood rent curves and closed $/door trends",
                    body: "Track street-level rent direction and closed multifamily cap rates in real time instead of waiting on lagging institutional quarterly summaries.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Deal & buyer alerts",
                    title: "Automated buy-box monitoring and buyer matching",
                    body: "Watch target cities, unit counts, and vintages 24/7 so you see mispriced listings and likely local buyers the moment a property hits the market.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "broker-alerts",
                },
            ],
        },
        comparison: {
            eyebrow: "SIDE-BY-SIDE COMPARISON",
            heading: "OpenMidmarket vs. CoStar for mid-market multifamily",
            subtitle: "An honest look at where a purpose-built multifamily platform wins, and where CoStar still fits.",
            incumbentName: "CoStar Suite",
            rows: [
                {
                    dimension: "Primary focus",
                    openMidmarket: "Purpose-built for mid-market 5-100+ unit multifamily brokers, investors, and owners.",
                    incumbent: "Broad enterprise database spanning office, retail, industrial, land, and institutional Class A.",
                },
                {
                    dimension: "Rent comp workflow",
                    openMidmarket: "AI grades listing photos on interior condition, finishes, amenities, and block-level location in seconds.",
                    incumbent: "Manual radius search and spreadsheet filtering; requires checking unit-level finish quality yourself.",
                },
                {
                    dimension: "BOV & underwriting exports",
                    openMidmarket: "One-click Excel (.xlsx) with embedded listing photos, PDF rent surveys, and rent-upside P&L.",
                    incumbent: "Generic property reports that usually need heavy reformatting before an owner pitch or IC memo.",
                },
                {
                    dimension: "Contracts & onboarding",
                    openMidmarket: "Built for agile boutique teams and independent investors with no multi-year enterprise lock-in.",
                    incumbent: "High per-seat annual contracts, strict licensing terms, and no self-serve trial.",
                },
                {
                    dimension: "Geographic coverage (honest take)",
                    openMidmarket: "Deep live coverage across the San Francisco Bay Area today; expanding region by region.",
                    incumbent: "Nationwide coverage across all US metros and commercial asset classes.",
                },
            ],
            honestNote:
                "If you need nationwide office, industrial, and retail lease comps tomorrow, CoStar is still the incumbent. If you broker, buy, or own 5-100 unit Bay Area apartments and want faster, photo-verified rent comps and BOVs without paying enterprise seat fees, OpenMidmarket is built directly for you.",
        },
        appPreview: {
            panel: "listings",
            browserUrl: "app.openmidmarket.com/analytics/listings",
            heading: "Explore the workspace yourself",
            subtitle: "Listings, closed sales comps, photo-scored rent comps, and submarket charts in one clean interface.",
        },
        faqs: [
            {
                question: "Can OpenMidmarket replace CoStar for a Bay Area multifamily team?",
                answer: "For day-to-day rent surveys, BOV preparation, value-add rent upside underwriting, submarket rent trends, and mid-market closed sales benchmarks across the Bay Area, yes. Teams using OpenMidmarket cut comp and BOV prep from hours to minutes.",
            },
            {
                question: "Why do smaller 5-50 unit apartment buildings struggle in legacy CRE databases?",
                answer: "Institutional platforms optimize around 100+ unit Class A properties that report directly to survey teams. Smaller mid-market apartments trade through private LLCs and list on public rental portals, which OpenMidmarket cleans, deduplicates, and photo-scores directly.",
            },
            {
                question: "Does OpenMidmarket cover markets outside the San Francisco Bay Area?",
                answer: "Today our live data is focused on the San Francisco Bay Area so our rent comps, neighborhood boundaries, and closed sales data stay unusually deep and accurate. Join the waitlist to request your metro as we expand.",
            },
        ],
        footerCta: {
            leadLine: "Upgrade your comps workflow",
            brandPrefix: "with",
        },
    },
};

export const WORKFLOW_PAGE_LIST: readonly WorkflowPageConfig[] = WORKFLOW_SLUGS.map((slug) => WORKFLOW_PAGES[slug]);

export function workflowPageJsonLd(page: WorkflowPageConfig): Record<string, unknown> {
    const url = canonicalUrl(`/${page.slug}`);
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: page.seo.title,
                description: page.seo.description,
                isPartOf: { "@id": WEBSITE_ID },
                publisher: { "@id": ORGANIZATION_ID },
            },
            {
                "@type": "SoftwareApplication",
                "@id": `${SITE_ORIGIN}/#application`,
                name: ORGANIZATION_NAME,
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url: SITE_ORIGIN,
                description: page.seo.description,
                publisher: { "@id": ORGANIZATION_ID },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: ORGANIZATION_NAME, item: `${SITE_ORIGIN}/` },
                    { "@type": "ListItem", position: 2, name: page.label, item: url },
                ],
            },
            {
                "@type": "FAQPage",
                url,
                mainEntity: page.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                    },
                })),
            },
        ],
    };
}
