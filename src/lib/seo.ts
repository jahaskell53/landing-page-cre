import type { Metadata } from "next";
import type { AudiencePageConfig } from "./audience-pages";
import { ORGANIZATION_ID, ORGANIZATION_LOGO_URL, SITE_ORIGIN, WEBSITE_ID } from "./organization";

export const ORGANIZATION_NAME = "OpenMidmarket";
export const ALTERNATE_NAMES = ["Open Midmarket", "OpenMidmarket.com"] as const;

export const DEFAULT_OG_IMAGE = {
    url: "/og-preview.jpeg",
    width: 1200,
    height: 630,
    alt: "OpenMidmarket multifamily rent comps and CRE analytics platform",
} as const;

export const DEFAULT_LANDING_DESCRIPTION =
    "AI-powered multifamily rent comps, submarket rent trends, and deal alerts built for mid-market commercial real estate owners, brokers, and lenders.";

/** Absolute canonical URL on `www.openmidmarket.com`. Keeps `/` with trailing slash and subpaths without. */
export function canonicalUrl(pathname: string): string {
    if (pathname === "/" || pathname === "") return `${SITE_ORIGIN}/`;
    const normalized = pathname.startsWith("/") ? pathname.replace(/\/+$/, "") : `/${pathname.replace(/\/+$/, "")}`;
    return `${SITE_ORIGIN}${normalized}`;
}

export function buildPageMetadata(args: {
    title: string;
    description: string;
    pathname: string;
    ogTitle?: string;
    robots?: Metadata["robots"];
}): Metadata {
    const url = canonicalUrl(args.pathname);
    const socialTitle = args.ogTitle ?? args.title;
    return {
        title: args.title,
        description: args.description,
        alternates: {
            canonical: url,
        },
        robots: args.robots,
        openGraph: {
            siteName: ORGANIZATION_NAME,
            type: "website",
            url,
            title: socialTitle,
            description: args.description,
            images: [DEFAULT_OG_IMAGE],
        },
        twitter: {
            card: "summary_large_image",
            title: socialTitle,
            description: args.description,
            images: [DEFAULT_OG_IMAGE.url],
        },
    };
}

/**
 * Homepage JSON-LD graph: Organization + WebSite + SoftwareApplication.
 * Reuses `ORGANIZATION_ID` so Google merges `www.openmidmarket.com` with
 * `app.openmidmarket.com` public data pages into one publisher entity.
 */
export function homepageJsonLd(): Record<string, unknown> {
    // TODO: add Organization.sameAs once company social profiles exist.
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": ORGANIZATION_ID,
                name: ORGANIZATION_NAME,
                alternateName: [...ALTERNATE_NAMES],
                url: SITE_ORIGIN,
                logo: ORGANIZATION_LOGO_URL,
            },
            {
                "@type": "WebSite",
                "@id": WEBSITE_ID,
                name: ORGANIZATION_NAME,
                alternateName: [...ALTERNATE_NAMES],
                url: SITE_ORIGIN,
                publisher: { "@id": ORGANIZATION_ID },
            },
            {
                "@type": "SoftwareApplication",
                "@id": `${SITE_ORIGIN}/#application`,
                name: ORGANIZATION_NAME,
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url: SITE_ORIGIN,
                description: DEFAULT_LANDING_DESCRIPTION,
                publisher: { "@id": ORGANIZATION_ID },
            },
        ],
    };
}

/** Audience page JSON-LD graph: WebPage + BreadcrumbList + FAQPage matching visible content. */
export function audiencePageJsonLd(page: AudiencePageConfig): Record<string, unknown> {
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
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: ORGANIZATION_NAME,
                        item: `${SITE_ORIGIN}/`,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: page.label,
                        item: url,
                    },
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
