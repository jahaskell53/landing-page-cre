"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import posthog from "posthog-js";
import { isPostHogEnabled } from "@/lib/posthog-config";
import { cn } from "@/lib/utils";
import { HeroHighlight } from "./hero-highlight";
import {
    HERO_COPY,
    HERO_COPY_TEST_FLAG,
    HERO_VARIANT_KEYS,
    type HeroCopy,
    type HeroVariant,
    parseHeroVariant,
    persistHeroVariant,
    readHeroOverride,
} from "@/lib/hero-copy";

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
        }
        return (
            <span key={line} className={index === 0 && copy.lines.length > 1 ? "mb-3 block" : "block"}>
                {content}
            </span>
        );
    });
}

function useHeroVariant(): HeroVariant {
    const override = useSyncExternalStore(subscribe, readHeroOverride, (): HeroVariant | null => null);
    const [flagVariant, setFlagVariant] = useState<HeroVariant | null>(null);

    useEffect(() => {
        if (override) {
            persistHeroVariant(override);
            if (isPostHogEnabled) posthog.register({ hero_variant: override });
            return;
        }
        if (!isPostHogEnabled) return;

        const apply = () => {
            const value = parseHeroVariant(String(posthog.getFeatureFlag(HERO_COPY_TEST_FLAG) ?? ""));
            if (!value) return;
            setFlagVariant(value);
            persistHeroVariant(value);
            posthog.register({ hero_variant: value });
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
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">{withEmphasis(copy.subtitle, copy.emphasis)}</p>
        </>
    );
}

export function HeroCopy() {
    const variant = useHeroVariant();

    return (
        <div className="grid">
            {HERO_VARIANT_KEYS.map((key) => (
                <div key={key} className={cn("col-start-1 row-start-1", key !== variant && "invisible")} aria-hidden={key !== variant}>
                    <HeroVariantView variant={key} />
                </div>
            ))}
        </div>
    );
}
