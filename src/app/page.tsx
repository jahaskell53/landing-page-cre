import type { Metadata } from "next";
import { HERO_VARIANT_LEGACY_QUERY, HERO_VARIANT_QUERY, resolveHeroVariantFromParams } from "@/lib/hero-copy";
import { HomepageJsonLd } from "./welcome/homepage-json-ld";
import { LandingHome, getHomepageMetadata } from "./welcome/landing-home";

type HomePageSearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<HomePageSearchParams> }): Promise<Metadata> {
    const params = await searchParams;
    const variant = resolveHeroVariantFromParams(firstParam(params[HERO_VARIANT_QUERY]), firstParam(params[HERO_VARIANT_LEGACY_QUERY]));
    return getHomepageMetadata(variant ?? "control");
}

export default async function HomePage({ searchParams }: { searchParams: Promise<HomePageSearchParams> }) {
    const params = await searchParams;
    const variant = resolveHeroVariantFromParams(firstParam(params[HERO_VARIANT_QUERY]), firstParam(params[HERO_VARIANT_LEGACY_QUERY]));

    return (
        <>
            <HomepageJsonLd />
            <LandingHome initialVariant={variant ?? "control"} hasUrlOverride={variant != null} />
        </>
    );
}
