/**
 * Quarterly closed-sales trend charts for public `/markets/[slug]` pages.
 *
 * Matches the redesigned `/rent/[city]` static SSR SVG chart style: zero client
 * JS, instant first paint with full SVG in the initial HTML, navy accent line
 * with soft vertical area fill, and a headline latest-value + delta pill.
 */
import type { QuarterlySalesPoint } from "@/lib/markets/server";
import { formatCompact, formatPercent } from "@/utils/format";

const GRID_STROKE = "#e5e7eb";
const TICK_FILL = "#6b7280";
const LINE_COLOR = "#1e3a8a";

const WIDTH = 440;
const HEIGHT = 172;
const PAD = { top: 14, right: 14, bottom: 26, left: 60 };
const FONT = "ui-sans-serif, system-ui, sans-serif";

type SeriesPoint = {
    label: string;
    value: number;
};

function yTicks(min: number, max: number, count: number): number[] {
    if (min === max) return [min];
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) => min + step * i);
}

function QuarterlyMetricChart({
    id,
    eyebrow,
    title,
    desc,
    points,
    formatValue,
    formatAxis,
    formatDelta,
}: {
    id: string;
    eyebrow: string;
    title: string;
    desc: string;
    points: readonly SeriesPoint[];
    formatValue: (value: number) => string;
    formatAxis: (value: number) => string;
    formatDelta: (delta: number) => string;
}) {
    if (points.length === 0) return null;

    const values = points.map((p) => p.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const pad = (rawMax - rawMin) * 0.14 || Math.max(Math.abs(rawMin) * 0.05, 0.5);
    const yMin = rawMin - pad;
    const yMax = rawMax + pad;
    const innerWidth = WIDTH - PAD.left - PAD.right;
    const innerHeight = HEIGHT - PAD.top - PAD.bottom;

    const xAt = (index: number) => PAD.left + (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
    const yAt = (value: number) => PAD.top + (1 - (value - yMin) / (yMax - yMin)) * innerHeight;
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)} ${yAt(p.value).toFixed(1)}`).join(" ");
    const baseY = (PAD.top + innerHeight).toFixed(1);
    const areaPath =
        points.length > 1 ? `${linePath} L${xAt(points.length - 1).toFixed(1)} ${baseY} L${xAt(0).toFixed(1)} ${baseY} Z` : null;

    const ticks = yTicks(rawMin, rawMax, 3);
    const first = points[0]!;
    const latest = points[points.length - 1]!;
    const delta = points.length > 1 ? latest.value - first.value : null;
    const gradientId = `market-sales-fill-${id}`;

    return (
        <figure className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-2xs dark:border-gray-800 dark:bg-gray-900/50">
            <div className="mb-3 flex items-baseline justify-between gap-2">
                <div>
                    <figcaption className="text-xs font-medium text-gray-500 dark:text-gray-400">{eyebrow}</figcaption>
                    <p className="mt-0.5 text-xl font-semibold tracking-tight text-gray-900 tabular-nums dark:text-gray-100">
                        {formatValue(latest.value)}
                    </p>
                </div>
                {delta != null ? (
                    <span
                        className={
                            delta > 0
                                ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 tabular-nums dark:bg-emerald-500/15 dark:text-emerald-300"
                                : delta < 0
                                  ? "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 tabular-nums dark:bg-amber-500/15 dark:text-amber-300"
                                  : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 tabular-nums dark:bg-gray-800 dark:text-gray-400"
                        }
                    >
                        {formatDelta(delta)}
                    </span>
                ) : null}
            </div>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-labelledby={`market-chart-${id}-title`}>
                <title id={`market-chart-${id}-title`}>{title}</title>
                <desc>{desc}</desc>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={LINE_COLOR} stopOpacity="0.16" />
                        <stop offset="100%" stopColor={LINE_COLOR} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {ticks.map((tick, idx) => {
                    const y = yAt(tick).toFixed(1);
                    return (
                        <g key={idx}>
                            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke={GRID_STROKE} strokeDasharray="3 3" />
                            <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle" fill={TICK_FILL} fontSize="11" fontFamily={FONT}>
                                {formatAxis(tick)}
                            </text>
                        </g>
                    );
                })}
                {areaPath ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
                <path d={linePath} fill="none" stroke={LINE_COLOR} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                <circle
                    cx={xAt(points.length - 1).toFixed(1)}
                    cy={yAt(latest.value).toFixed(1)}
                    r="3.5"
                    fill={LINE_COLOR}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                />
                <text x={xAt(0).toFixed(1)} y={HEIGHT - 6} textAnchor="start" fill={TICK_FILL} fontSize="11" fontFamily={FONT}>
                    {first.label}
                </text>
                {points.length > 1 ? (
                    <text x={xAt(points.length - 1).toFixed(1)} y={HEIGHT - 6} textAnchor="end" fill={TICK_FILL} fontSize="11" fontFamily={FONT}>
                        {latest.label}
                    </text>
                ) : null}
            </svg>
        </figure>
    );
}

type WeightedSeriesPoint = SeriesPoint & {
    sampleCount: number;
};

function quantile(sorted: readonly number[], q: number): number {
    if (sorted.length === 0) return 0;
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    const next = sorted[base + 1];
    return next !== undefined ? sorted[base]! + rest * (next - sorted[base]!) : sorted[base]!;
}

/**
 * Exclude tiny small-sample quarters and statistical outlier spikes so a single
 * misclassified or 1-sale quarter does not flatten the rest of the chart.
 */
function filterChartSeries(points: readonly WeightedSeriesPoint[], minSample: number): readonly SeriesPoint[] {
    const withEnoughSamples = points.filter((p) => p.sampleCount >= minSample);
    const base = withEnoughSamples.length >= 4 ? withEnoughSamples : points;
    if (base.length < 4) return base;

    const sorted = base.map((p) => p.value).sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const median = quantile(sorted, 0.5);
    const q3 = quantile(sorted, 0.75);
    const spread = Math.max(q3 - q1, Math.abs(median) * 0.15);

    const lower = Math.max(median * 0.45, q1 - 1.5 * spread);
    const upper = Math.min(median * 1.85, q3 + 1.5 * spread);

    const cleaned = base.filter((p) => p.value >= lower && p.value <= upper);
    return cleaned.length >= 3 ? cleaned : base;
}

export function MarketSalesChart({ marketName, quarters }: { marketName: string; quarters: readonly QuarterlySalesPoint[] }) {
    if (quarters.length === 0) return null;

    const rawCapRatePoints: WeightedSeriesPoint[] = quarters.flatMap((q) =>
        q.medianCapRate != null ? [{ label: q.quarterLabel, value: q.medianCapRate, sampleCount: q.capRateCount }] : [],
    );
    const rawPricePoints: WeightedSeriesPoint[] = quarters.map((q) => ({
        label: q.quarterLabel,
        value: q.medianPricePerDoor,
        sampleCount: q.salesCount,
    }));

    const capRatePoints = filterChartSeries(rawCapRatePoints, 2);
    const pricePoints = filterChartSeries(rawPricePoints, 3);

    return (
        <div>
            <div className="mb-4 flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl dark:text-gray-100">Quarterly sales trends</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">Closed multifamily transactions</span>
            </div>
            <div className={`grid grid-cols-1 gap-4 ${capRatePoints.length > 0 ? "md:grid-cols-2" : ""}`}>
                {capRatePoints.length > 0 ? (
                    <QuarterlyMetricChart
                        id="cap-rate"
                        eyebrow="Median cap rate"
                        title={`${marketName} quarterly median cap rate`}
                        desc="Quarterly median closed-sale multifamily cap rate percentage."
                        points={capRatePoints}
                        formatValue={(v) => formatPercent(v, 2)}
                        formatAxis={(v) => formatPercent(v, 1)}
                        formatDelta={(d) => (Math.abs(d) < 0.005 ? "Flat" : `${d > 0 ? "+" : ""}${Math.round(d * 100)} bps`)}
                    />
                ) : null}
                <QuarterlyMetricChart
                    id="price-per-door"
                    eyebrow="Median price / door"
                    title={`${marketName} quarterly median price per door`}
                    desc="Quarterly median closed-sale multifamily price per unit."
                    points={pricePoints}
                    formatValue={(v) => formatCompact(v)}
                    formatAxis={(v) => formatCompact(v)}
                    formatDelta={(d) =>
                        Math.abs(d) < 1000 ? "Flat" : `${d > 0 ? "+" : "-"}${formatCompact(Math.abs(d))}`
                    }
                />
            </div>
        </div>
    );
}
