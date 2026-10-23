"use client";

import { ChevronDown, Download, FileSpreadsheet, FileText, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/analytics/filters/segmented-control";
import { cn } from "@/lib/utils";
import { BrowserWindow } from "./browser-window";
import type { LeadsMapPin } from "./leads-listings-map";
import { SignupCtaButton } from "./signup-cta";

const LeadsListingsMap = dynamic(() => import("./leads-listings-map").then((mod) => mod.LeadsListingsMap), { ssr: false });

// Stripe Checkout-style scrollytelling: copy scrolls on the left while a sticky
// mockup on the right swaps to match the step crossing the middle of the
// viewport. Below `lg` each mockup renders inline under its step instead.
// Mockups mirror the real app screens (same tables, controls, and copy) so they
// read as product screenshots, not illustrations.

const LEADS_BENEFITS = [
    {
        feature: "Rent survey",
        title: "Open the conversation with a rent survey for their building",
        body: "Enter an address and get low, median, and high rent by unit type plus top comps. Add the Rent Gap PDF to show the owner their rent upside.",
        url: "app.openmidmarket.com/analytics/rent-survey",
        Mockup: RentSurveyMockup,
    },
    {
        feature: "Rent charts",
        title: "Stay top of mind with market updates",
        body: "Send rent trends by area and comps in PDF or Excel, or pull them up on a live client call.",
        url: "app.openmidmarket.com/analytics/rent-trends",
        Mockup: MarketUpdateMockup,
    },
    {
        feature: "Sales listings",
        title: "Find buildings and buyers for your clients",
        body: "Search the listings map and OMs by brokerage, then see who bought nearby with named buyers on sales comps.",
        url: "app.openmidmarket.com/analytics/map",
        Mockup: ListingsBuyersMockup,
    },
] as const;

type Benefit = (typeof LEADS_BENEFITS)[number];

const PANEL = "rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";
const TH = "px-2 py-1.5 text-[9px] font-semibold tracking-wide text-gray-500 uppercase";
const GREEN = "text-green-700 dark:text-green-300";
const noop = () => {};

export function LeadsBenefits() {
    const [active, setActive] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const update = () => {
            const mid = window.innerHeight / 2;
            let next = 0;
            stepRefs.current.forEach((el, i) => {
                if (el && el.getBoundingClientRect().top <= mid) next = i;
            });
            setActive(next);
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    return (
        <section className="bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
                <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">FOR CRE BROKERS</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">From first call to closed deal</h2>

                <div className="mt-12 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
                    <div>
                        {LEADS_BENEFITS.map((item, i) => (
                            <div
                                key={item.title}
                                ref={(el) => {
                                    stepRefs.current[i] = el;
                                }}
                                className="pb-20 last:pb-0 lg:flex lg:min-h-[85vh] lg:flex-col lg:justify-center lg:pb-0"
                            >
                                <div className={cn("transition-opacity duration-500", active !== i && "lg:opacity-30")}>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.feature}</p>
                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{item.title}</h3>
                                    <p className="mt-3 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{item.body}</p>
                                </div>

                                <div className="mt-8 lg:hidden">
                                    <MockupFrame item={item} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:block">
                        <div className="sticky top-[calc(50vh-16rem)] h-[34rem]">
                            {LEADS_BENEFITS.map((item, i) => (
                                <div
                                    key={item.title}
                                    aria-hidden={active !== i}
                                    className={cn(
                                        "absolute inset-0 transition-all duration-500 ease-out",
                                        active === i ? "translate-y-0 opacity-100" : "pointer-events-none opacity-0",
                                        active < i && "translate-y-6",
                                        active > i && "-translate-y-6",
                                    )}
                                >
                                    <MockupFrame item={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex justify-center">
                    <SignupCtaButton trackingLocation="value_pillars_get_started" />
                </div>
            </div>
        </section>
    );
}

function MockupFrame({ item }: { item: Benefit }) {
    return (
        <BrowserWindow url={item.url} className="flex h-full flex-col">
            <div className="flex min-h-0 flex-1 flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                <item.Mockup />
            </div>
        </BrowserWindow>
    );
}

function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
    return (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-semibold">{title}</p>
            <div className="flex items-center gap-2">{children}</div>
        </div>
    );
}

function MockSelect({ label, value }: { label?: string; value: string }) {
    return (
        <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 text-xs dark:border-gray-700 dark:bg-gray-800">
            {label ? <span className="text-gray-500 dark:text-gray-400">{label}</span> : null}
            <span className="font-medium">{value}</span>
            <ChevronDown className="size-3.5 text-gray-400" />
        </span>
    );
}

function OutlineButton({ icon: Icon, children }: { icon: typeof Download; children: React.ReactNode }) {
    return (
        <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-800">
            <Icon className="size-3.5" />
            {children}
        </span>
    );
}

/* 1. Rent survey: survey by unit type, what it takes to hit top rent, Rent Gap PDF */

const SURVEY_ROWS = [
    {
        type: "Studio",
        low: "$2,425",
        median: "$2,695",
        high: "$2,960",
        comps: 11,
    },
    { type: "1 bed", low: "$2,850", median: "$3,150", high: "$3,495", comps: 23 },
    { type: "2 bed", low: "$3,575", median: "$3,975", high: "$4,410", comps: 17 },
    { type: "3 bed", low: "$4,480", median: "$4,890", high: "$5,325", comps: 6 },
];

const TOP_RENT_STEPS = [
    {
        title: "Renovate the kitchen and bath",
        detail: "All three top-rent comps have quartz counters and new baths.",
        extra: "+$275 / mo",
    },
    {
        title: "Add in-unit washer/dryer",
        detail: "Every top-rent comp lists in-unit laundry.",
        extra: "+$180 / mo",
    },
    {
        title: "Add central air",
        detail: "Two of three top-rent comps advertise central air.",
        extra: "+$125 / mo",
    },
];

function RentSurveyMockup() {
    return (
        <>
            <PageHeader title="Rent survey">
                <OutlineButton icon={Download}>Rent Gap PDF</OutlineButton>
            </PageHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden p-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 text-xs dark:border-gray-700 dark:bg-gray-800">
                        <Search className="size-3.5 shrink-0 text-gray-400" />
                        <span className="truncate">1450 Floribunda Ave, Burlingame, CA 94010</span>
                    </div>
                    <span className="inline-flex h-8 shrink-0 items-center rounded-md bg-blue-600 px-3 text-xs font-medium text-white">Run survey</span>
                </div>

                <div className={cn(PANEL, "overflow-hidden")}>
                    <div className="flex items-baseline justify-between border-b border-gray-100 px-3 py-2 dark:border-gray-700">
                        <p className="text-xs font-semibold">Survey by unit type</p>
                        <p className="text-[10px] text-gray-500">57 comps · 1 mi radius</p>
                    </div>
                    <table className="w-full text-left text-[11px] tabular-nums">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30">
                                <th className={TH}>Unit</th>
                                <th className={cn(TH, "text-right")}>Low</th>
                                <th className={cn(TH, "text-right")}>Median</th>
                                <th className={cn(TH, "text-right")}>High</th>
                                <th className={cn(TH, "text-right")}>Comps</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SURVEY_ROWS.map((row) => (
                                <tr key={row.type} className="border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                                    <td className="px-2 py-1.5 font-medium">{row.type}</td>
                                    <td className="px-2 py-1.5 text-right text-gray-700 dark:text-gray-300">{row.low}</td>
                                    <td className="px-2 py-1.5 text-right font-medium">{row.median}</td>
                                    <td className="px-2 py-1.5 text-right text-gray-700 dark:text-gray-300">{row.high}</td>
                                    <td className="px-2 py-1.5 text-right text-gray-500">{row.comps}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-2.5 sm:flex-row">
                    <div className={cn(PANEL, "min-h-0 flex-1 px-3 py-2.5")}>
                        <div className="flex items-baseline justify-between gap-2">
                            <p className="text-xs font-semibold">What it takes to hit top rent</p>
                            <p className="text-[10px] text-gray-500">1 bed · top comps at $3,495</p>
                        </div>
                        <ul className="mt-1 divide-y divide-gray-100 dark:divide-gray-700">
                            {TOP_RENT_STEPS.map((step) => (
                                <li key={step.title} className="flex items-start justify-between gap-3 py-1.5">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200">{step.title}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{step.detail}</p>
                                    </div>
                                    <span className={cn("shrink-0 text-[11px] font-medium tabular-nums", GREEN)}>{step.extra}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <RentGapPdfPreview />
                </div>
            </div>
        </>
    );
}

const PDF_ROWS = [
    {
        type: "Studio",
        units: 4,
        current: "$2,150",
        market: "$2,695",
        gap: "+$545",
        annual: "+$26,160",
    },
    {
        type: "1 bd / 1 ba",
        units: 12,
        current: "$2,475",
        market: "$3,150",
        gap: "+$675",
        annual: "+$97,200",
    },
    {
        type: "2 bd / 1 ba",
        units: 8,
        current: "$3,100",
        market: "$3,975",
        gap: "+$875",
        annual: "+$84,000",
    },
];

const PDF_KPIS = [
    { label: "Current rent / mo", value: "$63,100" },
    { label: "Market rent / mo", value: "$80,380" },
    { label: "Loss to lease / unit", value: "+$720" },
    { label: "Annual loss to lease", value: "+$207,360" },
];

// Thumbnail of the one-page owner export (rent-gap-owner-export in the app).
// The page is laid out at letter proportions with readable type, then scaled
// down, so it reads as a real document rather than a stylized card.
function RentGapPdfPreview() {
    return (
        <div className="flex shrink-0 flex-col items-center gap-1.5">
            <div className="h-[176px] w-[136px] overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-gray-600">
                <div className="w-[340px] origin-top-left scale-[0.4] p-6 text-[10px] text-gray-900">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <span className="flex items-center gap-1.5 font-semibold">
                            <span className="rounded bg-blue-900 px-1 py-0.5 text-[8px] font-bold text-white">OM</span>
                            Openmidmarket
                        </span>
                        <span className="text-right text-[8px] leading-tight text-gray-500">
                            Rent opportunity
                            <br />
                            Oct 23, 2026
                        </span>
                    </div>
                    <p className="mt-3 text-[15px] font-semibold tracking-tight">1450 Floribunda Ave</p>
                    <p className="mt-0.5 text-[8px] text-gray-500">Current rents are below the market · Market rents from Burlingame · 24 units</p>
                    <p className="mt-2 text-[10px] leading-snug font-semibold">
                        If rents were brought to market, that extra income would add about $3,912,453 of value at a 5.3% cap rate for San Mateo County.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                        {PDF_KPIS.map((kpi) => (
                            <div key={kpi.label} className="rounded border border-gray-200 px-2 py-1.5">
                                <p className="text-[7px] font-semibold tracking-wide text-gray-500 uppercase">{kpi.label}</p>
                                <p className="mt-0.5 text-[13px] font-semibold tabular-nums">{kpi.value}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-[10px] font-semibold">By unit type</p>
                    <table className="mt-1 w-full text-left text-[7.5px] tabular-nums">
                        <thead className="text-gray-500">
                            <tr className="border-b border-gray-200">
                                <th className="py-1 font-medium">Unit type</th>
                                <th className="py-1 font-medium">Units</th>
                                <th className="py-1 font-medium">Current</th>
                                <th className="py-1 font-medium">Market</th>
                                <th className="py-1 font-medium">Gap / unit</th>
                                <th className="py-1 text-right font-medium">Annual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PDF_ROWS.map((row) => (
                                <tr key={row.type} className="border-b border-gray-100">
                                    <td className="py-1">{row.type}</td>
                                    <td className="py-1">{row.units}</td>
                                    <td className="py-1">{row.current}</td>
                                    <td className="py-1">{row.market}</td>
                                    <td className="py-1">{row.gap}</td>
                                    <td className="py-1 text-right">{row.annual}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-2 text-[7px] text-gray-500">Prepared for the property owner. Based on 57 nearby rentals across 3 unit types.</p>
                </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                <FileText className="size-3" />
                Rent Gap · 1 page
            </span>
        </div>
    );
}

/* 2. Market updates: rent charts by area with export */

const TREND_1BR = [2980, 3010, 2995, 3040, 3075, 3060, 3095, 3120, 3110, 3140, 3165, 3150];
const TREND_2BR = [3720, 3745, 3780, 3760, 3810, 3850, 3835, 3880, 3905, 3930, 3955, 3975];
const MONTH_TICKS = ["Nov '25", "Jan", "Mar", "May", "Jul", "Sep '26"];
const CHART = { w: 400, h: 160, min: 2800, max: 4200 };
const HOVER_INDEX = 8;

function chartY(v: number) {
    return CHART.h - ((v - CHART.min) / (CHART.max - CHART.min)) * CHART.h;
}

function linePath(values: readonly number[]) {
    return values.map((v, i) => `${i === 0 ? "M" : "L"}${((i / (values.length - 1)) * CHART.w).toFixed(1)},${chartY(v).toFixed(1)}`).join(" ");
}

function MarketUpdateMockup() {
    const hoverX = (HOVER_INDEX / (TREND_2BR.length - 1)) * 100;

    return (
        <>
            <PageHeader title="Rent charts">
                <OutlineButton icon={Download}>Export</OutlineButton>
            </PageHeader>
            <div className="relative flex min-h-0 flex-1 flex-col gap-2.5 p-3">
                <div className="flex flex-wrap items-center gap-2">
                    <MockSelect label="Area" value="Burlingame" />
                    <MockSelect label="Beds" value="1, 2" />
                    <SegmentedControl
                        size="sm"
                        ariaLabel="Interval"
                        options={[
                            { value: "monthly", label: "Monthly" },
                            { value: "quarterly", label: "Quarterly" },
                        ]}
                        value="monthly"
                        onChange={noop}
                    />
                </div>

                <div className={cn(PANEL, "flex min-h-0 flex-1 flex-col p-3")}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold">Median asking rent</p>
                            <p className="text-[10px] text-gray-500">Burlingame, CA · 142 active listings</p>
                        </div>
                        <div className="flex gap-3 text-[10px] text-gray-600 dark:text-gray-300">
                            <span className="flex items-center gap-1">
                                <span className="h-0.5 w-3 rounded bg-blue-600" />2 bed
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-0.5 w-3 rounded bg-teal-500" />1 bed
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 flex min-h-40 flex-1 gap-2 lg:min-h-0">
                        <div className="flex flex-col justify-between pb-4 text-[9px] text-gray-400 tabular-nums">
                            <span>$4,200</span>
                            <span>$3,500</span>
                            <span>$2,800</span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="relative min-h-0 flex-1">
                                <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className="absolute inset-0 size-full" preserveAspectRatio="none" aria-hidden>
                                    {[0, 0.5, 1].map((t) => (
                                        <line
                                            key={t}
                                            x1={0}
                                            x2={CHART.w}
                                            y1={t * CHART.h}
                                            y2={t * CHART.h}
                                            strokeDasharray="3 3"
                                            className="stroke-gray-200 dark:stroke-gray-700"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    ))}
                                    <path d={linePath(TREND_2BR)} fill="none" strokeWidth={2} className="stroke-blue-600" vectorEffect="non-scaling-stroke" />
                                    <path d={linePath(TREND_1BR)} fill="none" strokeWidth={2} className="stroke-teal-500" vectorEffect="non-scaling-stroke" />
                                </svg>
                                {/* Hover cursor + tooltip, like the real chart mid-interaction */}
                                <div className="absolute inset-y-0 w-px bg-gray-300 dark:bg-gray-600" style={{ left: `${hoverX}%` }} />
                                <div
                                    className="absolute top-1 -translate-x-[calc(100%+8px)] rounded-md whitespace-nowrap border border-gray-200 bg-white px-2 py-1.5 text-[10px] shadow-sm dark:border-gray-700 dark:bg-gray-900"
                                    style={{ left: `${hoverX}%` }}
                                >
                                    <p className="font-medium">Jul 2026</p>
                                    <p className="mt-0.5 flex justify-between gap-3 tabular-nums">
                                        <span className="text-gray-500">2 bed</span>$3,905
                                    </p>
                                    <p className="flex justify-between gap-3 tabular-nums">
                                        <span className="text-gray-500">1 bed</span>$3,110
                                    </p>
                                </div>
                            </div>
                            <div className="mt-1 flex justify-between text-[9px] text-gray-400">
                                {MONTH_TICKS.map((m) => (
                                    <span key={m}>{m}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-2.5 dark:border-gray-700">
                        <MiniStat label="2 bed median" value="$3,975" />
                        <MiniStat label="12-mo change" value="+6.9%" positive />
                        <MiniStat label="Median days listed" value="21" />
                    </div>
                </div>

                {/* Export menu, open under the header button */}
                <div className="absolute -top-1 right-3 z-10 hidden w-48 lg:block rounded-md border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-2 rounded px-2 py-1.5 text-xs">
                        <FileText className="size-3.5 text-gray-500" />
                        Market update (PDF)
                    </div>
                    <div className="flex items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-xs dark:bg-gray-700">
                        <FileSpreadsheet className="size-3.5 text-gray-500" />
                        Rent comps (Excel)
                    </div>
                </div>
            </div>
        </>
    );
}

function MiniStat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
    return (
        <div>
            <p className="text-[10px] text-gray-500">{label}</p>
            <p className={cn("text-sm font-semibold tabular-nums", positive && GREEN)}>{value}</p>
        </div>
    );
}

/* 3. Sales listings map filtered by brokerage, OM, and named buyers on nearby sales */

const MAP_CENTER: [number, number] = [-122.1555, 37.4415];

const MAP_PINS: LeadsMapPin[] = [
    {
        coordinates: [-122.161, 37.445],
        color: "#2563eb",
        kind: "listing",
        selected: true,
    },
    { coordinates: [-122.158, 37.439], color: "#2563eb", kind: "listing" },
    { coordinates: [-122.1668, 37.4486], color: "#2563eb", kind: "listing" },
    { coordinates: [-122.148, 37.4318], color: "#2563eb", kind: "listing" },
    { coordinates: [-122.1445, 37.4462], color: "#2563eb", kind: "listing" },
    { coordinates: [-122.1572, 37.4478], color: "#15803d", kind: "sale" },
    { coordinates: [-122.1641, 37.4428], color: "#15803d", kind: "sale" },
];

const NEARBY_SALES = [
    {
        at: "330 Hamilton Ave",
        detail: "18 units · $4.2M · Jun 2026",
        buyer: "Alder Street Capital LLC",
    },
    {
        at: "610 Waverley St",
        detail: "12 units · $2.7M · Mar 2026",
        buyer: "Mendoza Family Trust",
    },
];

function ListingsBuyersMockup() {
    return (
        <>
            <PageHeader title="Sales listings">
                <SegmentedControl
                    size="sm"
                    ariaLabel="Listing type"
                    options={[
                        { value: "rent", label: "Rent" },
                        { value: "sales", label: "Sales" },
                    ]}
                    value="sales"
                    onChange={noop}
                />
            </PageHeader>
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                <MockSelect label="City" value="Palo Alto, CA" />
                <MockSelect label="Brokerage" value="Bayline Realty" />
                <span className="ml-auto text-[10px] text-gray-500">5 listings · 2 sold nearby</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
                <div className="relative h-56 min-w-0 sm:h-auto sm:flex-1">
                    <LeadsListingsMap pins={MAP_PINS} center={MAP_CENTER} zoom={13.5} />
                </div>
                <aside className="shrink-0 space-y-3 overflow-hidden border-t border-gray-200 bg-white p-3 sm:w-56 sm:border-t-0 sm:border-l dark:border-gray-800 dark:bg-gray-900">
                    <div>
                        <p className="text-xs font-semibold">421 University Ave</p>
                        <p className="text-[10px] text-gray-500">Palo Alto, CA · 32 units</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                                <p className="text-gray-500">Asking</p>
                                <p className="text-xs font-semibold tabular-nums">$5,800,000</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Cap rate</p>
                                <p className="text-xs font-semibold tabular-nums">5.0%</p>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 dark:border-gray-700">
                            <FileText className="size-3.5 shrink-0 text-gray-500" />
                            <div className="min-w-0">
                                <p className="truncate text-[11px] font-medium">Offering memorandum</p>
                                <p className="truncate text-[9px] text-gray-500">Bayline Realty · 38 pages</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-500 uppercase">Sold within 0.5 mi</p>
                        <ul className="mt-1.5 space-y-2">
                            {NEARBY_SALES.map((sale) => (
                                <li key={sale.at}>
                                    <p className="text-[11px] font-medium">{sale.at}</p>
                                    <p className="text-[10px] text-gray-500 tabular-nums">{sale.detail}</p>
                                    <p className="text-[10px]">
                                        <span className="text-gray-500">Buyer: </span>
                                        <span className="font-medium text-blue-700 dark:text-blue-400">{sale.buyer}</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </>
    );
}
