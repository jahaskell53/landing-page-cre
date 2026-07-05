"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Building2, DoorOpen, Gauge, Heart, LineChart, MessageCircle, Newspaper, Receipt, Sparkles, Tags, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import type { TrendRow } from "@/app/(app)/analytics/rent-trends/trends-utils";
import { HomeIcon, PeopleIcon, SearchIcon } from "@/app/(app)/network/icons";
import { generateAuroraGradient, getInitials } from "@/app/(app)/network/utils";
import { ValueAddProjectionChart, VALUE_ADD_PLAN } from "@/components/application/irr-projection-chart";
import type { SalesTrendRowV2 } from "@/db/rpc";
import { cn } from "@/lib/utils";
import { BrowserWindow } from "./browser-window";
import { HoldingsPreview } from "./holdings-preview";
import { ListingsMapPreview } from "./listings-map-preview";
import { NetworkPreview } from "./network-preview";
import { NewsPreview } from "./news-preview";
import { RentCompsPreview } from "./rent-comps-preview";
import { RentTrendsPreview } from "./rent-trends-preview";
import { ResearchPreview } from "./research-preview";
import { SalesCompsPreview } from "./sales-comps-preview";
import { SalesTrendsPreview } from "./sales-trends-preview";

// Mirrors the real in-app sidebar nav for the product preview.
const PREVIEW_NAV = [
    { icon: HomeIcon, label: "Home" },
    { icon: Building2, label: "Holdings" },
    { icon: Gauge, label: "Valuation" },
    { icon: DoorOpen, label: "Rent Comps" },
    { icon: Receipt, label: "Sales Comps" },
    { icon: LineChart, label: "Rent Trends" },
    { icon: TrendingUp, label: "Sales Trends" },
    { icon: Tags, label: "Listings" },
    { icon: Sparkles, label: "Research" },
    { icon: PeopleIcon, label: "Network" },
    { icon: Newspaper, label: "News" },
] as const;

const PREVIEW_CARD = "rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";

function MockProfileAvatar({ name, className }: { name: string; className?: string }) {
    return (
        <div
            className={cn("flex shrink-0 items-center justify-center rounded-full text-xs font-medium text-white", className ?? "size-7")}
            style={{ background: generateAuroraGradient(name) }}
        >
            {getInitials(name)}
        </div>
    );
}

type TabLabel = (typeof PREVIEW_NAV)[number]["label"];

function StatRow({ stats }: { stats: { k: string; v: string; delta?: string }[] }) {
    return (
        <div className="grid grid-cols-3 gap-2.5">
            {stats.map((s) => (
                <div key={s.v} className={`${PREVIEW_CARD} p-4`}>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-semibold text-gray-900 tabular-nums dark:text-gray-100">{s.k}</span>
                        {s.delta && (
                            <span className="text-xs font-semibold text-[#2f855a] tabular-nums dark:text-[#38a06e]">{s.delta}</span>
                        )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{s.v}</div>
                </div>
            ))}
        </div>
    );
}

function MockFeedLinkPost({
    ago,
    author,
    siteName,
    title,
    description,
    hostname,
    imageSrc,
    imageAlt,
}: {
    ago: string;
    author: string;
    siteName: string;
    title: string;
    description: string;
    hostname: string;
    imageSrc?: string;
    imageAlt?: string;
}) {
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                    <div className="mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{ago}</span>
                    </div>
                    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {imageSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={imageSrc} alt={imageAlt ?? title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-24 w-full items-center justify-center p-4">
                                    <div className="mx-auto flex h-24 w-full items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                                        <Newspaper className="size-8 text-gray-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">{siteName}</div>
                            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
                            <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <ArrowUpRight className="h-3 w-3" />
                                <span className="truncate">{hostname}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MockProfileAvatar name={author} />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{author}</p>
                    </div>
                    <div className="flex gap-1">
                        <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <Heart className="size-4" />
                        </span>
                        <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <MessageCircle className="size-4" />0
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

function HomePanel() {
    return (
        <>
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <h2 className="text-base leading-none font-semibold text-gray-900 dark:text-gray-100">Posts</h2>
                <span className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    Liked
                </span>
            </div>
            {[{ n: "Dana R.", t: "Just closed a 24-unit in Burlingame at a 5.6 cap." }].map((p) => (
                <div key={p.n} className={`${PREVIEW_CARD} p-4`}>
                    <div className="flex items-center gap-2">
                        <MockProfileAvatar name={p.n} />
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.n}</div>
                        <div className="ml-auto text-xs text-gray-400">2h</div>
                    </div>
                    <p className="mt-2.5 text-sm text-gray-600 dark:text-gray-400">{p.t}</p>
                </div>
            ))}
            <MockFeedLinkPost
                ago="5 hours ago"
                author="Marcus L."
                siteName="San Francisco Chronicle"
                title="Redwood City council delays rent-cap vote"
                description="City leaders postponed a decision on new rent stabilization rules affecting mid-market multifamily owners across the Peninsula."
                hostname="sfchronicle.com"
                imageSrc="/welcome/redwood-city-council.jpg"
                imageAlt="Redwood City welcome sign downtown"
            />
        </>
    );
}

function PanelHeader({ title, badge, live = false }: { title: string; badge: string; live?: boolean }) {
    return (
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
            <h2 className="text-base leading-none font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400">
                {live && <Sparkles className="size-3.5" />}
                {badge}
            </span>
        </div>
    );
}

function ValuationPanel() {
    return (
        <>
            <PanelHeader title="Valuation" badge="Estimate + plan" live />
            <StatRow
                stats={[
                    { k: "$4.2M", v: "Est. value today" },
                    { k: "$5.5M", v: "Stabilized (Y5)", delta: "+31%" },
                    { k: "5.3%", v: "Implied cap" },
                ]}
            />
            <div className={`${PREVIEW_CARD} p-4`}>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Value &amp; NOI with value-add plan</span>
                    <span>5-yr projection</span>
                </div>
                <ValueAddProjectionChart className="mt-3" />
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Blends 18 nearby closed comps, your rent roll, and the modeled lift from each planned improvement.
                </p>
            </div>
            <div className={`${PREVIEW_CARD} p-4`}>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Value-add plan</p>
                <div className="mt-3 space-y-2.5">
                    {VALUE_ADD_PLAN.map((e) => (
                        <div key={e.n} className="flex items-center gap-3">
                            <span className="flex size-5 flex-none items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white dark:bg-gray-100 dark:text-gray-900">
                                {e.n}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-[13px] font-medium text-gray-900 dark:text-gray-100">{e.name}</div>
                                <div className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                                    {e.detail} · {e.when}
                                </div>
                            </div>
                            <div className="flex-none text-right">
                                <div className="text-[13px] font-semibold text-[#2f855a] tabular-nums dark:text-[#38a06e]">+${e.noi}k</div>
                                <div className="text-[9px] text-gray-400 dark:text-gray-500">NOI / yr</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function RentCompsPanel() {
    return <RentCompsPreview />;
}

function SalesCompsPanel() {
    return <SalesCompsPreview />;
}

function RentTrendsPanel({ initialRentResults }: { initialRentResults?: Record<string, TrendRow[]> }) {
    return <RentTrendsPreview initialRentResults={initialRentResults} showAreaStats={false} />;
}

function SalesTrendsPanel({ initialSalesResults }: { initialSalesResults?: SalesTrendRowV2[] }) {
    return <SalesTrendsPreview initialSalesResults={initialSalesResults} />;
}

function ListingsPanel() {
    return <ListingsMapPreview />;
}

function NetworkPanel() {
    return <NetworkPreview />;
}

function NewsPanel() {
    return <NewsPreview />;
}

function ResearchPanel() {
    return <ResearchPreview />;
}

const PANELS: Record<TabLabel, (props: AppPreviewData) => React.JSX.Element> = {
    Home: () => <HomePanel />,
    Holdings: () => <HoldingsPreview />,
    Valuation: () => <ValuationPanel />,
    "Rent Comps": () => <RentCompsPanel />,
    "Sales Comps": () => <SalesCompsPanel />,
    "Rent Trends": ({ initialRentResults }) => <RentTrendsPanel initialRentResults={initialRentResults} />,
    "Sales Trends": ({ initialSalesResults }) => <SalesTrendsPanel initialSalesResults={initialSalesResults} />,
    Listings: () => <ListingsPanel />,
    Research: () => <ResearchPanel />,
    Network: () => <NetworkPanel />,
    News: () => <NewsPanel />,
};

type AppPreviewData = {
    initialRentResults?: Record<string, TrendRow[]>;
    initialSalesResults?: SalesTrendRowV2[];
};

// How long each tab stays visible while auto-cycling.
const AUTO_CYCLE_MS = 3500;

// Nav dropdown links in the page header point at these hashes; each one
// deep-links to the matching tab of this mockup.
const HASH_TO_TAB: Record<string, TabLabel> = {
    "preview-holdings": "Holdings",
    "preview-valuation": "Valuation",
    "preview-rent-comps": "Rent Comps",
    "preview-sales-comps": "Sales Comps",
    "preview-rent-trends": "Rent Trends",
    "preview-sales-trends": "Sales Trends",
    "preview-listings": "Listings",
    "preview-research": "Research",
    "preview-network": "Network",
    "preview-news": "News",
};

export function AppPreview({ initialRentResults, initialSalesResults }: AppPreviewData) {
    const [activeTab, setActiveTab] = useState<TabLabel>("Home");
    // Stop cycling once the visitor takes control by clicking a tab.
    const [autoCycle, setAutoCycle] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Deep-link: when the URL hash targets a tab, select it, stop the
    // auto-cycle, and scroll the mockup into view.
    useEffect(() => {
        const applyHash = () => {
            const tab = HASH_TO_TAB[window.location.hash.replace(/^#/, "")];
            if (!tab) return;
            setAutoCycle(false);
            setActiveTab(tab);
            containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        };
        applyHash();
        window.addEventListener("hashchange", applyHash);
        return () => window.removeEventListener("hashchange", applyHash);
    }, []);

    useEffect(() => {
        if (!autoCycle) return;
        // Respect users who prefer reduced motion — leave it on the first tab.
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        const id = window.setInterval(() => {
            setActiveTab((current) => {
                const index = PREVIEW_NAV.findIndex((item) => item.label === current);
                return PREVIEW_NAV[(index + 1) % PREVIEW_NAV.length].label;
            });
        }, AUTO_CYCLE_MS);
        return () => window.clearInterval(id);
    }, [autoCycle]);

    const handleTabClick = (label: TabLabel) => {
        setAutoCycle(false);
        setActiveTab(label);
    };

    return (
        <div ref={containerRef} className="scroll-mt-24">
            <BrowserWindow url="app.openmidmarket.com">
                <div className="flex min-w-0 overflow-hidden bg-white dark:bg-gray-900">
                    {/* Mock sidebar — matches AppSidebar chrome */}
                    <div className="hidden w-[180px] shrink-0 flex-col border-r border-gray-200 bg-white sm:flex dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-2 p-4">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-900 dark:bg-gray-100" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">OM</span>
                        </div>
                        <div className="px-3 py-2">
                            <div className="relative">
                                <SearchIcon className="absolute top-1/2 left-2.5 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <div className="h-8 rounded-md border border-gray-200 bg-gray-50 pl-8 text-sm leading-8 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
                                    Search users...
                                </div>
                            </div>
                        </div>
                        <nav className="space-y-0.5 px-3 py-2">
                            {PREVIEW_NAV.map(({ icon: Icon, label }) => {
                                const active = label === activeTab;
                                return (
                                    <button
                                        type="button"
                                        key={label}
                                        onClick={() => handleTabClick(label)}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                                            active ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100" : "text-gray-600 dark:text-gray-400",
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className={cn(active && "font-medium")}>{label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Mock content — tool pages use gray-50 canvas with white cards on top. */}
                    <div className="grid min-w-0 flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
                        {PREVIEW_NAV.map(({ label }) => {
                            const Panel = PANELS[label];
                            const isActive = label === activeTab;
                            return (
                                <motion.div
                                    key={label}
                                    className="col-start-1 row-start-1 min-w-0 space-y-4 overflow-hidden p-6"
                                    animate={{ opacity: isActive ? 1 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    aria-hidden={!isActive}
                                    style={{ pointerEvents: isActive ? "auto" : "none" }}
                                >
                                    <Panel initialRentResults={initialRentResults} initialSalesResults={initialSalesResults} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </BrowserWindow>
        </div>
    );
}
