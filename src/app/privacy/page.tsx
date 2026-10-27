import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
    title: "Privacy Policy - OpenMidmarket",
    description: "How OpenMidmarket collects, uses, and shares information when you use our website, web application, and related services.",
};

export default function PrivacyPage() {
    const markdown = readFileSync(join(process.cwd(), "src/content/privacy-policy.md"), "utf8");
    return <LegalPage markdown={markdown} />;
}
