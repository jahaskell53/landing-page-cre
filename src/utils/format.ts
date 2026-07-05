import { formatDistanceToNow } from "date-fns";

const LOCALE = "en-US";

/** Full USD amount with grouping, no decimal places (e.g. $1,234,567). */
export function formatCurrency(value: number): string {
    const abs = Math.abs(value);
    const formatted = abs.toLocaleString(LOCALE, { maximumFractionDigits: 0 });
    return value < 0 ? `-$${formatted}` : `$${formatted}`;
}

export type FormatCompactOptions = {
    /** Decimal places for millions (default 1). Thousands always use 0. */
    decimals?: number;
};

/** Compact USD (e.g. $1.2M, $500K, $123). */
export function formatCompact(value: number, options?: FormatCompactOptions): string {
    const decimals = options?.decimals ?? 1;
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(decimals)}M`;
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
    return formatCurrency(value);
}

/** Lot size in acres (e.g. 1.25 ac). */
export function formatAcres(value: number, options?: { withSuffix?: boolean }): string {
    const formatted = value >= 10 ? value.toLocaleString(LOCALE, { maximumFractionDigits: 0 }) : value.toLocaleString(LOCALE, { maximumFractionDigits: 2 });
    return options?.withSuffix === false ? formatted : `${formatted} ac`;
}

/** Building or lot area in square feet (e.g. 12,500 sqft). */
export function formatSqft(value: number, options?: { withSuffix?: boolean }): string {
    const formatted = value.toLocaleString(LOCALE, { maximumFractionDigits: 0 });
    return options?.withSuffix === false ? formatted : `${formatted} sqft`;
}

export type FormatDateStyle = "short" | "long" | "monthYear" | "monthDay";

export type FormatDateOptions = {
    style?: FormatDateStyle;
    /** Parse YYYY-MM-DD as UTC midnight (chart bucket labels). */
    utc?: boolean;
};

function toDate(input: Date | string, utc?: boolean): Date {
    if (input instanceof Date) return input;
    return new Date(utc ? `${input}T00:00:00Z` : input);
}

/** Calendar date (e.g. Jan 15, 2024). */
export function formatDate(input: Date | string, options?: FormatDateOptions): string {
    const { style = "short", utc = false } = options ?? {};
    const date = toDate(input, utc);
    const timeZone = utc ? "UTC" : undefined;

    if (style === "monthYear") {
        return date.toLocaleDateString(LOCALE, { month: "short", year: "2-digit", timeZone });
    }
    if (style === "monthDay") {
        return date.toLocaleDateString(LOCALE, { month: "short", day: "numeric", timeZone });
    }
    if (style === "long") {
        return date.toLocaleDateString(LOCALE, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone,
        });
    }
    return date.toLocaleDateString(LOCALE, {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone,
    });
}

/** Relative time (e.g. 3 days ago). */
export function formatRelative(input: Date | string): string {
    const date = input instanceof Date ? input : new Date(input);
    return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Percentage value with fixed decimal places (e.g. formatPercent(3.14) → "3.1%").
 * Pass showSign: true for signed display ("+" prefix on positive values).
 */
export function formatPercent(value: number, decimals = 1, options?: { showSign?: boolean }): string {
    const formatted = Math.abs(value).toFixed(decimals);
    if (value < 0) return `-${formatted}%`;
    if (options?.showSign) return `+${formatted}%`;
    return `${formatted}%`;
}

/** Integer or large number with locale grouping (e.g. 1234567 → "1,234,567"). */
export function formatNumber(value: number): string {
    return Math.round(value).toLocaleString(LOCALE);
}
