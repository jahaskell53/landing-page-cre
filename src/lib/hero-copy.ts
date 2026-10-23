export const HERO_COPY_TEST_FLAG = "hero-copy-test";
/** Public URL override: `/?tag=broker` selects the BOV hero copy. */
export const HERO_VARIANT_QUERY = "tag";
export const HERO_VARIANT_TAG_BROKER = "broker";
export const HERO_VARIANT_TAG_LEADS = "leads";
export const HERO_VARIANT_STORAGE_KEY = "om_hero_variant";

export const HERO_VARIANT_KEYS = ["control", "bov", "leads"] as const;
export type HeroVariant = (typeof HERO_VARIANT_KEYS)[number];

/** Control and BOV share one stacked hero grid. Leads is a separate block. */
export const STACKED_HERO_VARIANT_KEYS = ["control", "bov"] as const;
export type StackedHeroVariant = (typeof STACKED_HERO_VARIANT_KEYS)[number];

/** Silent legacy alias for the old `?hero=bov` override. */
export const HERO_VARIANT_LEGACY_QUERY = "hero";

export const BOV_HIDDEN_SECTION_CLASS = "js-hide-on-bov-hero";
export const LEADS_SHOW_CLASS = "js-show-on-leads-hero";
export const LEADS_HIDE_CLASS = "js-hide-on-leads-hero";
export const TAGGED_SHOW_CLASS = "js-show-on-tagged-hero";

/** Runs before first paint so BOV/leads URL visitors never see the hidden sections. */
export const BOV_HERO_PREPAINT_SCRIPT = `(function(){var p=new URLSearchParams(location.search);var tag=p.get(${JSON.stringify(HERO_VARIANT_QUERY)});if(tag===${JSON.stringify(HERO_VARIANT_TAG_BROKER)}||p.get(${JSON.stringify(HERO_VARIANT_LEGACY_QUERY)})==="bov"){document.documentElement.dataset.heroVariant="bov";}else if(tag===${JSON.stringify(HERO_VARIANT_TAG_LEADS)}){document.documentElement.dataset.heroVariant="leads";}})();`;

export const BOV_HERO_PREPAINT_STYLE = `html[data-hero-variant="bov"] .${BOV_HIDDEN_SECTION_CLASS},html[data-hero-variant="leads"] .${BOV_HIDDEN_SECTION_CLASS}{display:none!important}html[data-hero-variant="leads"] .${LEADS_HIDE_CLASS}{display:none!important}html:not([data-hero-variant="leads"]) .${LEADS_SHOW_CLASS}{display:none!important}html:not([data-hero-variant="bov"]):not([data-hero-variant="leads"]) .${TAGGED_SHOW_CLASS}{display:none!important}`;

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
        lines: ["OpenMidmarket: Institutional-grade CRE platform.", "Built for the mid-market."],
        subtitle:
            "A unified ecosystem leveraging predictive AI, real-time data, and a dedicated CRE professional network. Gain an edge with institutional power tailored for your speed.",
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
} as const satisfies Record<HeroVariant, HeroCopy>;

export function parseHeroVariant(value: string | null | undefined): HeroVariant | null {
    return value === "control" || value === "bov" || value === "leads" ? value : null;
}

/** Map a `?tag=` query value to an internal hero variant. `broker` → `bov`. */
export function parseHeroTag(value: string | null | undefined): HeroVariant | null {
    if (value === HERO_VARIANT_TAG_BROKER) return "bov";
    if (value === HERO_VARIANT_TAG_LEADS) return "leads";
    return null;
}

/** URL tag to persist on outbound links when a tagged hero variant is active. */
export function heroVariantToTag(variant: HeroVariant): string | null {
    if (variant === "bov") return HERO_VARIANT_TAG_BROKER;
    if (variant === "leads") return HERO_VARIANT_TAG_LEADS;
    return null;
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
    return variant === "bov" || variant === "leads";
}
