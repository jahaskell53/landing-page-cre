import type { PreviewPanelId } from "@/app/welcome/preview-app-shell";
import type { HeroCopy } from "./hero-copy";

export const AUDIENCE_SLUGS = [
    "brokers",
    "investors",
    "owners",
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
    brokers: {
        slug: "brokers",
        label: "CRE brokers",
        cardHeadline: "Win more Bay Area listings. Close faster.",
        cardBody: "Build multifamily BOVs in seconds, show owners real rent upside, and match new listings with active Bay Area buyers.",
        seo: {
            title: "Bay Area Multifamily BOV & Rent Comps | OpenMidmarket",
            description:
                "Build Bay Area multifamily BOVs and rent surveys in seconds. Pull photo-scored rent comps, neighborhood rent trends, and likely-buyer listing alerts.",
        },
        hero: {
            lines: ["Build a BOV in seconds, not weeks."],
            accent: "seconds",
            subtitle:
                "Let AI pull Bay Area multifamily comps, run the rent upside, and surface likely buyers, so you can win listings and focus on the deal.",
            italic: ["AI", "deal"],
        },
        showcase: {
            eyebrow: "FOR BAY AREA MULTIFAMILY BROKERS",
            heading: "From first call to closed deal",
            steps: [
                {
                    feature: "Rent comps",
                    title: "Open the conversation with vetted rent comps for their building",
                    body: "Enter any San Francisco, Peninsula, South Bay, or East Bay address to pull nearby comps ranked by condition, quality, amenities, and block-level location, plus a client-ready Comps PDF.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Rent charts",
                    title: "Stay top of mind with live Bay Area submarket updates",
                    body: "Send neighborhood rent trends by bedroom size in PDF or Excel, or pull them up live during an owner pitch or pricing call.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Listing alerts",
                    title: "Match new listings with the buyers most likely to transact",
                    body: "Agents monitor your Bay Area submarkets for new 5–100 unit listings by price, unit count, or vintage, then name the local buyers most likely to want them based on past purchases.",
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
                question: "Can I export rent surveys directly into a Bay Area Broker Opinion of Value (BOV)?",
                answer: "Yes. Every rent comp run exports cleanly to branded PDF and Excel workbooks with listing photo thumbnails, condition and finish-quality grades, and side-by-side unit adjustments ready for owner pitches.",
            },
            {
                question: "Which Bay Area multifamily markets does OpenMidmarket cover?",
                answer: "OpenMidmarket covers mid-market 5 to 100+ unit multifamily across San Francisco, San Mateo County and the Peninsula, San Jose and Silicon Valley, and the East Bay including Oakland, Berkeley, Alameda, Fremont, and Hayward.",
            },
            {
                question: "How do broker listing alerts identify likely buyers?",
                answer: "When a multifamily listing hits your watched submarket, OpenMidmarket cross-references recent closed trades, nearby portfolio holdings, and unit-size preferences to surface active local buyers.",
            },
        ],
        footerCta: {
            leadLine: "Win your next listing",
            brandPrefix: "with",
        },
    },
    investors: {
        slug: "investors",
        label: "Multifamily investors",
        cardHeadline: "Underwrite Bay Area deals in seconds.",
        cardBody: "Quantify value-add rent upside, verify submarket trends, and catch mispriced 5–100 unit Bay Area apartments before the market does.",
        seo: {
            title: "Bay Area Multifamily Underwriting & Comps | OpenMidmarket",
            description:
                "Underwrite Bay Area multifamily acquisitions in seconds. Pull photo-scored rent comps, quantify value-add rent upside, and get buy-box deal alerts.",
        },
        hero: {
            lines: ["Underwrite deals in seconds, not weeks."],
            accent: "seconds",
            subtitle:
                "Let AI pull Bay Area rent comps, quantify the value-add upside, and stress-test returns, so you can bid with conviction before anyone else.",
            italic: ["AI", "conviction"],
        },
        showcase: {
            eyebrow: "FOR BAY AREA MULTIFAMILY INVESTORS",
            heading: "From first look to closed acquisition",
            steps: [
                {
                    feature: "Rent comps",
                    title: "Know the true rent upside before you bid",
                    body: "Drop in any Bay Area address to search 580,000+ rent comps and get an instant market rent estimate, with the top 5 comps scored on condition, finishes, amenities, and block-level location.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Market trends",
                    title: "Back every IC memo with live Bay Area submarket data",
                    body: "Track weekly rent movement and comp velocity across San Francisco, Peninsula, South Bay, and East Bay neighborhoods, then export clean PDF or Excel decks straight into your underwriting and LP updates.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Deal alerts",
                    title: "See mispriced multifamily deals before the market does",
                    body: "Agents monitor your target Bay Area submarkets 24/7 for new listings and price cuts matching your buy box, from unit count and vintage to basis per door and rent-upside spread.",
                    url: "app.openmidmarket.com/alerts",
                    mockup: "investor-alerts",
                },
            ],
        },
        appPreview: {
            panel: "listings",
            browserUrl: "app.openmidmarket.com/analytics/listings",
        },
        faqs: [
            {
                question: "How does OpenMidmarket quantify value-add rent upside on Bay Area multifamily deals?",
                answer: "Enter a subject property and unit mix to compare in-place rents against nearby active comps scored on interior condition, renovation finishes, amenities, and micro-location, giving you a defensible market rent range in seconds.",
            },
            {
                question: "What Bay Area multifamily asset sizes are supported?",
                answer: "OpenMidmarket is purpose-built for mid-market multifamily investors targeting 5 to 100+ unit buildings across San Francisco, the Peninsula, Silicon Valley, and the East Bay.",
            },
            {
                question: "Can I get alerted when undervalued listings hit my exact buy box?",
                answer: "Yes. Set watches by Bay Area city or neighborhood, price range, unit count, and vintage to get real-time alerts with offering memorandum summaries and rent-upside analysis.",
            },
        ],
        footerCta: {
            leadLine: "Bid with conviction",
            brandPrefix: "with",
        },
    },
    owners: {
        slug: "owners",
        label: "Property owners",
        cardHeadline: "Benchmark rents. Grow your portfolio.",
        cardBody: "Live Bay Area rent and sales comps, plus a network of local owners, so you can price renewals accurately and spot acquisitions.",
        seo: {
            title: "Bay Area Multifamily Rent Comps for Owners | OpenMidmarket",
            description:
                "Benchmark in-place rents and track Bay Area multifamily submarkets in seconds. Photo-scored rent comps, weekly rent trends, and local market alerts.",
        },
        hero: {
            lines: ["Know your building's true market rent in seconds."],
            accent: "seconds",
            subtitle:
                "Benchmark in-place rents against photo-scored Bay Area comps, track neighborhood trends, and spot nearby opportunities in one workspace.",
            italic: ["photo-scored"],
        },
        showcase: {
            eyebrow: "FOR BAY AREA PROPERTY OWNERS",
            heading: "From rent roll to portfolio growth",
            steps: [
                {
                    feature: "Rent comps",
                    title: "Compare every unit against photo-scored nearby comps",
                    body: "Drop in your building address to see top comparable units scored on interior condition, finishes, amenities, and block-level location before setting asking or renewal rents.",
                    url: "app.openmidmarket.com/analytics/rent-comps",
                    mockup: "rent-comps",
                },
                {
                    feature: "Market trends",
                    title: "Track neighborhood rent movement week by week",
                    body: "Watch studio, 1BR, and 2BR rent medians across San Francisco, Peninsula, South Bay, and East Bay neighborhoods so you never leave rent on the table.",
                    url: "app.openmidmarket.com/analytics/rent-trends",
                    mockup: "market-trends",
                },
                {
                    feature: "Deal alerts",
                    title: "See nearby multifamily trades and acquisitions early",
                    body: "Monitor new listings, asking price per door, and rent-upside spreads in the neighborhoods where you already own so you can expand your footprint first.",
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
                answer: "Enter your Bay Area property address and bedroom mix to pull nearby active rental comps scored on interior condition, finish quality, amenities, and block-level location, backed by listing photos.",
            },
            {
                question: "What property sizes is OpenMidmarket built for?",
                answer: "OpenMidmarket is built for mid-market multifamily owners operating 5 to 100+ unit buildings across the San Francisco Bay Area who want institutional-grade comps without enterprise subscriptions.",
            },
            {
                question: "Can I track submarket rent trends and nearby sales in one place?",
                answer: "Yes. Monitor weekly neighborhood rent trends by bedroom count, compare asking rents against your in-place rent roll, and receive automated alerts when comparable buildings list nearby.",
            },
        ],
        footerCta: {
            leadLine: "Uncover rent upside",
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
