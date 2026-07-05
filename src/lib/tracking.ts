import posthog from "posthog-js";

export type LandingCtaLocation =
    | "header_login"
    | "header_signup"
    | "value_pillars_get_started"
    | "footer_get_started"
    | "audience_get_started";

/** Fire a landing-page CTA click event. No-op when PostHog is not initialized. */
export function captureLandingCtaClick(location: LandingCtaLocation, href: string, audience?: string) {
    posthog.capture("landing_cta_clicked", {
        location,
        href,
        ...(audience ? { audience } : {}),
    });
}
