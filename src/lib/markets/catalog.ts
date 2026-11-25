/**
 * Public Bay Area multifamily market catalog (`/markets` and `/markets/[slug]`).
 *
 * Covers the core Bay Area counties and cities with deep closed-sales and
 * rental comp coverage. San Francisco is modeled once as a city (not duplicated
 * as a separate county page) to avoid keyword cannibalization.
 */
import { APP_ORIGIN } from "@/lib/app-origin";

export type MarketKind = "city" | "county";

export type MarketConfig = {
    slug: string;
    /** Display name, e.g. "San Francisco" or "Alameda County". */
    name: string;
    /** Shorter name for compact badges / headings, e.g. "SF" or "Alameda County". */
    shortName: string;
    kind: MarketKind;
    /** Exact `p_city` value for city RPCs. */
    city?: string;
    /** Exact `p_county_name` value (`county_boundaries.name_lsad`, includes "County"). */
    countyName?: string;
    state: "CA";
    /** Region grouping on the `/markets` index page. */
    region: "San Francisco" | "East Bay" | "Peninsula" | "South Bay";
    /** Parent county slug for city pages (omitted for SF and county pages). */
    parentCountySlug?: string;
    /** Matching city slug on `app.openmidmarket.com/rent/[slug]`, when one exists. */
    rentCitySlug?: string;
    /** Brief submarket framing used in copy and methodology context. */
    blurb: string;
};

export const BAY_AREA_MARKETS: readonly MarketConfig[] = [
    {
        slug: "san-francisco",
        name: "San Francisco",
        shortName: "SF",
        kind: "city",
        city: "San Francisco",
        state: "CA",
        region: "San Francisco",
        rentCitySlug: "sf",
        blurb: "Mid-market 5 to 100+ unit apartment buildings across San Francisco's urban neighborhoods, from rent-controlled vintage stock to newer infill.",
    },
    {
        slug: "oakland",
        name: "Oakland",
        shortName: "Oakland",
        kind: "city",
        city: "Oakland",
        state: "CA",
        region: "East Bay",
        parentCountySlug: "alameda-county",
        rentCitySlug: "oakland",
        blurb: "Value-add and stabilized apartment assets across Lake Merritt, Adams Point, Temescal, Uptown, and broader Oakland submarkets.",
    },
    {
        slug: "san-jose",
        name: "San Jose",
        shortName: "San Jose",
        kind: "city",
        city: "San Jose",
        state: "CA",
        region: "South Bay",
        parentCountySlug: "santa-clara-county",
        rentCitySlug: "san-jose",
        blurb: "Silicon Valley's deepest mid-market multifamily sales market, spanning Downtown, Willow Glen, West San Jose, and Campbell-adjacent corridors.",
    },
    {
        slug: "alameda-county",
        name: "Alameda County",
        shortName: "Alameda County",
        kind: "county",
        countyName: "Alameda County",
        state: "CA",
        region: "East Bay",
        rentCitySlug: "oakland",
        blurb: "Countywide East Bay multifamily trades covering Oakland, Berkeley, Alameda, Hayward, San Leandro, and Fremont.",
    },
    {
        slug: "san-mateo-county",
        name: "San Mateo County",
        shortName: "San Mateo County",
        kind: "county",
        countyName: "San Mateo County",
        state: "CA",
        region: "Peninsula",
        rentCitySlug: "san-mateo",
        blurb: "Peninsula apartment sales spanning Daly City, South San Francisco, Burlingame, San Mateo, Redwood City, and Menlo Park.",
    },
    {
        slug: "santa-clara-county",
        name: "Santa Clara County",
        shortName: "Santa Clara County",
        kind: "county",
        countyName: "Santa Clara County",
        state: "CA",
        region: "South Bay",
        rentCitySlug: "san-jose",
        blurb: "Silicon Valley multifamily transactions across San Jose, Santa Clara, Sunnyvale, Mountain View, Palo Alto, and Campbell.",
    },
    {
        slug: "contra-costa-county",
        name: "Contra Costa County",
        shortName: "Contra Costa County",
        kind: "county",
        countyName: "Contra Costa County",
        state: "CA",
        region: "East Bay",
        rentCitySlug: "walnut-creek",
        blurb: "Inner and outer East Bay apartment sales across Walnut Creek, Concord, Pleasant Hill, Richmond, and Martinez.",
    },
    {
        slug: "berkeley",
        name: "Berkeley",
        shortName: "Berkeley",
        kind: "city",
        city: "Berkeley",
        state: "CA",
        region: "East Bay",
        parentCountySlug: "alameda-county",
        rentCitySlug: "berkeley",
        blurb: "Supply-constrained East Bay multifamily around UC Berkeley, Downtown, Elmwood, and North Berkeley with resilient student and professional demand.",
    },
    {
        slug: "san-mateo",
        name: "San Mateo",
        shortName: "San Mateo",
        kind: "city",
        city: "San Mateo",
        state: "CA",
        region: "Peninsula",
        parentCountySlug: "san-mateo-county",
        rentCitySlug: "san-mateo",
        blurb: "Mid-Peninsula multifamily properties positioned along the Caltrain and El Camino Real corridors between San Francisco and Silicon Valley.",
    },
    {
        slug: "redwood-city",
        name: "Redwood City",
        shortName: "Redwood City",
        kind: "city",
        city: "Redwood City",
        state: "CA",
        region: "Peninsula",
        parentCountySlug: "san-mateo-county",
        rentCitySlug: "redwood-city",
        blurb: "Peninsula apartment buildings benefiting from major tech and life-science employers and strong transit access.",
    },
    {
        slug: "palo-alto",
        name: "Palo Alto",
        shortName: "Palo Alto",
        kind: "city",
        city: "Palo Alto",
        state: "CA",
        region: "South Bay",
        parentCountySlug: "santa-clara-county",
        rentCitySlug: "palo-alto",
        blurb: "High-barrier Silicon Valley multifamily submarket characterized by low cap rates, high per-door basis, and deep tenant demand.",
    },
    {
        slug: "mountain-view",
        name: "Mountain View",
        shortName: "Mountain View",
        kind: "city",
        city: "Mountain View",
        state: "CA",
        region: "South Bay",
        parentCountySlug: "santa-clara-county",
        rentCitySlug: "mountain-view",
        blurb: "Core Silicon Valley apartment submarket anchored by major tech campuses and walkable Downtown Castro Street demand.",
    },
    {
        slug: "sunnyvale",
        name: "Sunnyvale",
        shortName: "Sunnyvale",
        kind: "city",
        city: "Sunnyvale",
        state: "CA",
        region: "South Bay",
        parentCountySlug: "santa-clara-county",
        rentCitySlug: "sunnyvale",
        blurb: "Garden-style and mid-rise multifamily stock in central Silicon Valley with strong employer proximity and steady occupancy.",
    },
    {
        slug: "alameda",
        name: "Alameda",
        shortName: "Alameda",
        kind: "city",
        city: "Alameda",
        state: "CA",
        region: "East Bay",
        parentCountySlug: "alameda-county",
        rentCitySlug: "alameda",
        blurb: "Island East Bay multifamily market known for classic 1920s-1970s apartment buildings and high tenant retention.",
    },
] as const;

const MARKET_BY_SLUG = new Map(BAY_AREA_MARKETS.map((market) => [market.slug, market]));

export const MARKET_SLUGS: readonly string[] = BAY_AREA_MARKETS.map((market) => market.slug);

export function getMarketBySlug(slug: string): MarketConfig | null {
    return MARKET_BY_SLUG.get(slug) ?? null;
}

export function marketPath(slug: string): string {
    return `/markets/${slug}`;
}

export function marketPlaceName(market: Pick<MarketConfig, "name" | "state">): string {
    return `${market.name}, ${market.state}`;
}

export function marketRentPageUrl(market: Pick<MarketConfig, "rentCitySlug">): string | null {
    return market.rentCitySlug ? `${APP_ORIGIN}/rent/${market.rentCitySlug}` : null;
}

/** Related markets to cross-link from a detail page: parent county (if city) + same-region peers + major Bay Area hubs. */
export function getRelatedMarkets(market: MarketConfig): MarketConfig[] {
    const picked: MarketConfig[] = [];
    const seen = new Set<string>([market.slug]);

    const add = (candidate: MarketConfig | null | undefined) => {
        if (!candidate || seen.has(candidate.slug)) return;
        seen.add(candidate.slug);
        picked.push(candidate);
    };

    if (market.parentCountySlug) {
        add(getMarketBySlug(market.parentCountySlug));
    }
    for (const other of BAY_AREA_MARKETS) {
        if (other.region === market.region) add(other);
    }
    for (const slug of ["san-francisco", "oakland", "san-jose", "alameda-county", "san-mateo-county", "santa-clara-county"]) {
        add(getMarketBySlug(slug));
    }

    return picked.slice(0, 6);
}
