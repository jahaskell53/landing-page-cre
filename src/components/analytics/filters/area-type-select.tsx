"use client";

import { ANALYTICS_AREA_TYPES } from "@/lib/analytics/filters";
import { SegmentedControl } from "./segmented-control";

interface AreaTypeSelectProps {
    /** The active area type, or null/undefined when none is selected (e.g. address mode). */
    value: string | null | undefined;
    onChange: (value: string) => void;
    /** Area types to offer. Defaults to the canonical analytics set. */
    areaTypes?: readonly string[];
    /** Predicate to disable individual area types (e.g. unsupported on the map view). */
    isDisabled?: (areaType: string) => boolean;
    wrap?: boolean;
    className?: string;
}

/**
 * Canonical area-type picker (Neighborhood / ZIP Code / City / County / MSA).
 * Replaces the `<Select>` dropdown in sales-trends and the hand-rolled pill
 * group in rent-trends with one shared segmented control, so the area type is
 * chosen the same way across every analytics form.
 */
export function AreaTypeSelect({ value, onChange, areaTypes = ANALYTICS_AREA_TYPES, isDisabled, wrap = true, className }: AreaTypeSelectProps) {
    return (
        <SegmentedControl
            ariaLabel="Area type"
            options={areaTypes.map((t) => ({ value: t, label: t, disabled: isDisabled?.(t) }))}
            value={value}
            onChange={onChange}
            wrap={wrap}
            className={className}
        />
    );
}
