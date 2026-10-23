"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import posthog from "posthog-js";
import { isPostHogEnabled } from "@/lib/posthog-config";
import { cn } from "@/lib/utils";
import { HeroHighlight } from "./hero-highlight";
import { SignupCtaButton, SignupCtaOutlineButton } from "./signup-cta";
import {
    HERO_COPY,
    HERO_COPY_TEST_FLAG,
    LEADS_HIDE_CLASS,
    LEADS_SHOW_CLASS,
    TAGGED_SHOW_CLASS,
    STACKED_HERO_VARIANT_KEYS,
    type HeroCopy,
    type HeroVariant,
    heroVariantToTag,
    hidesHomepageSections,
    parseHeroVariant,
    persistHeroVariant,
    readHeroOverride,
} from "@/lib/hero-copy";

function heroAnalyticsProps(variant: HeroVariant) {
    const tag = heroVariantToTag(variant);
    return { hero_variant: variant, ...(tag ? { tag } : {}) };
}

const EMPHASIS = "font-semibold text-blue-900 dark:text-blue-400";
const HIGHLIGHT_CLASS = "bg-blue-900 text-white dark:bg-blue-600 dark:text-white";
const HERO_HEADING_CLASS =
    "text-4xl leading-[1.1] font-semibold tracking-tight text-gray-900 sm:text-5xl sm:leading-[1.1] lg:text-6xl lg:leading-[1.1] dark:text-gray-100";
const subscribe = () => () => {};

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function withEmphasis(text: string, phrases: readonly string[] = []): ReactNode {
    if (phrases.length === 0) return text;
    const pattern = new RegExp(`(${phrases.map(escapeRegExp).join("|")})`, "g");
    return text.split(pattern).map((part, index) =>
        phrases.includes(part) ? (
            <span key={index} className={EMPHASIS}>
                {part}
            </span>
        ) : (
            part
        ),
    );
}

function renderHeadline(copy: HeroCopy): ReactNode {
    return copy.lines.map((line, index) => {
        let content: ReactNode = line;
        if (copy.highlight && line.includes(copy.highlight)) {
            const before = line.slice(0, line.indexOf(copy.highlight));
            content = (
                <>
                    {before}
                    <HeroHighlight className={HIGHLIGHT_CLASS}>{copy.highlight}</HeroHighlight>
                </>
            );
        } else if (copy.accent && line.includes(copy.accent)) {
            const start = line.indexOf(copy.accent);
            content = (
                <>
                    {line.slice(0, start)}
                    <span className={EMPHASIS}>{copy.accent}</span>
                    {line.slice(start + copy.accent.length)}
                </>
            );
        }
        return (
            <span key={line} className={index === 0 && copy.lines.length > 1 ? "mb-3 block" : "block"}>
                {content}
            </span>
        );
    });
}

export function useHeroVariant(): HeroVariant {
    const override = useSyncExternalStore(subscribe, readHeroOverride, (): HeroVariant | null => null);
    const [flagVariant, setFlagVariant] = useState<HeroVariant | null>(null);

    useEffect(() => {
        if (override) {
            persistHeroVariant(override);
            if (isPostHogEnabled) posthog.register(heroAnalyticsProps(override));
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
    }, [override]);

    return override ?? flagVariant ?? "control";
}

function HeroVariantView({ variant }: { variant: HeroVariant }) {
    const copy: HeroCopy = HERO_COPY[variant];
    const Heading = variant === "control" ? "h1" : "h2";
    return (
        <>
            <Heading className={HERO_HEADING_CLASS}>{renderHeadline(copy)}</Heading>
            <p
                className={cn(
                    "mt-6 text-xl leading-relaxed text-gray-600 dark:text-gray-400",
                    variant === "leads" ? "max-w-5xl lg:whitespace-nowrap" : variant === "bov" ? "max-w-4xl" : "max-w-2xl",
                )}
            >
                {withEmphasis(copy.subtitle, copy.emphasis)}
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

export function HeroCopy() {
    const variant = useHeroVariant();
    const override = useSyncExternalStore(subscribe, readHeroOverride, (): HeroVariant | null => null);

    return (
        <>
            <HideOnLeadsHero>
                <div className="grid">
                    {STACKED_HERO_VARIANT_KEYS.map((key) => (
                        <div
                            key={key}
                            className={cn("col-start-1 row-start-1", key !== variant && (override ? "hidden" : "invisible"))}
                            aria-hidden={key !== variant}
                        >
                            <HeroVariantView variant={key} />
                        </div>
                    ))}
                </div>
            </HideOnLeadsHero>
            <LeadsOnly>
                <HeroVariantView variant="leads" />
            </LeadsOnly>
        </>
    );
}

/** Hide homepage-only sections when the resolved hero variant is `bov` or `leads`. */
export function HideOnBovHero({ children }: { children: ReactNode }) {
    const variant = useHeroVariant();
    if (hidesHomepageSections(variant)) return null;
    return children;
}

export function HideOnLeadsHero({ children, as: Comp = "div" }: { children: ReactNode; as?: "div" | "span" }) {
    const variant = useHeroVariant();
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);
    if (mounted && variant === "leads") return null;
    return <Comp className={LEADS_HIDE_CLASS}>{children}</Comp>;
}

export function LeadsOnly({ children, as: Comp = "div" }: { children: ReactNode; as?: "div" | "span" }) {
    const variant = useHeroVariant();
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);
    if (mounted && variant !== "leads") return null;
    return <Comp className={LEADS_SHOW_CLASS}>{children}</Comp>;
}

/** Show on `?tag=broker` (bov) and `?tag=leads`. Hidden on the default homepage. */
export function BrokerOrLeadsOnly({ children, as: Comp = "div" }: { children: ReactNode; as?: "div" | "span" }) {
    const variant = useHeroVariant();
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);
    if (mounted && !hidesHomepageSections(variant)) return null;
    return <Comp className={TAGGED_SHOW_CLASS}>{children}</Comp>;
}

