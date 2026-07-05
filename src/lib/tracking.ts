import posthog from "posthog-js";
import { APP_ORIGIN } from "@/lib/app-origin";

export type LandingCtaLocation =
    | "header_login"
    | "header_signup"
    | "value_pillars_get_started"
    | "footer_get_started"
    | "audience_get_started";

const UTM_PARAM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function getUtmParams(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const search = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    for (const key of UTM_PARAM_KEYS) {
        const value = search.get(key);
        if (value) params[key] = value;
    }
    return params;
}

/** Fire a landing-page CTA click event. No-op when PostHog is not initialized. */
export function captureLandingCtaClick(location: LandingCtaLocation, href: string, audience?: string) {
    posthog.capture("landing_cta_clicked", {
        location,
        href,
        ...(audience ? { audience } : {}),
        ...getUtmParams(),
    });
}

/**
 * Append the visitor's UTM params to an outbound URL so campaign attribution
 * survives the handoff to Typeform or the app. Links into the app additionally
 * get PostHog's distinct_id, so app-side events can be joined back to this
 * landing-page session for a full visitor -> signup -> activation funnel.
 */
export function withReferralParams(href: string): string {
    if (typeof window === "undefined") return href;

    let url: URL;
    try {
        url = new URL(href);
    } catch {
        return href;
    }

    for (const [key, value] of Object.entries(getUtmParams())) {
        url.searchParams.set(key, value);
    }

    if (url.origin === new URL(APP_ORIGIN).origin) {
        const distinctId = posthog.get_distinct_id();
        if (distinctId) url.searchParams.set("ph_distinct_id", distinctId);
    }

    return url.toString();
}
