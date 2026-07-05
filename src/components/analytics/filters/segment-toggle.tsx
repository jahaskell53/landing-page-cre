"use client";

import { MARKET_SEGMENT_OPTIONS, type MarketSegment } from "@/lib/analytics/filters";
import { SegmentedControl } from "./segmented-control";

/** Market segment filter shared by the trends and comps forms. Re-exported for existing importers. */
export type { MarketSegment };

const SEGMENT_OPTIONS = MARKET_SEGMENT_OPTIONS;

interface SegmentToggleProps {
    value: MarketSegment;
    onChange: (value: MarketSegment) => void;
    className?: string;
}

/**
 * Canonical All / Mid-market / REIT toggle. Replaces the divergent
 * implementations (pill group in rent-trends, native `<select>` in rent-comps)
 * with a single shared widget so the control looks and behaves the same
 * everywhere.
 */
export function SegmentToggle({ value, onChange, className }: SegmentToggleProps) {
    return <SegmentedControl ariaLabel="Segment" options={SEGMENT_OPTIONS} value={value} onChange={onChange} className={className} />;
}
