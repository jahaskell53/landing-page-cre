export const HERO_COPY_TEST_FLAG = "hero-copy-test";
/** Public URL override: `/?tag=broker` selects the BOV hero copy, `/?tag=investor` selects the investor hero copy. */
export const HERO_VARIANT_QUERY = "tag";
export const HERO_VARIANT_TAG_BROKER = "broker";
export const HERO_VARIANT_TAG_LEADS = "leads";
export const HERO_VARIANT_TAG_INVESTOR = "investor";
export const HERO_VARIANT_STORAGE_KEY = "om_hero_variant";

export const HERO_VARIANT_KEYS = ["control", "bov", "leads", "investor"] as const;
export type HeroVariant = (typeof HERO_VARIANT_KEYS)[number];

/** Silent legacy alias for the old `?hero=bov` override. */
export const HERO_VARIANT_LEGACY_QUERY = "hero";

export type HeroCopy = {
    /** Headline lines. A single line is one block; two lines match the current stacked hero. */
    lines: readonly string[];
    /** Substring of a headline line to wrap in the mid-market highlight badge. */
    highlight?: string;
    /** Substring of a headline line to color with brand accent blue. */
    accent?: string;
    subtitle: string;
    /** Substrings of the subtitle to render in the navy/semibold EMPHASIS style. */
    emphasis?: readonly string[];
    /** Substrings of the subtitle to render in italic, same weight and color. */
    italic?: readonly string[];
};

export const HERO_COPY = {
    control: {
        lines: ["Multifamily rent comps & BOVs.", "Built for the mid-market."],
        accent: "mid-market",
        subtitle: "Photo-scored rent comps, closed cap rate trends, and AI underwriting built for Bay Area apartment brokers and investors.",
    },
    bov: {
        lines: ["Build a BOV in seconds, not weeks."],
        accent: "seconds",
        subtitle: "Let AI pull the comps and run the numbers, so you can focus on the deal.",
        italic: ["AI", "deal"],
    },
    leads: {
        lines: ["Win more listings with the numbers owners want to see."],
        accent: "Win more listings",
        subtitle: "Send owners a rent survey, show their rent upside, and find buyers, all from one place.",
    },
    investor: {
        lines: ["Underwrite deals in seconds, not weeks."],
        accent: "seconds",
        subtitle: "Let AI pull the comps, quantify the rent upside, and stress-test returns, so you can bid with conviction before anyone else.",
        italic: ["AI", "conviction"],
    },
} as const satisfies Record<HeroVariant, HeroCopy>;

export const HERO_PAGE_TITLES: Record<HeroVariant, string> = {
    control: "Multifamily Rent Comps, BOVs & Cap Rates | OpenMidmarket",
    bov: "Multifamily BOV & Rent Comps for CRE Brokers | OpenMidmarket",
    leads: "Win More Multifamily Listings | OpenMidmarket",
    investor: "Multifamily Underwriting & Rent Comps | OpenMidmarket",
};

export function parseHeroVariant(value: string | null | undefined): HeroVariant | null {
    return value === "control" || value === "bov" || value === "leads" || value === "investor" ? value : null;
}

/** Map a `?tag=` query value to an internal hero variant. `broker` → `bov`. */
export function parseHeroTag(value: string | null | undefined): HeroVariant | null {
    if (value === HERO_VARIANT_TAG_BROKER) return "bov";
    if (value === HERO_VARIANT_TAG_LEADS) return "leads";
    if (value === HERO_VARIANT_TAG_INVESTOR) return "investor";
    return null;
}

/** Resolve a hero variant from `?tag=` (preferred) or legacy `?hero=` query parameters. */
export function resolveHeroVariantFromParams(tag: string | null | undefined, hero: string | null | undefined): HeroVariant | null {
    return parseHeroTag(tag) ?? parseHeroVariant(hero);
}

/** URL tag to persist on outbound links when a tagged hero variant is active. */
export function heroVariantToTag(variant: HeroVariant): string | null {
    if (variant === "bov") return HERO_VARIANT_TAG_BROKER;
    if (variant === "leads") return HERO_VARIANT_TAG_LEADS;
    if (variant === "investor") return HERO_VARIANT_TAG_INVESTOR;
    return null;
}

export function readHeroOverride(): HeroVariant | null {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return resolveHeroVariantFromParams(params.get(HERO_VARIANT_QUERY), params.get(HERO_VARIANT_LEGACY_QUERY));
}

export function persistHeroVariant(variant: HeroVariant) {
    try {
        sessionStorage.setItem(HERO_VARIANT_STORAGE_KEY, variant);
    } catch {
        // Private mode or disabled storage. Events still carry the in-memory variant.
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

export function hidesHomepageSections(variant: HeroVariant): boolean {
    return variant === "bov" || variant === "leads" || variant === "investor";
}
