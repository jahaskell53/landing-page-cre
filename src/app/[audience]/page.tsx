import { notFound } from "next/navigation";
import { isAudienceSlug, AUDIENCE_SLUGS } from "../welcome/audience-routes";
import { LandingHome, landingMetadata } from "../welcome/landing-home";

export const revalidate = 3600;
export const metadata = landingMetadata;

export function generateStaticParams() {
    return AUDIENCE_SLUGS.map((audience) => ({ audience }));
}

export default async function AudienceLandingPage({ params }: { params: Promise<{ audience: string }> }) {
    const { audience } = await params;
    if (!isAudienceSlug(audience)) notFound();
    return <LandingHome showAudiences={false} />;
}
