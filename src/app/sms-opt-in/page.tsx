import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = buildPageMetadata({
    title: "SMS Opt-In | OpenMidmarket",
    description:
        "How OpenMidmarket listing-alert SMS opt-in works: who we text, the web-form consent toggle, message type, sample texts, and how to opt out.",
    pathname: "/sms-opt-in",
});

export default function SmsOptInPage() {
    const markdown = readFileSync(join(process.cwd(), "src/content/sms-opt-in.md"), "utf8");
    return <LegalPage markdown={markdown} />;
}
