"use client";

import type { ComponentProps } from "react";
import { captureLandingCtaClick, type LandingCtaLocation } from "@/lib/tracking";

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
                    captureLandingCtaClick(trackingLocation, href, audience);
                }
                onClick?.(event);
            }}
            {...props}
        />
    );
}
