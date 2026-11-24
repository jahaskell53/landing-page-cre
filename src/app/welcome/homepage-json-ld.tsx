import { homepageJsonLd } from "@/lib/seo";

export function HomepageJsonLd() {
    const jsonLd = homepageJsonLd();
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
