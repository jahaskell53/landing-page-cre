"use client";

import type { ComponentProps } from "react";
import { captureLandingCtaClick, withReferralParams, type LandingCtaLocation } from "@/lib/tracking";

type TrackedLinkProps = ComponentProps<"a"> & {
    trackingLocation: LandingCtaLocation;
    audience?: string;
};

export function TrackedLink({ trackingLocation, audience, href, onClick, ...props }: TrackedLinkProps) {
    return (
        <a
            href={href}
            onClick={(event) => {
                if (href) {
                    const referralHref = withReferralParams(href);
                    event.currentTarget.href = referralHref;
                    captureLandingCtaClick(trackingLocation, referralHref, audience);
                }
                onClick?.(event);
            }}
            {...props}
        />
    );
}
