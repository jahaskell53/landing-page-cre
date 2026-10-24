import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://www.openmidmarket.com",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: "https://www.openmidmarket.com/privacy",
            lastModified: new Date("2026-10-19"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: "https://www.openmidmarket.com/terms",
            lastModified: new Date("2026-10-19"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: "https://www.openmidmarket.com/sms-opt-in",
            lastModified: new Date("2026-10-24"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];
}
