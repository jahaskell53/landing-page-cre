import type { Metadata } from "next";
import { WaitlistForm } from "./waitlist-form";

export const metadata: Metadata = {
    title: "Join the waitlist — OpenMidmarket",
    description: "Apply for early access to OpenMidmarket, the institutional-grade CRE platform built for the mid-market.",
    // A questionnaire, not a page we want indexed or shared as a preview.
    robots: { index: false, follow: false },
};

export default function WaitlistPage() {
    return <WaitlistForm />;
}
