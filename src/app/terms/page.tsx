import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
    title: "Terms of Service — OpenMidmarket",
    description: "The terms that govern your use of OpenMidmarket's website, web application, and related services.",
};

export default function TermsPage() {
    const markdown = readFileSync(join(process.cwd(), "src/content/terms-of-service.md"), "utf8");
    return <LegalPage markdown={markdown} />;
}
