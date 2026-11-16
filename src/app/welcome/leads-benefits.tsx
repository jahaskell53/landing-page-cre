"use client";

import { Bell, ChevronDown, ChevronLeft, ChevronRight, Download, FileSpreadsheet, FileText } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/analytics/filters/segmented-control";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BrowserWindow } from "./browser-window";
import { SignupCtaButton } from "./signup-cta";

// Stripe Checkout-style scrollytelling: copy scrolls on the left while a sticky
// mockup on the right swaps to match the step crossing the middle of the
// viewport. Below `lg` each mockup renders inline under its step instead.
// Mockups mirror the real app screens (same tables, controls, and copy) so they
// read as product screenshots, not illustrations.

type Benefit = {
    feature: string;
    title: string;
    body: string;
    url: string;
    Mockup: React.ComponentType;
};

const LEADS_BENEFITS: readonly Benefit[] = [
    {
        feature: "Rent comps",
        title: "Open the conversation with vetted rent comps for their building",
        body: "Enter an address to pull nearby comps ranked by condition, quality, amenities, and location, plus a market rent estimate and a Comps PDF.",
        url: "app.openmidmarket.com/analytics/rent-comps",
        Mockup: RentCompsMockup,
    },
    {
        feature: "Rent charts",
        title: "Stay top of mind with market updates",
        body: "Send rent trends by area and comps in PDF or Excel, or pull them up on a live client call.",
        url: "app.openmidmarket.com/analytics/rent-trends",
        Mockup: MarketUpdateMockup,
    },
    {
        feature: "Listing alerts",
        title: "Find buildings and buyers for your clients",
        body: "Luna watches your submarkets for new listings that fit a price range, unit count, or vintage, then names the buyers most likely to want them based on what they have bought before.",
        url: "app.openmidmarket.com/alerts",
        Mockup: BrokerListingAlertsMockup,
    },
];

const INVESTOR_BENEFITS: readonly Benefit[] = [
    {
        feature: "Rent comps",
        title: "Know the true rent upside before you tour",
        body: "Drop in any address to search 580,000+ rent comps and get an instant market rent estimate, with the top 5 comps scored on condition, finishes, amenities, and block-level location.",
        url: "app.openmidmarket.com/analytics/rent-comps",
        Mockup: RentCompsMockup,
    },
    {
        feature: "Market trends",
        title: "Back every IC memo with live submarket data",
        body: "Track rent growth, concessions, and comp velocity across neighborhoods, then export clean PDF or Excel decks straight into your underwriting and LP updates.",
        url: "app.openmidmarket.com/analytics/rent-trends",
        Mockup: MarketUpdateMockup,
    },
    {
        feature: "Deal alerts",
        title: "See mispriced deals before the market does",
        body: "Luna monitors your target submarkets 24/7 for new listings and price cuts matching your exact buy box, from unit count and vintage to basis and rent-upside spread, so you can underwrite and offer first.",
        url: "app.openmidmarket.com/alerts",
        Mockup: InvestorDealAlertsMockup,
    },
];

const PANEL = "rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";
const GREEN = "text-green-700 dark:text-green-300";
const noop = () => {};

export function LeadsBenefits() {
    return (
        <BenefitsShowcase
            eyebrow="FOR CRE BROKERS"
            heading="From first call to closed deal"
            benefits={LEADS_BENEFITS}
        />
    );
}

export function InvestorBenefits() {
    return (
        <BenefitsShowcase
            eyebrow="FOR CRE INVESTORS"
            heading="From first look to closed acquisition"
            benefits={INVESTOR_BENEFITS}
        />
    );
}

function BenefitsShowcase({
    eyebrow,
    heading,
    benefits,
}: {
    eyebrow: string;
    heading: string;
    benefits: readonly Benefit[];
}) {
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
                <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">{eyebrow}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">{heading}</h2>

                <div className="mt-12 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
                    <div>
                        {benefits.map((item, i) => (
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
                        <div className="sticky top-[calc(50vh-19.5rem)] h-[39rem]">
                            {benefits.map((item, i) => (
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

/* 1. Rent comps: matches app/src/lib/analytics/rent-comps-broker-export.ts document style */

type GradeRowItem = {
    label: string;
    value: string;
    rationale: string;
};

const COMP_CARDS: readonly {
    rank: number;
    address: string;
    facts: string;
    grades: readonly GradeRowItem[];
    lead: string;
    why: string;
    photos: readonly string[];
}[] = [
    {
        rank: 1,
        address: "1280 Oak Grove Ave",
        facts: "$3,195/mo · 1 bd · 1.0 ba · 710 sqft · 0.2 mi",
        grades: [
            {
                label: "Condition",
                value: "5 / 6 ★",
                rationale: "Interiors show fresh paint, new flooring, and zero visible wear; exterior freshly finished. Like-new C2 condition (5/6).",
            },
            {
                label: "Quality",
                value: "4 / 6 ★",
                rationale:
                    "Quartz counters and island, stainless appliances, marble-look shower tile, and recessed lighting on a standard multifamily layout. Rated Q3 (4/6).",
            },
            {
                label: "Location",
                value: "1 / 18",
                rationale: "Quiet residential Oak Grove block steps from Burlingame Ave shops, grocery, and Caltrain; top walkability in this comps pack.",
            },
        ],
        lead: "1 bed / 1 bath, 710 sf vs. 720 sf,",
        why: " steps off Burlingame Ave with open kitchen-living layout, quartz counters, and in-unit laundry. Lists at $3,195.",
        photos: [
            "/mockups/rent-comps/el-camino-1.webp",
            "/mockups/rent-comps/el-camino-2.webp",
            "/mockups/rent-comps/el-camino-3.webp",
            "/mockups/rent-comps/el-camino-4.webp",
            "/mockups/rent-comps/el-camino-5.webp",
            "/mockups/rent-comps/el-camino-6.webp",
        ],
    },
    {
        rank: 2,
        address: "845 Bellevue Ave",
        facts: "$3,275/mo · 1 bd · 1.0 ba · 760 sqft · 0.4 mi",
        grades: [
            {
                label: "Condition",
                value: "5 / 6 ★",
                rationale:
                    "Comprehensively remodeled interior with new quartz kitchen, updated baths, new plank flooring, and fresh paint throughout. Rated C2 (5/6).",
            },
            {
                label: "Quality",
                value: "4 / 6 ★",
                rationale: "Upgraded finishes including quartz island, custom wood cabinets, stainless appliances, and marble-tiled double-vanity bath. Rated Q3 (4/6).",
            },
            {
                label: "Location",
                value: "3 / 18",
                rationale: "Peaceful residential street across from Washington Park and two blocks off Burlingame Ave retail, with minimal through-traffic.",
            },
        ],
        lead: "Remodeled 1 bed / 1 bath, 760 sf vs. 720 sf,",
        why: " with central A/C, private balcony, and in-unit washer/dryer; adjusting -$125 for size and A/C puts it near $3,150.",
        photos: [
            "/mockups/rent-comps/oak-rwc-1.webp",
            "/mockups/rent-comps/oak-rwc-2.webp",
            "/mockups/rent-comps/oak-rwc-3.webp",
            "/mockups/rent-comps/oak-rwc-4.webp",
            "/mockups/rent-comps/oak-rwc-5.webp",
            "/mockups/rent-comps/oak-rwc-6.webp",
        ],
    },
];

const SUBJECT_PHOTOS = [
    "/mockups/rent-comps/subject-1.webp",
    "/mockups/rent-comps/subject-2.webp",
    "/mockups/rent-comps/subject-3.webp",
    "/mockups/rent-comps/subject-4.webp",
    "/mockups/rent-comps/subject-5.webp",
    "/mockups/rent-comps/subject-6.webp",
] as const;

const SUBJECT_GRADES: readonly GradeRowItem[] = [
    {
        label: "Condition",
        value: "5 / 6 ★",
        rationale: "Recently updated units and common areas show no visible wear, with clean finishes, appliances, and wide-plank flooring. Rated C2 (5/6).",
    },
    {
        label: "Quality",
        value: "4 / 6 ★",
        rationale: "Upgraded materials with quartz counters, stainless appliances, tile backsplash, and modern cabinetry on a standard floor plan. Rated Q3 (4/6).",
    },
    {
        label: "Location",
        value: "2 / 18",
        rationale: "Tree-lined Floribunda Ave block two blocks south of Burlingame Ave dining and Caltrain, buffered from El Camino traffic.",
    },
];

const ESTIMATE_RANGE = "$3,100 - $3,200/mo";
const ESTIMATE_OVERVIEW_LEAD = "Shared laundry and no central A/C";
const ESTIMATE_OVERVIEW_BODY = " keep the subject just below the $3,275 top of range.";

function GradeRowWithTooltip({ item, subjectLabel }: { item: GradeRowItem; subjectLabel: string }) {
    const [open, setOpen] = useState(false);
    const pointerRef = useRef<{ type: string; wasOpen: boolean } | null>(null);

    return (
        <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label={`${item.label} ${item.value} for ${subjectLabel}`}
                    className="inline-flex w-fit cursor-help items-center gap-2 rounded-sm text-left leading-tight transition-colors hover:text-gray-900 hover:underline hover:decoration-dotted hover:underline-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:hover:text-gray-100"
                    onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
                        pointerRef.current = { type: event.pointerType, wasOpen: open };
                    }}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const pointer = pointerRef.current;
                        pointerRef.current = null;
                        if (pointer?.type === "mouse") setOpen(true);
                        else setOpen(!(pointer ? pointer.wasOpen : open));
                    }}
                >
                    <span className="w-[60px] shrink-0 text-gray-500 dark:text-gray-400">{item.label}</span>
                    <span className="tabular-nums">{item.value}</span>
                </button>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                sideOffset={4}
                className="max-w-xs !bg-white px-3 py-2 text-left text-xs leading-relaxed text-pretty !text-gray-900 shadow-md ring-1 ring-black/10 [&_svg]:!bg-white [&_svg]:!fill-white"
            >
                {item.rationale}
            </TooltipContent>
        </Tooltip>
    );
}

const GALLERY_NAV_BUTTON =
    "pointer-events-auto absolute top-1/2 z-30 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm ring-1 ring-gray-900/5 backdrop-blur-md transition-[background-color,transform,opacity] duration-200 hover:bg-white active:scale-95";

const GALLERY_NAV_REVEAL =
    "opacity-0 pointer-events-none group-hover/gallery:pointer-events-auto group-hover/gallery:opacity-100 group-focus-within/gallery:pointer-events-auto group-focus-within/gallery:opacity-100 group-hover/card:pointer-events-auto group-hover/card:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100";

function CompPhotoCarousel({ photos, label }: { photos: readonly string[]; label: string }) {
    const [index, setIndex] = useState(0);
    const count = photos.length;
    const goPrev = () => setIndex((i) => (i === 0 ? count - 1 : i - 1));
    const goNext = () => setIndex((i) => (i === count - 1 ? 0 : i + 1));

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            event.stopPropagation();
            goPrev();
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            event.stopPropagation();
            goNext();
        }
    };

    const onArrow = (event: MouseEvent<HTMLButtonElement>, action: () => void) => {
        event.preventDefault();
        event.stopPropagation();
        action();
    };

    return (
        <div
            className="group/gallery relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-700"
            tabIndex={0}
            role="group"
            aria-label={`Photos of ${label}`}
            onKeyDown={onKeyDown}
        >
            <Image
                src={photos[index]}
                alt=""
                width={96}
                height={64}
                className="size-full object-cover outline outline-1 -outline-offset-1 outline-black/10 transition duration-150 group-hover/card:scale-105 dark:outline-white/10"
            />
            <button
                type="button"
                aria-label={`Previous photo for ${label}`}
                className={cn(GALLERY_NAV_BUTTON, GALLERY_NAV_REVEAL, "left-1")}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => onArrow(event, goPrev)}
            >
                <ChevronLeft className="size-3" />
            </button>
            <button
                type="button"
                aria-label={`Next photo for ${label}`}
                className={cn(GALLERY_NAV_BUTTON, GALLERY_NAV_REVEAL, "right-1")}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => onArrow(event, goNext)}
            >
                <ChevronRight className="size-3" />
            </button>
            <div className="pointer-events-none absolute right-1 bottom-1 z-20 rounded-full bg-gray-950/60 px-1.5 py-px text-[9px] font-medium text-white tabular-nums backdrop-blur-md">
                {index + 1} / {count}
            </div>
        </div>
    );
}

function RentCompsMockup() {
    return (
        <>
            <PageHeader title="Rent comps" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-50 p-3.5 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                <div className={cn(PANEL, "group/card flex gap-3 px-3 py-2")}>
                    <CompPhotoCarousel photos={SUBJECT_PHOTOS} label="1450 Floribunda Ave" />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm leading-tight font-semibold tracking-tight text-gray-900 dark:text-gray-100">1450 Floribunda Ave</p>
                                    <span className="rounded bg-blue-50 px-1.5 py-px text-[9px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                                        Subject
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[10px] text-gray-600 dark:text-gray-300">1 bd · 1.0 ba · 720 sqft · 24 units</p>
                            </div>
                            <div className="shrink-0 text-right tabular-nums">
                                <p className="text-[9px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">In-place avg</p>
                                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">$2,475/mo</p>
                            </div>
                        </div>
                        <div className="mt-1 flex flex-col items-start gap-0.5 text-[10px] text-gray-600 dark:text-gray-300">
                            {SUBJECT_GRADES.map((g) => (
                                <GradeRowWithTooltip key={g.label} item={g} subjectLabel="1450 Floribunda Ave" />
                            ))}
                        </div>
                    </div>
                </div>

                <p className="mt-2.5 text-xs font-semibold text-gray-900 dark:text-gray-100">Top 5 comps</p>
                <p className="mt-1 text-base font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400">{ESTIMATE_RANGE}</p>
                <p className="mt-0.5 mb-1.5 text-[10.5px] leading-snug text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{ESTIMATE_OVERVIEW_LEAD}</span>
                    {ESTIMATE_OVERVIEW_BODY}
                </p>

                <ul className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
                    {COMP_CARDS.map((pick) => (
                        <li key={pick.rank} className={cn(PANEL, "group/card flex gap-3 px-3 py-1.5")}>
                            <CompPhotoCarousel photos={pick.photos} label={pick.address} />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs leading-tight font-semibold text-gray-900 dark:text-gray-100">
                                    {pick.rank}. {pick.address}
                                </p>
                                <p className="mt-0.5 text-[10px] text-gray-500 tabular-nums dark:text-gray-400">{pick.facts}</p>
                                <div className="mt-1 flex flex-col items-start gap-0.5 text-[10px] text-gray-600 dark:text-gray-300">
                                    {pick.grades.map((g) => (
                                        <GradeRowWithTooltip key={g.label} item={g} subjectLabel={pick.address} />
                                    ))}
                                </div>
                                <p className="mt-1 text-[10.5px] leading-snug text-gray-700 dark:text-gray-200">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{pick.lead}</span>
                                    {pick.why}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
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

/* 3. Proactive listing alerts: Luna flags new listings that fit a watch and names likely buyers */

const WATCH = ["Palo Alto", "$3M-$8M", "20-40 units", "Built 1950-1980"];

const OM_FACTS = [
    { label: "Asking", value: "$5.8M" },
    { label: "Per door", value: "$181K" },
    { label: "Units", value: "32" },
    { label: "Built", value: "1964" },
];

const LIKELY_BUYERS = [
    {
        name: "Alder Street Capital LLC",
        reason: "Bought 330 Hamilton Ave (18 units, Jun 2026) and two more 1960s buildings within 1 mi",
        fit: "Strong fit",
    },
    {
        name: "Mendoza Family Trust",
        reason: "Owns 610 Waverley St, 3 blocks away; added 12 units in Mar 2026",
        fit: "Strong fit",
    },
    {
        name: "Peninsula Housing Partners",
        reason: "4 Palo Alto purchases since 2021, all 20-40 units at $4M-$7M",
        fit: "Good fit",
    },
];

const INVESTOR_DEAL_SIGNALS = [
    {
        name: "Rent upside: +$415 / unit (+19%)",
        reason: "In-place 1-beds average $2,540 vs. $2,955 market median from 18 nearby comps",
        fit: "Strong fit",
    },
    {
        name: "330 Hamilton Ave · $192K / door",
        reason: "18 units, 1962 vintage · closed Jun 2026 at 5.1% cap, 2 blocks away",
        fit: "Sales comp",
    },
    {
        name: "610 Waverley St · $188K / door",
        reason: "12 units, 1958 vintage · closed Mar 2026 at 5.2% cap, 3 blocks away",
        fit: "Sales comp",
    },
];

type AlertPanelRow = { name: string; reason: string; fit: string };

function BrokerListingAlertsMockup() {
    return (
        <ListingAlertsMockup
            headerTitle="Listing alerts"
            alertHeading="New listing fits your Palo Alto watch"
            summary="Matches all four rules. Three owners nearby have bought buildings like this in the last two years."
            panelTitle="Likely buyers"
            panelSubtitle="· from past sales within 1 mi"
            ctaLabel="Draft outreach"
            rows={LIKELY_BUYERS}
        />
    );
}

function InvestorDealAlertsMockup() {
    return (
        <ListingAlertsMockup
            headerTitle="Deal alerts"
            alertHeading="New deal fits your Palo Alto buy box"
            summary="Matches all four rules. Asking $181K/door, 6% below recent 1960s comps within 1 mi."
            panelTitle="Comps & upside signals"
            panelSubtitle="· within 1 mi"
            ctaLabel="Run underwriting"
            rows={INVESTOR_DEAL_SIGNALS}
        />
    );
}

function ListingAlertsMockup({
    headerTitle,
    alertHeading,
    summary,
    panelTitle,
    panelSubtitle,
    ctaLabel,
    rows,
}: {
    headerTitle: string;
    alertHeading: string;
    summary: string;
    panelTitle: string;
    panelSubtitle: string;
    ctaLabel: string;
    rows: readonly AlertPanelRow[];
}) {
    return (
        <>
            <PageHeader title={headerTitle}>
                <OutlineButton icon={Bell}>Edit watch</OutlineButton>
            </PageHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden p-3">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="text-gray-500">Watching</span>
                    {WATCH.map((item) => (
                        <span key={item} className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 font-medium dark:border-gray-700 dark:bg-gray-800">
                            {item}
                        </span>
                    ))}
                    <span className="ml-auto text-gray-500">Alerts by email and text</span>
                </div>

                <div className={cn(PANEL, "shrink-0 overflow-hidden")}>
                    <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 dark:border-gray-700">
                        <LunaAvatar />
                        <p className="min-w-0 flex-1 truncate text-[11px]">
                            <span className="font-semibold">{alertHeading}</span>
                        </p>
                        <span className="shrink-0 text-[10px] text-gray-500">2m ago</span>
                    </div>
                    <div className="flex gap-3 px-3 py-2">
                        <OmCoverPreview />
                        <div className="min-w-0 flex-1 space-y-1.5 text-[10px]">
                            <div>
                                <p className="text-[11px] font-semibold">421 University Ave</p>
                                <p className="text-gray-500">Palo Alto, CA · listed by Bayline Realty</p>
                            </div>
                            <dl className="grid max-w-56 grid-cols-2 gap-x-4 gap-y-0.5 tabular-nums">
                                {OM_FACTS.map((fact) => (
                                    <div key={fact.label} className="flex justify-between gap-2">
                                        <dt className="text-gray-500">{fact.label}</dt>
                                        <dd className="font-medium">{fact.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="leading-snug text-gray-700 dark:text-gray-300">{summary}</p>
                        </div>
                    </div>
                </div>

                <div className={cn(PANEL, "min-h-0 flex-1 overflow-hidden")}>
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-3 py-2 dark:border-gray-700">
                        <p className="text-xs font-semibold">
                            {panelTitle} <span className="hidden font-normal text-gray-500 sm:inline">{panelSubtitle}</span>
                        </p>
                        <span className="inline-flex h-6 shrink-0 items-center rounded-md bg-blue-600 px-2.5 text-[10px] font-medium whitespace-nowrap text-white">
                            {ctaLabel}
                        </span>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {rows.map((row) => (
                            <li key={row.name} className="flex items-start justify-between gap-3 px-3 py-1.5">
                                <div className="min-w-0">
                                    <p className="text-[11px] font-medium text-blue-700 dark:text-blue-400">{row.name}</p>
                                    <p className="truncate text-[10px] text-gray-500 dark:text-gray-400">{row.reason}</p>
                                </div>
                                <span
                                    className={cn(
                                        "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium",
                                        row.fit === "Strong fit"
                                            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                                    )}
                                >
                                    {row.fit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

function LunaAvatar() {
    return (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-900 text-[9px] font-semibold text-white dark:bg-blue-600">
            L
        </span>
    );
}

const OM_PAGE_WIDTH = 300;
const OM_THUMB_WIDTH = 92;

// Cover page of the listing's offering memorandum. Like the Rent Gap preview, the
// page is laid out at full size with readable type and scaled down to a thumbnail.
function OmCoverPreview() {
    return (
        <div className="flex shrink-0 flex-col items-center gap-1">
            <div
                className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-gray-600"
                style={{ width: OM_THUMB_WIDTH, height: (OM_THUMB_WIDTH * 11) / 8.5 }}
            >
                <div
                    className="flex origin-top-left flex-col text-gray-900"
                    style={{ width: OM_PAGE_WIDTH, height: (OM_PAGE_WIDTH * 11) / 8.5, transform: `scale(${OM_THUMB_WIDTH / OM_PAGE_WIDTH})` }}
                >
                    <div className="px-6 pt-6">
                        <p className="text-[11px] font-bold tracking-[0.2em] text-blue-900">BAYLINE REALTY</p>
                        <p className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">Offering memorandum</p>
                    </div>
                    <div className="relative mt-4 h-[170px]">
                        <Image src="/videos/sf-residential-aerial-poster.jpg" alt="" fill sizes="300px" className="object-cover object-[50%_85%]" />
                    </div>
                    <div className="px-6 pt-5">
                        <p className="text-[26px] leading-tight font-semibold tracking-tight">421 University Ave</p>
                        <p className="mt-1 text-[13px] text-gray-600">Palo Alto, California</p>
                        <p className="mt-3 text-[12px] text-gray-700">32-unit multifamily investment opportunity</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between bg-blue-900 px-6 py-3 text-[9px] text-white">
                        <span>Exclusively listed by Dana Whitfield &amp; Marco Reyes</span>
                        <span className="font-semibold">Bayline Realty</span>
                    </div>
                </div>
            </div>
            <span className="flex items-center gap-1 text-[9px] text-gray-500">
                <FileText className="size-2.5" />
                OM · 38 pages
            </span>
        </div>
    );
}
