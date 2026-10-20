export const AUDIENCE_SLUGS = [
    "owners",
    "brokers",
    "lenders",
    "property-managers",
    "appraisers",
    "insurance-agents",
    "1031-advisors",
] as const;

export type AudienceSlug = (typeof AUDIENCE_SLUGS)[number];

export function isAudienceSlug(value: string): value is AudienceSlug {
    return (AUDIENCE_SLUGS as readonly string[]).includes(value);
}
