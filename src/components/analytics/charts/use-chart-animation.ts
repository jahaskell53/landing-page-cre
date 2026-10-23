"use client";

import { useReducedMotion } from "motion/react";

/** Recharts defaults used by the sales-trends preview line. */
export const CHART_ANIMATION_DURATION = 1500;
export const CHART_ANIMATION_EASING = "ease" as const;

export type ChartAnimationProps = {
    isAnimationActive: boolean;
    animationDuration: number;
    animationEasing: typeof CHART_ANIMATION_EASING;
};

export function useChartAnimation(): ChartAnimationProps {
    const reduceMotion = useReducedMotion();
    return {
        isAnimationActive: reduceMotion !== true,
        animationDuration: CHART_ANIMATION_DURATION,
        animationEasing: CHART_ANIMATION_EASING,
    };
}
