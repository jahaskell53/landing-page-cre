"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const CARD = "rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";

// Monthly portfolio value ($M), ending at the current $38.2M estimate.
const PORTFOLIO_SERIES = [34.4, 34.7, 35.1, 35.0, 35.6, 36.2, 36.1, 36.8, 37.3, 37.6, 37.9, 38.2];

type Holding = {
    name: string;
    location: string;
    occ: number;
    value: string;
    delta: string;
    up: boolean;
    spark: number[];
};

// Values sum to the $38.2M portfolio total; units sum to 248; occupancy avgs 94%.
const HOLDINGS: Holding[] = [
    {
        name: "Lakeshore Apartments",
        location: "Oakland · 96 units",
        occ: 96,
        value: "$14.8M",
        delta: "+0.4%",
        up: true,
        spark: [12.0, 12.5, 12.3, 13.0, 13.4, 13.2, 14.0, 14.2, 14.5, 14.8],
    },
    {
        name: "Mission Court",
        location: "San Jose · 84 units",
        occ: 91,
        value: "$12.9M",
        delta: "-0.2%",
        up: false,
        spark: [13.4, 13.2, 13.3, 13.1, 13.0, 13.2, 12.9, 13.0, 12.8, 12.9],
    },
    {
        name: "Elm Street Flats",
        location: "Fremont · 68 units",
        occ: 95,
        value: "$10.5M",
        delta: "+0.6%",
        up: true,
        spark: [9.4, 9.6, 9.5, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5],
    },
];

// One distinct street layout per property so the tiles don't all look alike.
// Indexes line up with HOLDINGS above.
type MapScene = { svg: ReactNode; pin: { left: string; top: string } };

const MAP_SCENES: MapScene[] = [
    // Lakeshore — waterfront: shoreline along the bottom, park up top.
    {
        svg: (
            <>
                <path
                    d="M-2 33 C 10 29, 20 37, 31 33 C 40 30, 46 33, 50 34 L50 50 L-2 50 Z"
                    fill="currentColor"
                    className="text-sky-300/50 dark:text-sky-900/50"
                />
                <rect x="4" y="5" width="12" height="9" rx="1.5" fill="currentColor" className="text-emerald-300/60 dark:text-emerald-800/50" />
                <g stroke="currentColor" fill="none" strokeLinecap="round" className="text-white/80 dark:text-gray-600/70">
                    <path d="M-2 22 H50" strokeWidth={3} />
                    <path d="M27 -2 V33" strokeWidth={3} />
                    <path d="M11 -2 V22" strokeWidth={1.5} />
                    <path d="M2 11 H50" strokeWidth={1.5} />
                </g>
            </>
        ),
        pin: { left: "56%", top: "34%" },
    },
    // Mission Court — downtown grid crossed by a diagonal boulevard.
    {
        svg: (
            <>
                <rect x="31" y="30" width="15" height="14" rx="1.5" fill="currentColor" className="text-emerald-300/55 dark:text-emerald-800/50" />
                <g stroke="currentColor" fill="none" strokeLinecap="round" className="text-white/80 dark:text-gray-600/70">
                    <path d="M-2 16 H50" strokeWidth={2.5} />
                    <path d="M-2 32 H50" strokeWidth={2.5} />
                    <path d="M16 -2 V50" strokeWidth={2.5} />
                    <path d="M33 -2 V50" strokeWidth={2.5} />
                    <path d="M0 -2 L50 48" strokeWidth={1.5} />
                </g>
            </>
        ),
        pin: { left: "33%", top: "33%" },
    },
    // Elm Street Flats — suburban: a big park, a pond, and a curving lane.
    {
        svg: (
            <>
                <rect x="27" y="6" width="19" height="17" rx="2" fill="currentColor" className="text-emerald-300/60 dark:text-emerald-800/50" />
                <circle cx="11" cy="39" r="7" fill="currentColor" className="text-sky-300/50 dark:text-sky-900/50" />
                <g stroke="currentColor" fill="none" strokeLinecap="round" className="text-white/80 dark:text-gray-600/70">
                    <path d="M-2 29 H50" strokeWidth={3} />
                    <path d="M22 -2 C 26 14, 16 22, 22 50" strokeWidth={2} />
                    <path d="M35 23 V50" strokeWidth={1.5} />
                </g>
            </>
        ),
        pin: { left: "46%", top: "62%" },
    },
];

// Hero: filled area chart of portfolio value over the last year, mirroring the
// ValuationProjectionChart SVG approach so the two tabs share a visual language.
function PortfolioAreaChart({ className }: { className?: string }) {
    const data = PORTFOLIO_SERIES;
    const width = 320;
    const height = 84;
    const pad = { top: 8, right: 2, bottom: 2, left: 2 };
    const iw = width - pad.left - pad.right;
    const ih = height - pad.top - pad.bottom;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const yPad = (max - min) * 0.2 || 0.1;
    const yMin = min - yPad;
    const yMax = max + yPad;

    const x = (i: number) => pad.left + (i / (data.length - 1)) * iw;
    const y = (v: number) => pad.top + ih - ((v - yMin) / (yMax - yMin)) * ih;

    const line = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    const area = `${line} L ${x(data.length - 1).toFixed(1)} ${pad.top + ih} L ${x(0).toFixed(1)} ${pad.top + ih} Z`;
    const lastX = x(data.length - 1);
    const lastY = y(data[data.length - 1]);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className={cn("h-auto w-full overflow-visible", className)} aria-label="Portfolio value over the last year">
            <defs>
                <linearGradient id="holdingsAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" className="text-blue-500/25 dark:text-blue-400/25" stopColor="currentColor" />
                    <stop offset="100%" className="text-blue-500/0 dark:text-blue-400/0" stopColor="currentColor" />
                </linearGradient>
            </defs>
            <path d={area} className="text-blue-500 dark:text-blue-400" fill="url(#holdingsAreaFill)" />
            <path
                d={line}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500 dark:text-blue-400"
            />
            <circle cx={lastX} cy={lastY} r={3.5} className="fill-blue-500 dark:fill-blue-400" />
            <circle cx={lastX} cy={lastY} r={6} className="fill-blue-500/20 dark:fill-blue-400/20" />
        </svg>
    );
}

// Small stylized "map" tile standing in for the property's location — a light
// street layout kept abstract so it stays crisp at this size rather than a
// muddy real map image. Each property gets its own scene (see MAP_SCENES).
function MiniMapTile({ scene }: { scene: MapScene }) {
    return (
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-[#e6ebf2] dark:border-gray-700 dark:bg-gray-800">
            <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden>
                {scene.svg}
            </svg>
            <div
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-orange-500 shadow-sm dark:border-gray-800"
                style={{ left: scene.pin.left, top: scene.pin.top }}
            />
        </div>
    );
}

function Sparkline({ points, up }: { points: number[]; up: boolean }) {
    const width = 40;
    const height = 16;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const x = (i: number) => (i / (points.length - 1)) * width;
    const y = (v: number) => height - ((v - min) / range) * height;
    const d = points.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-4 w-10 overflow-visible" aria-hidden>
            <path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={up ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}
            />
        </svg>
    );
}

function OccupancyBar({ pct }: { pct: number }) {
    return (
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400" style={{ width: `${pct}%` }} />
        </div>
    );
}

function StatTile({ label, value }: { label: string; value: string }) {
    return (
        <div className={cn(CARD, "p-4")}>
            <div className="text-base font-semibold text-gray-900 tabular-nums dark:text-gray-100">{value}</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</div>
        </div>
    );
}

export function HoldingsPreview() {
    return (
        <>
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <h2 className="text-base leading-none font-semibold text-gray-900 dark:text-gray-100">Portfolio</h2>
                <span className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    3 assets
                </span>
            </div>

            {/* Hero — portfolio value + trend chart, the visual anchor for the tab. */}
            <div className={cn(CARD, "p-4")}>
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Portfolio value</div>
                        <div className="mt-1 text-2xl font-semibold text-gray-900 tabular-nums dark:text-gray-100">$38.2M</div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 tabular-nums dark:bg-emerald-900/20 dark:text-emerald-400">
                            +6.2%
                        </span>
                        <div className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">vs. last year</div>
                    </div>
                </div>
                <PortfolioAreaChart className="mt-3" />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
                <StatTile value="248" label="Total units" />
                <StatTile value="94%" label="Avg occupancy" />
                <StatTile value="$2.1M" label="Annual NOI" />
            </div>

            <div className="space-y-2.5">
                {HOLDINGS.map((h, i) => (
                    <div key={h.name} className={cn("flex items-center gap-3 p-3", CARD)}>
                        <MiniMapTile scene={MAP_SCENES[i]} />
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{h.name}</div>
                            <div className="truncate text-xs text-gray-500 dark:text-gray-400">{h.location}</div>
                            <div className="mt-1.5 flex items-center gap-1.5">
                                <OccupancyBar pct={h.occ} />
                                <span className="w-8 shrink-0 text-right text-[10px] text-gray-400 tabular-nums dark:text-gray-500">{h.occ}%</span>
                            </div>
                        </div>
                        <div className="shrink-0 text-right">
                            <div className="text-sm font-semibold text-gray-900 tabular-nums dark:text-gray-100">{h.value}</div>
                            <div className="mt-1 flex items-center justify-end gap-1">
                                <Sparkline points={h.spark} up={h.up} />
                                <span
                                    className={cn(
                                        "text-[10px] font-semibold tabular-nums",
                                        h.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                                    )}
                                >
                                    {h.delta}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
