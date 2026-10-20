export const HERO_COPY_TEST_FLAG = "hero-copy-test";
export const HERO_VARIANT_QUERY = "hero";
export const HERO_VARIANT_STORAGE_KEY = "om_hero_variant";

export const HERO_VARIANT_KEYS = ["control", "bov"] as const;
export type HeroVariant = (typeof HERO_VARIANT_KEYS)[number];

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
        lines: ["Institutional-grade CRE platform.", "Built for the mid-market."],
        subtitle:
            "A unified ecosystem leveraging predictive AI, real-time data, and a dedicated CRE professional network. Gain an edge with institutional power tailored for your speed.",
    },
    bov: {
        lines: ["Build a BOV in seconds, not weeks."],
        subtitle: "Rent comps, sales comps, and rent trends for multifamily, all in one place.",
    },
} as const satisfies Record<HeroVariant, HeroCopy>;

export function parseHeroVariant(value: string | null | undefined): HeroVariant | null {
    return value === "control" || value === "bov" ? value : null;
}

export function readHeroOverride(): HeroVariant | null {
    if (typeof window === "undefined") return null;
    return parseHeroVariant(new URLSearchParams(window.location.search).get(HERO_VARIANT_QUERY));
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
