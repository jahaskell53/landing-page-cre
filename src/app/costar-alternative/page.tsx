import type { Metadata } from "next";
import { WorkflowLanding } from "@/app/welcome/workflow-landing";
import { buildPageMetadata } from "@/lib/seo";
import { WORKFLOW_PAGES, workflowPageJsonLd } from "@/lib/workflow-pages";

const page = WORKFLOW_PAGES["costar-alternative"];

export const metadata: Metadata = buildPageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    pathname: `/${page.slug}`,
});

export default function CoStarAlternativeLandingPage() {
    const jsonLd = workflowPageJsonLd(page);
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <WorkflowLanding page={page} />
        </>
    );
}
