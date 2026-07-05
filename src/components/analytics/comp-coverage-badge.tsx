import { type CompCoverageCounts, type CompCoverageSource, formatCompCoverageLabel } from "@/lib/analytics/comp-coverage";
import { cn } from "@/lib/utils";

interface CompCoverageBadgeProps {
    counts: CompCoverageCounts;
    source: CompCoverageSource;
    className?: string;
}

export function CompCoverageBadge({ counts, source, className }: CompCoverageBadgeProps) {
    return (
        <span
            className={cn(
                "shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 dark:border-gray-600 dark:bg-gray-700/60 dark:text-gray-300",
                className,
            )}
        >
            {formatCompCoverageLabel(counts, source)}
        </span>
    );
}
