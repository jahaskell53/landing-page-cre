/**
 * Copy, metadata, FAQs, and JSON-LD builders for `/markets` and `/markets/[slug]`.
 *
 * Every sentence pulls from live fetched stats and omits missing clauses rather
 * than inventing numbers.
 */
import { ORGANIZATION_ID, SITE_ORIGIN, WEBSITE_ID } from "@/lib/organization";
import { canonicalUrl, ORGANIZATION_NAME } from "@/lib/seo";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/utils/format";
import { marketPath, marketPlaceName, type MarketConfig } from "./catalog";
import type { MarketSnapshot } from "./server";

export type MarketFaq = {
    question: string;
    answer: string;
};

/**
 * Concise SEO title tuned for investor/broker queries ("San Francisco Multifamily Cap Rates & Price Per Door").
 * Keeps the core search phrase up front and stays within ~60 characters.
 */
export function marketDocumentTitle(snapshot: MarketSnapshot): string {
    const { market, medianCapRate, medianPricePerDoor } = snapshot;
    if (medianCapRate != null && medianPricePerDoor != null) {
        return `${market.name} Multifamily Cap Rates (${formatPercent(medianCapRate, 1)}) & $/Door`;
    }
    return `${market.name} Multifamily Cap Rates & Price Per Door`;
}

export function marketMetaDescription(snapshot: MarketSnapshot): string {
    const { market, medianCapRate, medianPricePerDoor, salesCount12Mo, medianRent1Br } = snapshot;
    const place = marketPlaceName(market);
    const parts: string[] = [];

    if (medianCapRate != null && medianPricePerDoor != null) {
        parts.push(
            `${place} multifamily closed sales average a ${formatPercent(medianCapRate, 2)} median cap rate and ${formatCurrency(medianPricePerDoor)} per door over the last 4 quarters`,
        );
    } else if (medianPricePerDoor != null) {
        parts.push(`${place} multifamily closed sales show a ${formatCurrency(medianPricePerDoor)} median price per door over the last 4 quarters`);
    } else {
        parts.push(`Closed multifamily cap rates, price per door, and apartment rent benchmarks for ${place}`);
    }

    if (salesCount12Mo > 0) {
        parts[0] += ` (${formatNumber(salesCount12Mo)} sales).`;
    } else {
        parts[0] += ".";
    }

    if (medianRent1Br != null) {
        parts.push(`Median 1-bedroom asking rent is ${formatCurrency(medianRent1Br)}.`);
    }
    parts.push("Updated from closed multifamily comps for Bay Area brokers and investors.");

    return parts.join(" ");
}

export function marketInsightSentences(snapshot: MarketSnapshot): string[] {
    const { market, medianCapRate, medianPricePerDoor, p25PricePerDoor, p75PricePerDoor, salesCount12Mo, pricePerDoorYoYPct, medianRent1Br, medianRent2Br } =
        snapshot;
    const sentences: string[] = [];

    if (medianPricePerDoor != null && salesCount12Mo > 0) {
        const rangeBit =
            p25PricePerDoor != null && p75PricePerDoor != null
                ? ` (middle 50%: ${formatCompact(p25PricePerDoor)}-${formatCompact(p75PricePerDoor)})`
                : "";
        sentences.push(
            `${market.name} closed sales average ${formatCurrency(medianPricePerDoor)}/door across ${formatNumber(salesCount12Mo)} trades${rangeBit}.`,
        );
    }

    if (medianCapRate != null) {
        const yoyBit =
            pricePerDoorYoYPct != null ? `, with $/door ${formatPercent(pricePerDoorYoYPct, 1, { showSign: true })} YoY` : "";
        sentences.push(`Reported closed cap rates average ${formatPercent(medianCapRate, 2)}${yoyBit}.`);
    } else if (pricePerDoorYoYPct != null) {
        sentences.push(`Median price per door is ${formatPercent(pricePerDoorYoYPct, 1, { showSign: true })} YoY.`);
    }

    if (medianRent1Br != null && medianRent2Br != null) {
        sentences.push(`Active asking rents are ${formatCurrency(medianRent1Br)} for 1BRs and ${formatCurrency(medianRent2Br)} for 2BRs.`);
    } else if (medianRent1Br != null) {
        sentences.push(`Active 1-bedroom asking rent is ${formatCurrency(medianRent1Br)}.`);
    }

    return sentences;
}

export function marketFaqItems(snapshot: MarketSnapshot): MarketFaq[] {
    const { market, medianCapRate, capRateSampleCount, medianPricePerDoor, p25PricePerDoor, p75PricePerDoor, salesCount12Mo, medianRent1Br, medianRent2Br } =
        snapshot;
    const place = marketPlaceName(market);
    const items: MarketFaq[] = [];

    if (medianCapRate != null) {
        const sampleBit = capRateSampleCount > 0 ? ` across ${formatNumber(capRateSampleCount)} closed transactions reporting a cap rate` : "";
        items.push({
            question: `What is the average multifamily cap rate in ${place}?`,
            answer: `Over the trailing four quarters, closed multifamily sales in ${place} averaged a ${formatPercent(medianCapRate, 2)} cap rate${sampleBit}. Individual deals vary by vintage, rent control exposure, unit mix, and value-add rent upside.`,
        });
    } else {
        items.push({
            question: `What drives multifamily cap rates in ${place}?`,
            answer: `Multifamily cap rates in ${place} depend heavily on building vintage, local rent-control rules, unit mix, deferred CapEx, and the gap between in-place and market asking rents.`,
        });
    }

    if (medianPricePerDoor != null) {
        const band =
            p25PricePerDoor != null && p75PricePerDoor != null
                ? ` The interquartile range (25th to 75th percentile) runs from ${formatCurrency(p25PricePerDoor)} to ${formatCurrency(p75PricePerDoor)} per door.`
                : "";
        items.push({
            question: `What is the median price per unit for apartments in ${market.name}?`,
            answer: `The trailing 4-quarter median closed multifamily price per door in ${place} is ${formatCurrency(medianPricePerDoor)} across ${formatNumber(salesCount12Mo)} recorded trades.${band}`,
        });
    }

    if (medianRent1Br != null) {
        const twoBed = medianRent2Br != null ? ` and ${formatCurrency(medianRent2Br)} for 2-bedrooms` : "";
        items.push({
            question: `What are current apartment asking rents in ${market.name}?`,
            answer: `Recent active listings in ${place} show a median asking rent of ${formatCurrency(medianRent1Br)} for 1-bedroom units${twoBed}. Brokers and investors use building-level photo-scored comps inside OpenMidmarket to adjust for finishes, parking, and micro-location.`,
        });
    }

    items.push({
        question: `How is ${market.name} multifamily sales data calculated?`,
        answer: `Sales metrics aggregate closed multifamily transactions in ${place}, grouped into quarterly buckets over a 5-year window. Price per door is total sale price divided by unit count, excluding outliers below $20,000/door, and cap rates are capped at 12% to filter reporting errors.`,
    });

    return items;
}

export function marketDetailJsonLd(snapshot: MarketSnapshot): Record<string, unknown> {
    const { market } = snapshot;
    const url = canonicalUrl(marketPath(market.slug));
    const hubUrl = canonicalUrl("/markets");
    const faqs = marketFaqItems(snapshot);
    const description = marketMetaDescription(snapshot);

    const temporalCoverage =
        snapshot.windowStart && snapshot.windowEnd ? `${snapshot.windowStart}/${snapshot.windowEnd}` : undefined;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: marketDocumentTitle(snapshot),
                description,
                isPartOf: { "@id": WEBSITE_ID },
                publisher: { "@id": ORGANIZATION_ID },
            },
            {
                "@type": "Dataset",
                "@id": `${url}#dataset`,
                name: `${marketPlaceName(market)} Multifamily Cap Rates & Price Per Door`,
                description,
                url,
                license: `${SITE_ORIGIN}/terms`,
                creator: { "@id": ORGANIZATION_ID },
                publisher: { "@id": ORGANIZATION_ID },
                spatialCoverage: {
                    "@type": "Place",
                    name: marketPlaceName(market),
                },
                ...(temporalCoverage ? { temporalCoverage } : {}),
                variableMeasured: ["Median Cap Rate", "Median Price Per Door", "Closed Multifamily Sales Volume", "Median Apartment Asking Rent"],
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: ORGANIZATION_NAME, item: `${SITE_ORIGIN}/` },
                    { "@type": "ListItem", position: 2, name: "Bay Area Multifamily Markets", item: hubUrl },
                    { "@type": "ListItem", position: 3, name: market.name, item: url },
                ],
            },
            {
                "@type": "FAQPage",
                url,
                mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                    },
                })),
            },
        ],
    };
}

export function marketsHubJsonLd(markets: readonly MarketConfig[]): Record<string, unknown> {
    const url = canonicalUrl("/markets");
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${url}#webpage`,
                url,
                name: "Bay Area Multifamily Cap Rates & Price Per Door | OpenMidmarket",
                description:
                    "Live multifamily cap rates, closed-sale price per door, transaction volume, and apartment rent benchmarks across Bay Area cities and counties.",
                isPartOf: { "@id": WEBSITE_ID },
                publisher: { "@id": ORGANIZATION_ID },
            },
            {
                "@type": "ItemList",
                name: "Bay Area Multifamily Markets",
                itemListElement: markets.map((market, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: `${marketPlaceName(market)} Multifamily Cap Rates & $/Door`,
                    url: canonicalUrl(marketPath(market.slug)),
                })),
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: ORGANIZATION_NAME, item: `${SITE_ORIGIN}/` },
                    { "@type": "ListItem", position: 2, name: "Bay Area Multifamily Markets", item: url },
                ],
            },
        ],
    };
}
