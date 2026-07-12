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
        // Resolve relative hrefs (e.g. the internal `/waitlist` form) against the
        // current origin so campaign UTMs are appended to same-origin links too.
        url = new URL(href, window.location.origin);
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

/**
 * Attribution metadata to persist alongside a waitlist submission: the visitor's
 * UTM params, the referring URL, the landing path they submitted from, and the
 * PostHog distinct_id so the row can be joined back to the analytics session.
 */
export function getWaitlistReferral(): Record<string, string> {
    if (typeof window === "undefined") return {};

    const payload: Record<string, string> = { ...getUtmParams() };

    if (document.referrer) payload.referrer = document.referrer;
    payload.path = window.location.pathname + window.location.search;

    const distinctId = posthog.get_distinct_id();
    if (distinctId) payload.ph_distinct_id = distinctId;

    return payload;
}

/** Fire the waitlist-submitted event and identify the user. No-op when PostHog is not initialized. */
export function captureWaitlistSubmitted(email: string, roles: string[]) {
    posthog.identify(email, { email });
    posthog.capture("waitlist_submitted", {
        roles,
        ...getUtmParams(),
    });
}

/** Fire when a visitor advances to the next waitlist step. */
export function captureWaitlistStepAdvanced(stepIndex: number, stepId: string, stepName: string, totalSteps: number) {
    posthog.capture("waitlist_step_advanced", {
        step_index: stepIndex,
        step_id: stepId,
        step_name: stepName,
        total_steps: totalSteps,
    });
}

/** Fire when a visitor explicitly selects an audience segment tab. */
export function captureAudienceTabSelected(audienceId: string, audienceTitle: string, tabIndex: number) {
    posthog.capture("audience_tab_selected", {
        audience_id: audienceId,
        audience_title: audienceTitle,
        tab_index: tabIndex,
    });
}
