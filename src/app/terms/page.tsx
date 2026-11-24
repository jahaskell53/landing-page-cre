import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = buildPageMetadata({
    title: "Terms of Service | OpenMidmarket",
    description: "The terms that govern your use of OpenMidmarket's website, web application, and related services.",
    pathname: "/terms",
});

export default function TermsPage() {
    const markdown = readFileSync(join(process.cwd(), "src/content/terms-of-service.md"), "utf8");
    return <LegalPage markdown={markdown} />;
}
