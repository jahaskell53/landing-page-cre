"use client";

import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BrowserWindow } from "./browser-window";
import { ShowcaseRentTrendsCard } from "./rent-trends-preview";
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
        body: "Agents monitor your submarkets for new listings that fit a price range, unit count, or vintage, then name the buyers most likely to want them based on what they have bought before.",
        url: "app.openmidmarket.com/alerts",
        Mockup: BrokerListingAlertsMockup,
    },
];

const INVESTOR_BENEFITS: readonly Benefit[] = [
    {
        feature: "Rent comps",
        title: "Know the true rent upside before you buy",
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
        body: "Agents monitor your target submarkets 24/7 for new listings and price cuts matching your exact buy box, from unit count and vintage to basis and rent-upside spread, so you can underwrite and offer first.",
        url: "app.openmidmarket.com/alerts",
        Mockup: InvestorDealAlertsMockup,
    },
];

const PANEL = "rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";

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
                                        "absolute inset-0 flex items-center transition-all duration-500 ease-out",
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
        <BrowserWindow url={item.url} className="flex w-full flex-col">
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
const ESTIMATE_OVERVIEW_LEAD = "Updated finishes and walkable Floribunda location";
const ESTIMATE_OVERVIEW_BODY =
    " support pricing near $3,150, with a small discount to top comps that include central A/C and private balconies.";

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

/* 2. Market updates: hero-style interactive rent chart */

function MarketUpdateMockup() {
    return <ShowcaseRentTrendsCard preset="sf-neighborhoods" />;
}

/* 3. Listing & deal alerts: sleek quiet-deal-brief layout (Figma 116:3447 for investors, 117:2 for brokers) */

const WATCH = ["San Jose", "$3M-$6M", "10-25 units", "Built 1950-1980"] as const;

type PropertyMetric = { label: string; value: string };

const BROKER_METRICS: readonly PropertyMetric[] = [
    { value: "$4.15M", label: "Asking" },
    { value: "12", label: "Units" },
    { value: "$346K", label: "Per door" },
    { value: "1957", label: "Built" },
];

const INVESTOR_METRICS: readonly PropertyMetric[] = [
    { value: "$4.15M", label: "Asking" },
    { value: "12", label: "Units" },
    { value: "5.4%", label: "Cap rate" },
    { value: "1957", label: "Built" },
];

const LIKELY_BUYERS = [
    {
        name: "Alder Street Capital LLC",
        reason: "Bought 385 S. 7th St (14 units, Jun 2026) and two more 1950s buildings within 1 mi",
    },
    {
        name: "Mendoza Family Trust",
        reason: "Owns 210 E. Reed St, 3 blocks away; added 10 units in Mar 2026",
    },
    {
        name: "Peninsula Housing Partners",
        reason: "4 San Jose purchases since 2021, all 10-25 units at $3M-$6M",
    },
] as const;

function ListingAlertsWorkspace({ metrics, children }: { metrics: readonly PropertyMetric[]; children: React.ReactNode }) {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden bg-white p-6 text-gray-900 dark:bg-[#14181e] dark:text-[#f2f4f7]">
            <div className="flex items-center justify-between gap-3">
                <p className="text-base leading-[23px] font-semibold text-gray-900 dark:text-[#f2f4f7]">Listing alerts</p>
                <button
                    type="button"
                    className="rounded-[6px] border border-gray-200 px-2 py-1.5 text-xs leading-[17px] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#343c47] dark:text-[#cfd5de] dark:hover:bg-white/5"
                >
                    Edit watch
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] leading-4 text-gray-500 dark:text-[#9aa3b0]">
                <span>Watching</span>
                {WATCH.map((item) => (
                    <span key={item}>{item}</span>
                ))}
            </div>

            <div className="h-px w-full shrink-0 bg-gray-200 dark:bg-[#2a3039]" />

            <div className="flex flex-col gap-3.5">
                <div className="flex items-start justify-between gap-3 text-[11px] leading-4">
                    <p className="font-medium text-gray-600 dark:text-[#abb5c2]">New listing fits your San Jose watch</p>
                    <p className="shrink-0 text-gray-400 dark:text-[#838e9d]">2m ago</p>
                </div>

                <div className="flex items-start gap-[22px]">
                    <OmCoverPreview />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <p className="text-[26px] leading-[34px] font-semibold tracking-tight text-gray-900 dark:text-[#f2f4f7]">441 S. 5th Street</p>
                        <p className="text-xs leading-[17px] text-gray-500 dark:text-[#9aa3b0]">San Jose, CA · listed by Bayline Realty</p>

                        <dl className="grid grid-cols-4 gap-4 pt-3 tabular-nums">
                            {metrics.map((metric) => (
                                <div key={metric.label} className="flex min-w-0 flex-col gap-0.5">
                                    <dd className="text-lg leading-[26px] font-medium text-gray-900 dark:text-[#f2f4f7]">{metric.value}</dd>
                                    <dt className="text-[11px] leading-4 text-gray-500 dark:text-[#838e9d]">{metric.label}</dt>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
}

function BrokerListingAlertsMockup() {
    return (
        <ListingAlertsWorkspace metrics={BROKER_METRICS}>
            <div className="flex min-h-0 flex-col">
                <p className="pb-3 text-[13px] leading-[19px] font-medium text-gray-900 dark:text-[#f2f4f7]">Likely buyers</p>
                <ul className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-[#2a3039] dark:border-[#2a3039]">
                    {LIKELY_BUYERS.map((buyer) => (
                        <li key={buyer.name} className="flex items-center justify-between gap-5 py-3">
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <p className="truncate text-[13px] leading-[19px] font-medium text-gray-900 dark:text-[#e4e8ef]">{buyer.name}</p>
                                <p className="truncate text-[11px] leading-4 text-gray-500 dark:text-[#9aa3b0]">{buyer.reason}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    aria-label={`Email ${buyer.name}`}
                                    className="flex size-8 items-center justify-center rounded-[6px] transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                    <Image src="/mockups/icons/envelope.svg" alt="" width={17} height={13} className="opacity-80 dark:opacity-100" />
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Text ${buyer.name}`}
                                    className="flex size-8 items-center justify-center rounded-[6px] transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                    <Image src="/mockups/icons/sms.svg" alt="" width={16} height={15} className="opacity-80 dark:opacity-100" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </ListingAlertsWorkspace>
    );
}

function InvestorDealAlertsMockup() {
    return (
        <ListingAlertsWorkspace metrics={INVESTOR_METRICS}>
            <div className="flex flex-col gap-3 rounded-[10px] border border-emerald-200 bg-emerald-50/70 px-[18px] py-4 dark:border-[#2a4038] dark:bg-[#172320]">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs leading-4 font-semibold text-emerald-950 dark:text-[#d5dfda]">Analysis</p>
                    <span className="rounded-[5px] bg-emerald-100 px-[9px] py-1 text-[11px] leading-4 font-medium text-emerald-800 dark:bg-[#233e31] dark:text-[#a9ddb9]">
                        Undervalued
                    </span>
                </div>
                <p className="text-[13px] leading-5 text-emerald-900 dark:text-[#d1dbd5]">
                    We think there is significant room to push rents, with in-place rents 27% below market rate and proximity to San Jose State driving strong rental demand.
                </p>
            </div>
        </ListingAlertsWorkspace>
    );
}

const OM_THUMB_WIDTH = 144;
const OM_THUMB_HEIGHT = 100;

function OmCoverPreview() {
    return (
        <div className="flex shrink-0 flex-col items-center gap-1">
            <div
                className="relative overflow-hidden rounded-[6px] border border-gray-200 bg-white shadow-sm dark:border-[#61656c]"
                style={{ width: OM_THUMB_WIDTH, height: OM_THUMB_HEIGHT }}
            >
                <Image src="/mockups/veridian.jpg" alt="Veridian on 5th offering memorandum cover" fill sizes="144px" className="object-cover" />
            </div>
            <span className="flex items-center gap-1 text-[9px] text-gray-500">
                <FileText className="size-2.5" />
                OM · 19 pages
            </span>
        </div>
    );
}
