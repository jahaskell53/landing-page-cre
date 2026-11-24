import type { MetadataRoute } from "next";
import { AUDIENCE_SLUGS } from "@/lib/audience-pages";
import { SITE_ORIGIN } from "@/lib/organization";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const audienceEntries: MetadataRoute.Sitemap = AUDIENCE_SLUGS.map((slug) => ({
        url: `${SITE_ORIGIN}/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [
        {
            url: `${SITE_ORIGIN}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        ...audienceEntries,
        {
            url: `${SITE_ORIGIN}/privacy`,
            lastModified: new Date("2026-10-19"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_ORIGIN}/terms`,
            lastModified: new Date("2026-10-19"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_ORIGIN}/sms-opt-in`,
            lastModified: new Date("2026-10-24"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];
}
