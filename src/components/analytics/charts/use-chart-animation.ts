"use client";

import { useSyncExternalStore } from "react";

/** Recharts defaults used by the sales-trends preview line. */
export const CHART_ANIMATION_DURATION = 1500;
export const CHART_ANIMATION_EASING = "ease" as const;

export type ChartAnimationProps = {
    isAnimationActive: boolean;
    animationDuration: number;
    animationEasing: typeof CHART_ANIMATION_EASING;
};

function subscribeReducedMotion(onChange: () => void) {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

function reducedMotionSnapshot() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useChartAnimation(): ChartAnimationProps {
    const reduceMotion = useSyncExternalStore(subscribeReducedMotion, reducedMotionSnapshot, () => true);

    return {
        isAnimationActive: !reduceMotion,
        animationDuration: CHART_ANIMATION_DURATION,
        animationEasing: CHART_ANIMATION_EASING,
    };
}
