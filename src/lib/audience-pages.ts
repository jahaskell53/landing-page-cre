import type { PreviewPanelId } from "@/app/welcome/preview-app-shell";
import type { HeroCopy } from "./hero-copy";

export const AUDIENCE_SLUGS = [
    "owners",
    "brokers",
    "lenders",
    "property-managers",
    "appraisers",
    "insurance-agents",
    "1031-advisors",
] as const;

export type AudienceSlug = (typeof AUDIENCE_SLUGS)[number];

export type ShowcaseMockupId = "rent-comps" | "market-trends" | "broker-alerts" | "investor-alerts";

export type ShowcaseStep = {
    feature: string;
    title: string;
    body: string;
    url: string;
    mockup: ShowcaseMockupId;
};

export type AudienceFaq = {
    question: string;
    answer: string;
};

export type AudiencePageConfig = {
    slug: AudienceSlug;
    /** Short nav / breadcrumb label, e.g. "CRE brokers". */
    label: string;
    /** Short homepage switcher card copy. */
    cardHeadline: string;
    cardBody: string;
    seo: {
        title: string;
        description: string;
    };
    hero: HeroCopy;
    showcase: {
        eyebrow: string;
        heading: string;
        steps: readonly ShowcaseStep[];
    };
    appPreview: {
        panel: PreviewPanelId;
        browserUrl: string;
    };
    faqs: readonly AudienceFaq[];
    footerCta: {
        leadLine: string;
        brandPrefix: string;
    };
};

export const AUDIENCE_PAGES: Record<AudienceSlug, AudiencePageConfig> = {
    owners: {
        slug: "owners",
        label: "Property owners",
        cardHeadline: "Smarter decisions. Better returns.",
        cardBody: "Real-time rent and sales data, plus a network of owners like you, so you can spot deals and grow your portfolio.",
        seo: {
            title: "Multifamily Rent Comps for Property Owners | OpenMidmarket",
            description:
                "Underwrite multifamily acquisitions and benchmark in-place rents in seconds. AI-scored rent comps, live submarket trends, and deal alerts for owners.",
        },
        hero: {
            lines: ["Underwrite deals in seconds, not weeks."],
            accent: "seconds",
            subtitle:
                "Let AI pull the comps, quantify the rent upside, and stress-test returns, so you can price renewals and bid with conviction.",
            italic: ["AI", "conviction"],
        },
        showcase: {
            eyebrow: "FOR MULTIFAMILY OWNERS & INVESTORS",
            heading: "From rent roll to closed acquisition",
            steps: [
                {
                    feature: "Rent comps",
                    title: "Know the true rent upside before you buy or renew",
                    body: "Drop in any address to search 580,000+ rent comps and get an instant market rent estimate, with the top 5 comps scored on condition, finishes, amenities, and block-level location.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Market trends",
                    title: "Back every underwriting model with live submarket data",
                    body: "Track rent growth, concessions, and comp velocity across neighborhoods, then export clean PDF or Excel decks straight into your underwriting and partner updates.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Deal alerts",
                    title: "See mispriced multifamily deals before the market does",
                    body: "Agents monitor your target submarkets 24/7 for new listings and price cuts matching your exact buy box, from unit count and vintage to basis and rent-upside spread.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "investor-alerts",
                },
            ],
        },
        appPreview: {
            panel: "holdings",
            browserUrl: "app.openmidmarket.com/holdings",
        },
        faqs: [
            {
                question: "How does OpenMidmarket calculate market rent for my building?",
                answer: "Enter a property address and bedroom mix to pull nearby active rental comps scored on interior condition, finish quality, amenities, and block-level location, producing a market rent range backed by photo evidence.",
            },
            {
                question: "What property sizes is OpenMidmarket built for?",
                answer: "OpenMidmarket is built specifically for mid-market multifamily owners and investors operating 5 to 100+ unit buildings who need institutional-grade comps without enterprise subscriptions.",
            },
            {
                question: "Can I track submarket rent trends and new listings in one place?",
                answer: "Yes. You can monitor weekly neighborhood rent trends by bedroom count, compare asking rents against in-place rent rolls, and receive automated alerts when new listings match your buy box.",
            },
        ],
        footerCta: {
            leadLine: "Uncover rent upside",
            brandPrefix: "with",
        },
    },
    brokers: {
        slug: "brokers",
        label: "CRE brokers",
        cardHeadline: "Close more deals. Earn more.",
        cardBody: "Underwrite faster, stay in touch with owners, and track your market, all in one place.",
        seo: {
            title: "Multifamily Rent Comps & BOVs for Brokers | OpenMidmarket",
            description:
                "Build multifamily BOVs and rent surveys in seconds. Pull AI-scored rent comps, live rent trends, and likely-buyer listing alerts built for CRE brokers.",
        },
        hero: {
            lines: ["Build a BOV in seconds, not weeks."],
            accent: "seconds",
            subtitle: "Let AI pull the comps and run the numbers, so you can win listings and focus on the deal.",
            italic: ["AI", "deal"],
        },
        showcase: {
            eyebrow: "FOR CRE BROKERS",
            heading: "From first call to closed deal",
            steps: [
                {
                    feature: "Rent comps",
                    title: "Open the conversation with vetted rent comps for their building",
                    body: "Enter an address to pull nearby comps ranked by condition, quality, amenities, and location, plus a market rent estimate and a client-ready Comps PDF.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Rent charts",
                    title: "Stay top of mind with live submarket updates",
                    body: "Send rent trends by neighborhood and unit type in PDF or Excel, or pull them up live during an owner pitch or pricing call.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Listing alerts",
                    title: "Match new listings with the buyers most likely to transact",
                    body: "Agents monitor your submarkets for new listings that fit a price range, unit count, or vintage, then surface the buyers most likely to want them based on past purchases.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "broker-alerts",
                },
            ],
        },
        appPreview: {
            panel: "listings",
            browserUrl: "app.openmidmarket.com/analytics/listings",
        },
        faqs: [
            {
                question: "Can I export rent surveys directly into a Broker Opinion of Value (BOV)?",
                answer: "Yes. Every rent comp run exports cleanly to branded PDF and Excel workbooks with photo thumbnails, condition and quality scores, and side-by-side unit adjustments ready for owner decks.",
            },
            {
                question: "How do broker listing alerts identify likely buyers?",
                answer: "When a multifamily listing hits your watched submarket, OpenMidmarket cross-references recent closed trades, portfolio footprints, and unit-size preferences to highlight nearby owners and repeat buyers.",
            },
            {
                question: "How fresh is the rental and sales comp data?",
                answer: "Rental listings are scraped and deduplicated continuously on a rolling 90-day window so BOVs reflect live asking rents rather than stale quarterly averages.",
            },
        ],
        footerCta: {
            leadLine: "Win your next listing",
            brandPrefix: "with",
        },
    },
    lenders: {
        slug: "lenders",
        label: "CRE lenders",
        cardHeadline: "Close loans faster.",
        cardBody: "Underwrite deals quickly with live market data and keep your pipeline moving.",
        seo: {
            title: "Multifamily Underwriting Data for Lenders | OpenMidmarket",
            description:
                "Verify sponsor rent rolls and underwrite mid-market multifamily loans faster with AI-scored rent comps, submarket rent trends, and closed sales data.",
        },
        hero: {
            lines: ["Underwrite multifamily loans in minutes, not days."],
            accent: "minutes",
            subtitle:
                "Verify sponsor rent rolls with AI-scored comps, live submarket trends, and local sales data, so you can size debt with conviction.",
            italic: ["AI", "conviction"],
        },
        showcase: {
            eyebrow: "FOR CRE LENDERS",
            heading: "From term sheet to credit committee",
            steps: [
                {
                    feature: "Rent comps",
                    title: "Stress-test sponsor rent projections against real comps",
                    body: "Check whether pro-forma rents hold up block by block. Pull top nearby comps scored on interior finishes, condition, and amenities in seconds.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Market trends",
                    title: "Track submarket rent direction and velocity in real time",
                    body: "Bring live neighborhood rent charts by bedroom size straight into credit memos instead of waiting on lagging third-party market reports.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Deal alerts",
                    title: "Spot active multifamily trade flow across your lending footprint",
                    body: "Monitor new listings, asking cap rates, and basis per door across your target submarkets so originators reach sponsors early in the process.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "investor-alerts",
                },
            ],
        },
        appPreview: {
            panel: "sales-comps",
            browserUrl: "app.openmidmarket.com/analytics/sales-comps",
        },
        faqs: [
            {
                question: "How do multifamily lenders use OpenMidmarket during underwriting?",
                answer: "Debt originators and credit analysts use OpenMidmarket to independently verify sponsor market-rent assumptions, check neighborhood rent trends, and benchmark basis per door before quoting proceeds.",
            },
            {
                question: "Can credit teams export comp evidence for loan files?",
                answer: "Yes. Rent comp packets and submarket trend charts export to PDF and Excel with listing photos, distances, and transparent condition/quality scoring for credit committee memos.",
            },
            {
                question: "Does OpenMidmarket cover smaller mid-market multifamily assets?",
                answer: "Yes. Unlike institutional tools focused mainly on 100+ unit Class A towers, OpenMidmarket tracks mid-market 5 to 100 unit buildings across neighborhood submarkets.",
            },
        ],
        footerCta: {
            leadLine: "Close loans faster",
            brandPrefix: "with",
        },
    },
    "property-managers": {
        slug: "property-managers",
        label: "Property managers",
        cardHeadline: "Run leaner. Win more doors.",
        cardBody: "Automate owner reports and track your market so you can take on more properties.",
        seo: {
            title: "Rent Comps & Reports for Property Managers | OpenMidmarket",
            description:
                "Price apartment renewals accurately and automate owner market reports. Pull AI-scored rent comps and neighborhood rent trends in seconds.",
        },
        hero: {
            lines: ["Price every unit with live market comps."],
            accent: "live market comps",
            subtitle: "Pull vetted rent comps and export clean owner reports in seconds, so your team runs leaner and wins more doors.",
            italic: ["seconds"],
        },
        showcase: {
            eyebrow: "FOR PROPERTY MANAGERS",
            heading: "From pricing renewals to winning new owners",
            steps: [
                {
                    feature: "Rent comps",
                    title: "Back every renewal and lease-up price with photo-scored comps",
                    body: "Stop manually scraping listings before every turn. Pull the closest same-bedroom comps ranked by finishes, condition, and amenities with a clear market rent range.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Market updates",
                    title: "Automate monthly submarket updates for property owners",
                    body: "Send owners clean neighborhood rent trend charts by bedroom size so they see real-time market movement before approving renewals or CapEx.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Listing alerts",
                    title: "Track buildings trading hands in your management territory",
                    body: "Know immediately when multifamily properties list or trade in your service area so you can pitch incoming owners before they hire another manager.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "broker-alerts",
                },
            ],
        },
        appPreview: {
            panel: "rent-comps",
            browserUrl: "app.openmidmarket.com/analytics/rent-comps",
        },
        faqs: [
            {
                question: "How does OpenMidmarket help property managers reduce vacancy?",
                answer: "By comparing each turning unit against photo-scored nearby comps of matching finish quality and bedroom count, teams price units accurately on day one instead of sitting on the market.",
            },
            {
                question: "Can we share rent surveys directly with our property owners?",
                answer: "Yes. Every rent survey exports to a clean PDF or Excel sheet showing subject specs, comparable units, photos, and market-rent rationale.",
            },
            {
                question: "How can property management firms use listing alerts to grow doors?",
                answer: "Alerts surface multifamily buildings coming to market in your footprint along with likely buyers, helping business development teams build relationships with new owners early.",
            },
        ],
        footerCta: {
            leadLine: "Win more doors",
            brandPrefix: "with",
        },
    },
    appraisers: {
        slug: "appraisers",
        label: "Appraisers",
        cardHeadline: "Faster, more accurate valuations.",
        cardBody: "Pull and check comps in minutes instead of hours.",
        seo: {
            title: "CRE Rent & Sales Comps for Appraisers | OpenMidmarket",
            description:
                "Pull verifiable multifamily rent comps and sales comps in minutes. Compare condition, finish quality, and block-level location with full photo evidence.",
        },
        hero: {
            lines: ["Verify rent and sales comps in minutes."],
            accent: "minutes",
            subtitle:
                "Score nearby buildings on condition, quality, and location with photo-backed rationales, then export straight to your workfile.",
            italic: ["photo-backed"],
        },
        showcase: {
            eyebrow: "FOR CRE APPRAISERS",
            heading: "From subject address to defensible comps",
            steps: [
                {
                    feature: "Rent comps",
                    title: "Compare condition, quality, and location with transparent grades",
                    body: "Every comp is graded on C/Q-style interior condition, finish quality, and micro-location with written rationales and unit photos you can inspect immediately.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Market trends",
                    title: "Document submarket rent trajectories by bedroom and neighborhood",
                    body: "Pull rolling median rent and price-per-square-foot curves across exact neighborhood boundaries to support market-conditions adjustments.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Market activity",
                    title: "Stay current on active listings and pricing shifts in your territory",
                    body: "Monitor asking rents, concessions, and multifamily listings in real time so every valuation reflects current street-level pricing.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "investor-alerts",
                },
            ],
        },
        appPreview: {
            panel: "rent-comps",
            browserUrl: "app.openmidmarket.com/analytics/rent-comps",
        },
        faqs: [
            {
                question: "How are comparable rental units graded?",
                answer: "OpenMidmarket scores listing photos and descriptions on standardized condition and quality scales alongside block-level location rank, giving appraisers transparent criteria rather than a black-box number.",
            },
            {
                question: "Can I export comps to Excel for my appraisal workfile?",
                answer: "Yes. Every rent comp search exports to structured Excel spreadsheets and PDF summaries complete with addresses, unit specs, distances, asking rents, and cover photos.",
            },
            {
                question: "How are duplicate rental listings handled?",
                answer: "Listings are cleaned and deduplicated per unit over rolling windows so median rents and comp sets aren't skewed by reposted units.",
            },
        ],
        footerCta: {
            leadLine: "Defend every valuation",
            brandPrefix: "with",
        },
    },
    "insurance-agents": {
        slug: "insurance-agents",
        label: "Insurance agents",
        cardHeadline: "Quote faster. Bind with confidence.",
        cardBody: "Get property details and local risk data without the manual digging.",
        seo: {
            title: "Multifamily Property Data for Insurance | OpenMidmarket",
            description:
                "Quote multifamily commercial property insurance faster with unit counts, vintage, market rent estimates, and active acquisition alerts.",
        },
        hero: {
            lines: ["Quote multifamily policies without the digging."],
            accent: "without the digging",
            subtitle:
                "Pull building specs, unit counts, market rent values, and active acquisition alerts in one workspace, so you quote and bind first.",
            italic: ["one workspace"],
        },
        showcase: {
            eyebrow: "FOR CRE INSURANCE AGENTS",
            heading: "From new acquisition to bound policy",
            steps: [
                {
                    feature: "Loss-of-rents data",
                    title: "Verify loss-of-rents exposure with real market rent estimates",
                    body: "Pull current market rent ranges by bedroom mix and neighborhood in seconds so business-income and loss-of-rents limits reflect today's replacement income.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Submarket trends",
                    title: "Monitor rental market shifts across the submarkets you insure",
                    body: "Track neighborhood rent movement at renewal time so clients aren't underinsured after years of rent growth.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Listing alerts",
                    title: "Spot multifamily trades early and connect with active buyers",
                    body: "Get alerted when mid-market buildings hit the market with unit counts, year built, and likely local buyers so you're quoting before closing.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "broker-alerts",
                },
            ],
        },
        appPreview: {
            panel: "listings",
            browserUrl: "app.openmidmarket.com/analytics/listings",
        },
        faqs: [
            {
                question: "Why do commercial insurance producers use OpenMidmarket?",
                answer: "Producers use OpenMidmarket to quickly verify building vintage, unit counts, and current market rent exposure for loss-of-rents coverage, while tracking active multifamily deals in their territory.",
            },
            {
                question: "How do listing alerts help win new habitational accounts?",
                answer: "Alerts highlight multifamily properties coming up for sale along with likely active buyers in that submarket, giving insurance brokers a warm, well-timed reason to reach out before bind deadlines.",
            },
            {
                question: "Does OpenMidmarket track mid-market apartment buildings?",
                answer: "Yes. Coverage focuses on mid-market multifamily buildings — the exact habitational accounts handled by independent agencies and regional CRE brokers.",
            },
        ],
        footerCta: {
            leadLine: "Quote and bind faster",
            brandPrefix: "with",
        },
    },
    "1031-advisors": {
        slug: "1031-advisors",
        label: "1031 advisors",
        cardHeadline: "Beat the 45-day clock.",
        cardBody: "Find eligible replacement properties fast and stay on top of every deadline.",
        seo: {
            title: "Multifamily 1031 Exchange Sourcing Tools | OpenMidmarket",
            description:
                "Beat the 45-day 1031 exchange clock. Monitor mid-market multifamily listings, verify rent upside in seconds, and match exchangers with replacement assets.",
        },
        hero: {
            lines: ["Beat the 45-day 1031 exchange clock."],
            accent: "45-day",
            subtitle:
                "Monitor replacement multifamily inventory in real time and underwrite rent upside in seconds, so exchangers never scramble on day 44.",
            italic: ["seconds"],
        },
        showcase: {
            eyebrow: "FOR 1031 EXCHANGE ADVISORS",
            heading: "From relinquished sale to identified replacement",
            steps: [
                {
                    feature: "Deal alerts",
                    title: "Get instant alerts when replacement buildings match client criteria",
                    body: "Set watches by submarket, price range, unit count, and vintage so every eligible multifamily replacement property hits your desk the moment it lists.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "investor-alerts",
                },
                {
                    feature: "Rent comps",
                    title: "Validate replacement-property rent upside in seconds",
                    body: "Compare asking cap rates and in-place rent rolls against AI-scored nearby comps so clients identify properties with real cash-flow upside.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Market trends",
                    title: "Compare submarket rent stability across target cities",
                    body: "Put side-by-side neighborhood rent trends in front of exchanging owners comparing multiple Bay Area submarkets during their 45-day window.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
            ],
        },
        appPreview: {
            panel: "listings",
            browserUrl: "app.openmidmarket.com/analytics/listings",
        },
        faqs: [
            {
                question: "How does OpenMidmarket help during a 45-day 1031 identification period?",
                answer: "Automated deal alerts watch target price ranges, unit counts, and submarkets 24/7 while instant AI rent comps let advisors vet replacement options in minutes instead of days.",
            },
            {
                question: "Can I compare multiple candidate replacement properties for a client?",
                answer: "Yes. Run rent comps and submarket trend comparisons on each candidate building and export clean PDF or Excel packets so exchanging owners can pick their top three identifications with confidence.",
            },
            {
                question: "What asset types are covered?",
                answer: "OpenMidmarket focuses on mid-market multifamily properties, combining active listings, closed sales comps, and 580,000+ cleaned rental comps.",
            },
        ],
        footerCta: {
            leadLine: "Close every exchange",
            brandPrefix: "with",
        },
    },
};

export const AUDIENCE_PAGE_LIST: readonly AudiencePageConfig[] = AUDIENCE_SLUGS.map((slug) => AUDIENCE_PAGES[slug]);

export function isAudienceSlug(value: string): value is AudienceSlug {
    return (AUDIENCE_SLUGS as readonly string[]).includes(value);
}

export function getAudiencePage(slug: string): AudiencePageConfig | null {
    return isAudienceSlug(slug) ? AUDIENCE_PAGES[slug] : null;
}
