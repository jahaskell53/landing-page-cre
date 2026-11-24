"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import posthog from "posthog-js";
import {
    HERO_COPY,
    HERO_COPY_TEST_FLAG,
    type HeroCopy,
    type HeroVariant,
    heroVariantToTag,
    hidesHomepageSections,
    parseHeroVariant,
    persistHeroVariant,
} from "@/lib/hero-copy";
import { isPostHogEnabled } from "@/lib/posthog-config";
import { cn } from "@/lib/utils";
import { decorateHeroSubtitle, HERO_HEADING_CLASS, renderHeroHeadline } from "./hero-block";
import { SignupCtaButton, SignupCtaOutlineButton } from "./signup-cta";

function heroAnalyticsProps(variant: HeroVariant) {
    const tag = heroVariantToTag(variant);
    return { hero_variant: variant, ...(tag ? { tag } : {}) };
}

type HeroVariantContextValue = {
    variant: HeroVariant;
};

const HeroVariantContext = createContext<HeroVariantContextValue>({ variant: "control" });

/**
 * Provides the active hero variant from server-resolved `searchParams` (`?tag=`),
 * falling back to the PostHog feature flag on the client only when no URL tag
 * was explicitly passed. This keeps SSR HTML clean (one H1, no hidden variants).
 */
export function HeroVariantProvider({
    initialVariant = "control",
    hasUrlOverride = false,
    children,
}: {
    initialVariant?: HeroVariant;
    hasUrlOverride?: boolean;
    children: ReactNode;
}) {
    const [flagVariant, setFlagVariant] = useState<HeroVariant | null>(null);

    useEffect(() => {
        if (hasUrlOverride) {
            persistHeroVariant(initialVariant);
            if (isPostHogEnabled) posthog.register(heroAnalyticsProps(initialVariant));
            return;
        }
        if (!isPostHogEnabled) return;

        const apply = () => {
            const value = parseHeroVariant(String(posthog.getFeatureFlag(HERO_COPY_TEST_FLAG) ?? ""));
            if (!value) return;
            setFlagVariant(value);
            persistHeroVariant(value);
            posthog.register(heroAnalyticsProps(value));
        };

        apply();
        return posthog.onFeatureFlags(apply);
    }, [hasUrlOverride, initialVariant]);

    const variant = hasUrlOverride ? initialVariant : (flagVariant ?? initialVariant);
    return <HeroVariantContext.Provider value={{ variant }}>{children}</HeroVariantContext.Provider>;
}

export function useHeroVariant(): HeroVariant {
    return useContext(HeroVariantContext).variant;
}

export function HeroCopy() {
    const variant = useHeroVariant();
    const copy: HeroCopy = HERO_COPY[variant];

    return (
        <>
            <h1 className={HERO_HEADING_CLASS}>{renderHeroHeadline(copy)}</h1>
            <p
                className={cn(
                    "mt-6 text-xl leading-relaxed text-gray-600 dark:text-gray-400",
                    variant === "leads" ? "max-w-5xl lg:whitespace-nowrap" : variant === "bov" || variant === "investor" ? "max-w-4xl" : "max-w-2xl",
                )}
            >
                {decorateHeroSubtitle(copy.subtitle, copy.emphasis, copy.italic)}
            </p>
            {variant === "leads" && (
                <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <SignupCtaButton trackingLocation="hero_join_waitlist" className="w-full sm:w-auto" />
                    <SignupCtaOutlineButton trackingLocation="hero_rent_survey" label="Get a rent survey for any building" className="w-full sm:w-auto" />
                </div>
            )}
        </>
    );
}

/** Hide homepage-only sections when the active hero variant is `bov`, `leads`, or `investor`. */
export function HideOnBovHero({ children }: { children: ReactNode }) {
    const variant = useHeroVariant();
    if (hidesHomepageSections(variant)) return null;
    return children;
}

export function HideOnLeadsHero({ children, as: Comp }: { children: ReactNode; as?: "div" | "span" }) {
    const variant = useHeroVariant();
    if (variant === "leads") return null;
    return Comp ? <Comp>{children}</Comp> : <>{children}</>;
}

export function LeadsOnly({ children, as: Comp }: { children: ReactNode; as?: "div" | "span" }) {
    const variant = useHeroVariant();
    if (variant !== "leads") return null;
    return Comp ? <Comp>{children}</Comp> : <>{children}</>;
}

/** Show on `?tag=broker` (bov) and `?tag=leads`. Hidden on the default homepage and `?tag=investor`. */
export function BrokerOrLeadsOnly({ children, as: Comp }: { children: ReactNode; as?: "div" | "span" }) {
    const variant = useHeroVariant();
    if (variant !== "bov" && variant !== "leads") return null;
    return Comp ? <Comp>{children}</Comp> : <>{children}</>;
}

/** Show on `?tag=investor`. Hidden on all other variants. */
export function InvestorOnly({ children, as: Comp }: { children: ReactNode; as?: "div" | "span" }) {
    const variant = useHeroVariant();
    if (variant !== "investor") return null;
    return Comp ? <Comp>{children}</Comp> : <>{children}</>;
}
