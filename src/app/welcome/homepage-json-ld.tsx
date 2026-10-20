import { ORGANIZATION_ID, ORGANIZATION_LOGO_URL, SITE_ORIGIN, WEBSITE_ID } from "@/lib/organization";

const ORGANIZATION_NAME = "OpenMidmarket";
const ALTERNATE_NAMES = ["Open Midmarket", "OpenMidmarket.com"] as const;

export function HomepageJsonLd() {
    // TODO: add Organization.sameAs once company social profiles exist.
    // Missing from footer and repo: LinkedIn, X.
    const jsonLd = {
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
        ],
    };

    return (
        <>
            <link rel="canonical" href={`${SITE_ORIGIN}/`} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </>
    );
}
