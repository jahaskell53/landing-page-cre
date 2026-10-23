export const HERO_COPY_TEST_FLAG = "hero-copy-test";
/** Public URL override: `/?tag=broker` selects the BOV hero copy. */
export const HERO_VARIANT_QUERY = "tag";
export const HERO_VARIANT_TAG_BROKER = "broker";
export const HERO_VARIANT_STORAGE_KEY = "om_hero_variant";

export const HERO_VARIANT_KEYS = ["control", "bov"] as const;
export type HeroVariant = (typeof HERO_VARIANT_KEYS)[number];

/** Silent legacy alias for the old `?hero=bov` override. */
export const HERO_VARIANT_LEGACY_QUERY = "hero";

export const BOV_HIDDEN_SECTION_CLASS = "js-hide-on-bov-hero";

/** Runs before first paint so BOV URL visitors never see the hidden sections. */
export const BOV_HERO_PREPAINT_SCRIPT = `(function(){var p=new URLSearchParams(location.search);if(p.get(${JSON.stringify(HERO_VARIANT_QUERY)})===${JSON.stringify(HERO_VARIANT_TAG_BROKER)}||p.get(${JSON.stringify(HERO_VARIANT_LEGACY_QUERY)})==="bov"){document.documentElement.dataset.heroVariant="bov";}})();`;

export const BOV_HERO_PREPAINT_STYLE = `html[data-hero-variant="bov"] .${BOV_HIDDEN_SECTION_CLASS}{display:none!important}`;

export type HeroCopy = {
    /** Headline lines. A single line is one block; two lines match the current stacked hero. */
    lines: readonly string[];
    /** Substring of a headline line to wrap in the mid-market highlight badge. */
    highlight?: string;
    subtitle: string;
    /** Substrings of the subtitle to render in the navy/semibold EMPHASIS style. */
    emphasis?: readonly string[];
};

export const HERO_COPY = {
    control: {
        lines: ["OpenMidmarket: Institutional-grade CRE platform.", "Built for the mid-market."],
        subtitle:
            "A unified ecosystem leveraging predictive AI, real-time data, and a dedicated CRE professional network. Gain an edge with institutional power tailored for your speed.",
    },
    bov: {
        lines: ["Build a BOV in seconds, not weeks."],
        subtitle: "Let AI pull the comps and run the numbers, so you can focus on the deal.",
    },
} as const satisfies Record<HeroVariant, HeroCopy>;

export function parseHeroVariant(value: string | null | undefined): HeroVariant | null {
    return value === "control" || value === "bov" ? value : null;
}

/** Map a `?tag=` query value to an internal hero variant. `broker` → `bov`. */
export function parseHeroTag(value: string | null | undefined): HeroVariant | null {
    return value === HERO_VARIANT_TAG_BROKER ? "bov" : null;
}

/** URL tag to persist on outbound links when the BOV / broker variant is active. */
export function heroVariantToTag(variant: HeroVariant): string | null {
    return variant === "bov" ? HERO_VARIANT_TAG_BROKER : null;
}

export function readHeroOverride(): HeroVariant | null {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const fromTag = parseHeroTag(params.get(HERO_VARIANT_QUERY));
    if (fromTag) return fromTag;
    return parseHeroVariant(params.get(HERO_VARIANT_LEGACY_QUERY));
}

export function persistHeroVariant(variant: HeroVariant) {
    try {
        sessionStorage.setItem(HERO_VARIANT_STORAGE_KEY, variant);
    } catch {
        // Private mode / disabled storage — events still carry the in-memory variant.
    }
}

export function readPersistedHeroVariant(): HeroVariant | null {
    if (typeof window === "undefined") return null;
    try {
        return parseHeroVariant(sessionStorage.getItem(HERO_VARIANT_STORAGE_KEY));
    } catch {
        return null;
    }
}
