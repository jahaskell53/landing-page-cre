"use client";

export interface IrrProjectionPoint {
    year: number;
    irr: number;
}

interface IrrProjectionChartProps {
    /** Current/base IRR % (used to generate projection) */
    currentIrr: number;
    /** Number of years to project (default 5) */
    years?: number;
    className?: string;
    /** Chart height in pixels */
    height?: number;
}

/** Generates mock IRR projection over time (slight upward trend from current) */
function buildProjection(currentIrr: number, years: number): IrrProjectionPoint[] {
    return Array.from({ length: years }, (_, i) => ({
        year: i + 1,
        irr: Math.round((currentIrr + i * 0.4 + (i > 0 ? 0.2 : 0)) * 10) / 10,
    }));
}

const PAD = { top: 8, right: 8, bottom: 24, left: 44 };

export interface ValuationProjectionPoint {
    year: number;
    valueM: number;
}

interface ValuationProjectionChartProps {
    /** Current estimated value in millions */
    currentValueM: number;
    years?: number;
    className?: string;
    height?: number;
}

/** Mock valuation history ending at the current estimate (slight upward trend). */
function buildValuationProjection(currentValueM: number, years: number): ValuationProjectionPoint[] {
    const step = 0.12;
    return Array.from({ length: years }, (_, i) => ({
        year: i + 1,
        valueM: Math.round((currentValueM - (years - 1 - i) * step) * 10) / 10,
    }));
}

function formatValueM(valueM: number): string {
    return `$${valueM.toFixed(1)}M`;
}

export function ValuationProjectionChart({ currentValueM, years = 5, className = "", height = 160 }: ValuationProjectionChartProps) {
    const data = buildValuationProjection(currentValueM, years);
    const width = 320;
    const innerWidth = width - PAD.left - PAD.right;
    const innerHeight = height - PAD.top - PAD.bottom;

    const valueMin = Math.min(...data.map((d) => d.valueM));
    const valueMax = Math.max(...data.map((d) => d.valueM));
    const yPadding = (valueMax - valueMin) * 0.15 || 0.1;
    const yMin = Math.round((valueMin - yPadding) * 10) / 10;
    const yMax = Math.round((valueMax + yPadding) * 10) / 10;

    const xScale = (year: number) => PAD.left + ((year - 1) / (years - 1 || 1)) * innerWidth;
    const yScale = (valueM: number) => PAD.top + innerHeight - ((valueM - yMin) / (yMax - yMin)) * innerHeight;

    const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)} ${yScale(d.valueM)}`).join(" ");

    return (
        <div className={className}>
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Valuation projection</p>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible" aria-label="Estimated value over time">
                {[yMin, (yMin + yMax) / 2, yMax].map((v) => (
                    <text
                        key={v}
                        x={PAD.left - 6}
                        y={yScale(v)}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="fill-gray-500 text-[10px] dark:fill-gray-400"
                    >
                        {formatValueM(v)}
                    </text>
                ))}
                {data.map((d) => (
                    <text key={d.year} x={xScale(d.year)} y={height - 6} textAnchor="middle" className="fill-gray-500 text-[10px] dark:fill-gray-400">
                        Y{d.year}
                    </text>
                ))}
                <path
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500 dark:text-blue-400"
                />
                {data.map((d) => (
                    <circle key={d.year} cx={xScale(d.year)} cy={yScale(d.valueM)} r={3} className="fill-blue-500 dark:fill-blue-400" />
                ))}
            </svg>
        </div>
    );
}

// ---- Value-add valuation: projected value + NOI with milestone flags ----
//
// Two stacked panels share one timeline so cause-and-effect reads directly:
// a reno completes -> NOI steps up -> value follows. Deliberately NOT a
// dual-axis overlay (value ~$4M vs NOI ~$250k live on different scales, and a
// shared frame with two y-axes can imply any correlation you like).

export interface ValueAddEvent {
    /** Display order + pin number on the timeline. */
    n: number;
    name: string;
    detail: string;
    /** Quarter (1-20) work begins and completes. */
    start: number;
    end: number;
    /** Annualized NOI lift ($k) once complete. */
    noi: number;
    /** Human timeframe for the plan list. */
    when: string;
}

export const VALUE_ADD_PLAN: ValueAddEvent[] = [
    { n: 1, name: "Kitchen renovations", detail: "+$150/mo · 12 units", start: 2, end: 5, noi: 18, when: "Y1 Q2 → Y2 Q1" },
    { n: 2, name: "Add in-unit laundry", detail: "+$95/mo · 11 units", start: 7, end: 9, noi: 12, when: "Y2 Q3 → Y3 Q1" },
    { n: 3, name: "Re-lease to market rents", detail: "8 units rolled up", start: 12, end: 12, noi: 22, when: "Y3 Q4" },
];

const VA_CAP_RATE = 0.053;
const VA_QUARTERS = 20;
const VA_BASE_NOI = 223; // $k annualized at "Now"
const VA_MARKET_DRIFT = 0.9; // $k NOI/quarter from background market rent growth

/** Annualized NOI ($k) and derived value ($M) per quarter, stepping up as each value-add completes. */
function buildValueAddSeries() {
    const noi: number[] = [];
    const value: number[] = [];
    for (let q = 0; q <= VA_QUARTERS; q++) {
        let n = VA_BASE_NOI + q * VA_MARKET_DRIFT;
        for (const e of VALUE_ADD_PLAN) if (q >= e.end) n += e.noi;
        noi.push(n);
        value.push(n / VA_CAP_RATE / 1000);
    }
    return { noi, value };
}

interface VaBand {
    y: (v: number) => number;
    ticks: number[];
}
function makeBand(vals: number[], top: number, bottom: number, padFrac: number): VaBand {
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = (hi - lo) * padFrac || 1;
    const min = lo - pad;
    const max = hi + pad;
    return {
        y: (v: number) => bottom - ((v - min) / (max - min)) * (bottom - top),
        ticks: [min, (min + max) / 2, max],
    };
}

export function ValueAddProjectionChart({ className = "" }: { className?: string }) {
    const { noi, value } = buildValueAddSeries();
    const width = 400;
    const height = 288;
    const padL = 40;
    const padR = 10;
    const xOf = (q: number) => padL + (q / VA_QUARTERS) * (width - padL - padR);

    // Two plot bands: value on top, NOI beneath, sharing the x-axis.
    const vTop = 28;
    const vBot = 150;
    const nTop = 186;
    const nBot = 262;
    const vBand = makeBand(value, vTop, vBot, 0.22);
    const nBand = makeBand(noi, nTop, nBot, 0.28);

    const vLine = value.map((v, i) => `${i ? "L" : "M"}${xOf(i).toFixed(1)} ${vBand.y(v).toFixed(1)}`).join(" ");
    const vArea = `${vLine} L${xOf(VA_QUARTERS).toFixed(1)} ${vBot} L${xOf(0).toFixed(1)} ${vBot} Z`;
    // NOI as a stepped line so each completion reads as a discrete jump.
    let nStep = "";
    noi.forEach((v, i) => {
        const x = xOf(i).toFixed(1);
        if (i === 0) nStep += `M${x} ${nBand.y(v).toFixed(1)}`;
        else nStep += ` L${x} ${nBand.y(noi[i - 1]).toFixed(1)} L${x} ${nBand.y(v).toFixed(1)}`;
    });

    const xTicks = ["Now", "Y1", "Y2", "Y3", "Y4", "Y5"];

    return (
        <div className={className}>
            <div className="mb-3 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="h-0.5 w-4 rounded-full bg-blue-500 dark:bg-blue-400" />
                    Est. value
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="h-0.5 w-4 rounded-full bg-[#2f855a] dark:bg-[#38a06e]" />
                    NOI
                </span>
            </div>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full overflow-visible"
                aria-label="Projected value and NOI over five years with value-add milestones marked"
            >
                {/* Grid + y-axis labels — value panel ($M) */}
                {vBand.ticks.map((t, i) => (
                    <g key={`vg${i}`}>
                        <line x1={padL} y1={vBand.y(t)} x2={width - padR} y2={vBand.y(t)} stroke="currentColor" strokeWidth={1} className="text-gray-200 dark:text-gray-700" />
                        <text x={padL - 6} y={vBand.y(t) + 3} textAnchor="end" className="fill-gray-500 text-[9px] dark:fill-gray-400">
                            ${t.toFixed(1)}M
                        </text>
                    </g>
                ))}
                {/* Grid + y-axis labels — NOI panel ($k) */}
                {nBand.ticks.map((t, i) => (
                    <g key={`ng${i}`}>
                        <line x1={padL} y1={nBand.y(t)} x2={width - padR} y2={nBand.y(t)} stroke="currentColor" strokeWidth={1} className="text-gray-200 dark:text-gray-700" />
                        <text x={padL - 6} y={nBand.y(t) + 3} textAnchor="end" className="fill-gray-500 text-[9px] dark:fill-gray-400">
                            ${Math.round(t)}k
                        </text>
                    </g>
                ))}

                {/* Construction bands + guides spanning both panels */}
                {VALUE_ADD_PLAN.map((e) => {
                    const xs = xOf(e.start);
                    const xe = xOf(e.end);
                    return (
                        <g key={`band${e.n}`}>
                            {xe > xs && (
                                <rect x={xs} y={vTop} width={xe - xs} height={nBot - vTop} rx={2} fill="currentColor" className="text-gray-900/5 dark:text-white/[0.06]" />
                            )}
                            <line x1={xs} y1={vTop - 6} x2={xs} y2={nBot} stroke="currentColor" strokeWidth={1} strokeDasharray="2 3" className="text-gray-400 dark:text-gray-500" />
                        </g>
                    );
                })}

                {/* Value area + line */}
                <path d={vArea} fill="currentColor" className="text-blue-500/10 dark:text-blue-400/10" />
                <path d={vLine} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-400" />
                <circle cx={xOf(VA_QUARTERS)} cy={vBand.y(value[VA_QUARTERS])} r={5.5} fill="currentColor" className="text-blue-500/20 dark:text-blue-400/20" />
                <circle cx={xOf(VA_QUARTERS)} cy={vBand.y(value[VA_QUARTERS])} r={3} fill="currentColor" className="text-blue-500 dark:text-blue-400" />

                {/* NOI stepped line */}
                <path d={nStep} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-[#2f855a] dark:text-[#38a06e]" />
                <circle cx={xOf(VA_QUARTERS)} cy={nBand.y(noi[VA_QUARTERS])} r={3} fill="currentColor" className="text-[#2f855a] dark:text-[#38a06e]" />

                {/* X-axis labels */}
                {xTicks.map((lab, i) => (
                    <text key={lab} x={xOf(i * 4)} y={nBot + 16} textAnchor="middle" className="fill-gray-500 text-[9px] dark:fill-gray-400">
                        {lab}
                    </text>
                ))}

                {/* Milestone flags — filled, numbered pins keyed to the plan list */}
                {VALUE_ADD_PLAN.map((e) => {
                    const xs = xOf(e.start);
                    return (
                        <g key={`pin${e.n}`}>
                            <circle cx={xs} cy={12} r={8} fill="currentColor" className="text-gray-900 dark:text-gray-100" />
                            <text x={xs} y={12} textAnchor="middle" dominantBaseline="central" className="fill-white text-[9px] font-bold dark:fill-gray-900">
                                {e.n}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

const IRR_PAD = { top: 8, right: 8, bottom: 24, left: 36 };

export function IrrProjectionChart({ currentIrr, years = 5, className = "", height = 160 }: IrrProjectionChartProps) {
    const data = buildProjection(currentIrr, years);
    const width = 280;
    const innerWidth = width - IRR_PAD.left - IRR_PAD.right;
    const innerHeight = height - IRR_PAD.top - IRR_PAD.bottom;

    const irrMin = Math.min(...data.map((d) => d.irr));
    const irrMax = Math.max(...data.map((d) => d.irr));
    const yPadding = (irrMax - irrMin) * 0.15 || 1;
    const yMin = Math.floor(irrMin - yPadding);
    const yMax = Math.ceil(irrMax + yPadding);

    const xScale = (year: number) => IRR_PAD.left + ((year - 1) / (years - 1 || 1)) * innerWidth;
    const yScale = (irr: number) => IRR_PAD.top + innerHeight - ((irr - yMin) / (yMax - yMin)) * innerHeight;

    const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)} ${yScale(d.irr)}`).join(" ");

    return (
        <div className={className}>
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">IRR projection</p>
            <svg width={width} height={height} className="overflow-visible" aria-label="IRR over time">
                {/* Y axis labels */}
                {[yMin, (yMin + yMax) / 2, yMax].map((v) => (
                    <text
                        key={v}
                        x={IRR_PAD.left - 6}
                        y={yScale(v)}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="fill-gray-500 text-[10px] dark:fill-gray-400"
                    >
                        {v}%
                    </text>
                ))}
                {/* X axis labels */}
                {data.map((d) => (
                    <text key={d.year} x={xScale(d.year)} y={height - 6} textAnchor="middle" className="fill-gray-500 text-[10px] dark:fill-gray-400">
                        Y{d.year}
                    </text>
                ))}
                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500 dark:text-blue-400"
                />
                {/* Dots at data points */}
                {data.map((d) => (
                    <circle key={d.year} cx={xScale(d.year)} cy={yScale(d.irr)} r={3} className="fill-blue-500 dark:fill-blue-400" />
                ))}
            </svg>
        </div>
    );
}
