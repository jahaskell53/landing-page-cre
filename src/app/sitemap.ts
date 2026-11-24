import type { MetadataRoute } from "next";
import { AUDIENCE_SLUGS } from "@/lib/audience-pages";
import { MARKET_SLUGS, marketPath } from "@/lib/markets/catalog";
import { SITE_ORIGIN } from "@/lib/organization";
import { WORKFLOW_SLUGS } from "@/lib/workflow-pages";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const workflowEntries: MetadataRoute.Sitemap = WORKFLOW_SLUGS.map((slug) => ({
        url: `${SITE_ORIGIN}/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
    }));
    const marketEntries: MetadataRoute.Sitemap = MARKET_SLUGS.map((slug) => ({
        url: `${SITE_ORIGIN}${marketPath(slug)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
    }));
    const audienceEntries: MetadataRoute.Sitemap = AUDIENCE_SLUGS.map((slug) => ({
        url: `${SITE_ORIGIN}/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: slug === "brokers" || slug === "investors" ? 0.9 : 0.75,
    }));

    return [
        {
            url: `${SITE_ORIGIN}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        ...workflowEntries,
        {
            url: `${SITE_ORIGIN}/markets`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...marketEntries,
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
