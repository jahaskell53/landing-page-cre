import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AUDIENCE_SLUGS, getAudiencePage } from "@/lib/audience-pages";
import { audiencePageJsonLd, buildPageMetadata } from "@/lib/seo";
import { AudienceLanding } from "../welcome/audience-landing";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
    return AUDIENCE_SLUGS.map((audience) => ({ audience }));
}

export async function generateMetadata({ params }: { params: Promise<{ audience: string }> }): Promise<Metadata> {
    const { audience } = await params;
    const page = getAudiencePage(audience);
    if (!page) notFound();
    return buildPageMetadata({
        title: page.seo.title,
        description: page.seo.description,
        pathname: `/${page.slug}`,
    });
}

export default async function AudienceLandingPage({ params }: { params: Promise<{ audience: string }> }) {
    const { audience } = await params;
    const page = getAudiencePage(audience);
    if (!page) notFound();

    const jsonLd = audiencePageJsonLd(page);
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <AudienceLanding page={page} />
        </>
    );
}
