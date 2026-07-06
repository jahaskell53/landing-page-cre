"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import { APP_ORIGIN } from "@/lib/app-origin";
import { captureLandingCtaClick, withReferralParams, type LandingCtaLocation } from "@/lib/tracking";

/**
 * Public early-access waitlist questionnaire (Typeform).
 *
 * Set `NEXT_PUBLIC_WAITLIST_URL` in the environment to override without a code change.
 */
const WAITLIST_URL = process.env.NEXT_PUBLIC_WAITLIST_URL ?? "https://form.typeform.com/to/bkrYqz2b";

function resolveHref(invite: string | null): string {
    // Invited visitors (VIPs / approved applicants) go straight to app signup with
    // their code carried through; everyone else goes to the public waitlist.
    if (invite) {
        return `${APP_ORIGIN}/signup?invite=${encodeURIComponent(invite)}`;
    }
    return WAITLIST_URL;
}

// Invited visitors already have access, so the CTA reads as an action they can
// complete now; everyone else is applying to a waitlist, not signing up outright.
function resolveLabel(invite: string | null): string {
    return invite ? "Get Started" : "Join Waitlist";
}

// The `?invite=` code is external browser state. `useSyncExternalStore` reads it
// without a hydration mismatch: `getServerSnapshot` (and the first client render)
// yields `null` so both SSR and hydration render the waitlist URL, then the store
// re-reads the real query string on the client. It never changes without a
// navigation, so `subscribe` is a no-op.
const subscribe = () => () => {};
const getInviteSnapshot = () => new URLSearchParams(window.location.search).get("invite");
const getServerInviteSnapshot = (): string | null => null;

/**
 * Invite-aware primary CTA link.
 *
 * Renders statically with the waitlist URL (the safe default for the broadcast
 * public), then upgrades on the client: if the visitor arrived with `?invite=CODE`
 * the link points at `${APP_ORIGIN}/signup?invite=CODE`. Reading the code from
 * `window.location` (instead of the server component's `searchParams`) keeps
 * `page.tsx` statically rendered / ISR-cached.
 *
 * Designed to be used as the child of `<Button asChild>` — `className` and other
 * props are forwarded to the underlying `<a>` by Radix's `Slot`.
 */
type SignupCtaProps = Omit<React.ComponentProps<"a">, "href" | "children"> & {
    trackingLocation?: LandingCtaLocation;
    audience?: string;
    icon?: React.ReactNode;
};

export function SignupCta({ trackingLocation, audience, onClick, icon, ...props }: SignupCtaProps) {
    const invite = useSyncExternalStore(subscribe, getInviteSnapshot, getServerInviteSnapshot);
    const href = resolveHref(invite);
    const label = resolveLabel(invite);

    return (
        <a
            href={href}
            onClick={(event) => {
                const referralHref = withReferralParams(href);
                event.currentTarget.href = referralHref;
                if (trackingLocation) {
                    captureLandingCtaClick(trackingLocation, referralHref, audience);
                }
                onClick?.(event);
            }}
            {...props}
        >
            {label}
            {icon}
        </a>
    );
}
