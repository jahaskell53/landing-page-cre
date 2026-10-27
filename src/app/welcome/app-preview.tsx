"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, MessageCircle, Newspaper, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { generateAuroraGradient, getInitials } from "@/app/(app)/network/utils";
import { VALUE_ADD_PLAN, ValueAddProjectionChart } from "@/components/application/irr-projection-chart";
import { cn } from "@/lib/utils";
import { BrowserWindow } from "./browser-window";
import { HoldingsPreview } from "./holdings-preview";
import { ListingsMapPreview } from "./listings-map-preview";
import { NetworkPreview } from "./network-preview";
import { NewsPreview } from "./news-preview";
import { PREVIEW_PANEL_ORDER, PreviewAppShell, type PreviewPanelId } from "./preview-app-shell";
import { PREVIEW_FADE_TRANSITION, PreviewSelectable, usePreviewSelection } from "./preview-interaction";
import { RentCompsPreview } from "./rent-comps-preview";
import { RentTrendsPreview } from "./rent-trends-preview";
import { ResearchPreview } from "./research-preview";
import { SalesCompsPreview } from "./sales-comps-preview";
import { SalesTrendsPreview } from "./sales-trends-preview";

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

type TabLabel = PreviewPanelId;

function StatRow({
    stats,
    selected,
    onSelect,
}: {
    stats: { id: string; k: string; v: string; delta?: string }[];
    selected: string;
    onSelect: (id: string) => void;
}) {
    return (
        <div className="grid grid-cols-3 gap-2.5">
            {stats.map((s) => (
                <PreviewSelectable key={s.id} selected={selected === s.id} onSelect={() => onSelect(s.id)} className={`${PREVIEW_CARD} p-4`}>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-semibold text-gray-900 tabular-nums dark:text-gray-100">{s.k}</span>
                        {s.delta && <span className="text-xs font-semibold text-[#2f855a] tabular-nums dark:text-[#38a06e]">{s.delta}</span>}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{s.v}</div>
                </PreviewSelectable>
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
    selected,
    onSelect,
    liked,
    onToggleLike,
}: {
    ago: string;
    author: string;
    siteName: string;
    title: string;
    description: string;
    hostname: string;
    imageSrc?: string;
    imageAlt?: string;
    selected: boolean;
    onSelect: () => void;
    liked: boolean;
    onToggleLike: () => void;
}) {
    return (
        <PreviewSelectable
            as="div"
            selected={selected}
            onSelect={onSelect}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
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
                        <span
                            role="button"
                            tabIndex={0}
                            aria-pressed={liked}
                            onClick={(event) => {
                                event.stopPropagation();
                                onToggleLike();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    onToggleLike();
                                }
                            }}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium",
                                liked ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400",
                            )}
                        >
                            <Heart className="size-4" fill={liked ? "currentColor" : "none"} />
                        </span>
                        <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <MessageCircle className="size-4" />0
                        </span>
                    </div>
                </div>
            </div>
        </PreviewSelectable>
    );
}

function MockFeedTextPost({
    ago,
    author,
    body,
    hashtags,
    likes,
    comments,
    selected,
    onSelect,
    liked,
    onToggleLike,
}: {
    ago: string;
    author: string;
    body: string;
    hashtags?: string;
    likes?: number;
    comments?: number;
    selected: boolean;
    onSelect: () => void;
    liked: boolean;
    onToggleLike: () => void;
}) {
    return (
        <PreviewSelectable as="div" selected={selected} onSelect={onSelect} className={`${PREVIEW_CARD} w-full p-4`}>
            <div className="flex items-center gap-2">
                <MockProfileAvatar name={author} />
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{author}</div>
                <div className="ml-auto text-xs text-gray-400">{ago}</div>
            </div>
            <div className="mt-2.5 space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                <p className={cn("whitespace-pre-line", selected ? "" : "line-clamp-6")}>{body}</p>
                {hashtags ? <p className="text-xs text-blue-700 dark:text-blue-400">{hashtags}</p> : null}
                {selected ? null : <p className="text-xs font-medium text-gray-500 dark:text-gray-400">…more</p>}
            </div>
            {(likes != null || comments != null) && (
                <div className="mt-3 flex gap-1 border-t border-gray-100 pt-2.5 dark:border-gray-700">
                    <span
                        role="button"
                        tabIndex={0}
                        aria-pressed={liked}
                        onClick={(event) => {
                            event.stopPropagation();
                            onToggleLike();
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.stopPropagation();
                                onToggleLike();
                            }
                        }}
                        className={cn(
                            "flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium",
                            liked ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400",
                        )}
                    >
                        <Heart className="size-4" fill={liked ? "currentColor" : "none"} />
                        {likes}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <MessageCircle className="size-4" />
                        {comments}
                    </span>
                </div>
            )}
        </PreviewSelectable>
    );
}

function HomePanel() {
    const [selectedPost, setSelectedPost] = usePreviewSelection<string>("dana");
    const [likedOnly, setLikedOnly] = useState(false);
    const [liked, setLiked] = useState<Record<string, boolean>>({ dana: true, marcus: false });

    const toggleLike = (id: string) => setLiked((current) => ({ ...current, [id]: !current[id] }));

    return (
        <>
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <h2 className="text-base leading-none font-semibold text-gray-900 dark:text-gray-100">Posts</h2>
                <button
                    type="button"
                    aria-pressed={likedOnly}
                    onClick={() => setLikedOnly((value) => !value)}
                    className={cn(
                        "flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium",
                        likedOnly
                            ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200"
                            : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400",
                    )}
                >
                    Liked
                </button>
            </div>
            {(!likedOnly || liked.dana) && (
            <MockFeedTextPost
                ago="2h"
                author="Dana R."
                selected={selectedPost === "dana"}
                onSelect={() => setSelectedPost("dana")}
                liked={liked.dana}
                onToggleLike={() => toggleLike("dana")}
                body={`Redwood City just delayed a rent-cap vote. And it's being hailed as a win for renters. But read the draft: the cap would apply to renewals and new leases at CPI or 5%, vacancy control by another name.

In practice, that keeps Peninsula development capital on ice. Who writes an 8-figure check when your pro forma could get rewritten in one election cycle?

Three observations:

1) Mid-market operators already report rent to credit bureaus and offer first right of refusal, the tools policymakers say they want.

2) Supply is what actually bends the curve. Caps don't add units; permitting and construction do.

3) Wage growth has outpaced rent growth in professionally managed stock for 41 consecutive months. That's the trend worth watching, not the saber rattling.

Today's delay is a speed bump, not the end of the fight.`}
                hashtags="#housing #rentcontrol #multifamily"
                likes={524}
                comments={53}
            />
            )}
            {(!likedOnly || liked.marcus) && (
            <MockFeedLinkPost
                ago="5 hours ago"
                author="Marcus L."
                selected={selectedPost === "marcus"}
                onSelect={() => setSelectedPost("marcus")}
                liked={liked.marcus}
                onToggleLike={() => toggleLike("marcus")}
                siteName="San Francisco Chronicle"
                title="Redwood City council delays rent-cap vote"
                description="City leaders postponed a decision on new rent stabilization rules affecting mid-market multifamily owners across the Peninsula."
                hostname="sfchronicle.com"
                imageSrc="/welcome/redwood-city-council.jpg"
                imageAlt="Redwood City welcome sign downtown"
            />
            )}
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
    const [selectedStat, setSelectedStat] = usePreviewSelection<string>("value");
    const [selectedPlan, setSelectedPlan] = usePreviewSelection<string>(String(VALUE_ADD_PLAN[0].n));

    return (
        <>
            <PanelHeader title="Valuation" badge="Estimate + plan" live />
            <StatRow
                selected={selectedStat}
                onSelect={setSelectedStat}
                stats={[
                    { id: "value", k: "$4.2M", v: "Est. value today" },
                    { id: "stabilized", k: "$5.5M", v: "Stabilized (Y5)", delta: "+31%" },
                    { id: "cap", k: "5.3%", v: "Implied cap" },
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
                        <PreviewSelectable
                            key={e.n}
                            variant="row"
                            selected={selectedPlan === String(e.n)}
                            onSelect={() => setSelectedPlan(String(e.n))}
                            className="flex w-full items-center gap-3 rounded-lg px-1 py-1"
                        >
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
                        </PreviewSelectable>
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

function RentTrendsPanel({ showAreaStats = false }: { showAreaStats?: boolean }) {
    return <RentTrendsPreview showAreaStats={showAreaStats} />;
}

function SalesTrendsPanel() {
    return <SalesTrendsPreview />;
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
    home: () => <HomePanel />,
    holdings: () => <HoldingsPreview />,
    valuation: () => <ValuationPanel />,
    "rent-comps": () => <RentCompsPanel />,
    "sales-comps": () => <SalesCompsPanel />,
    "rent-trends": ({ showRentAreaStats }) => <RentTrendsPanel showAreaStats={showRentAreaStats} />,
    "sales-trends": () => <SalesTrendsPanel />,
    listings: () => <ListingsPanel />,
    research: () => <ResearchPanel />,
    network: () => <NetworkPanel />,
    news: () => <NewsPanel />,
};

type AppPreviewData = {
    showRentAreaStats?: boolean;
};

type AppPreviewProps = AppPreviewData & {
    initialPanel?: TabLabel;
    enableAutoCycle?: boolean;
    enableHashLinks?: boolean;
    browserUrl?: string;
};

// How long each tab stays visible while auto-cycling.
const AUTO_CYCLE_MS = 3500;

// Nav dropdown links in the page header point at these hashes; each one
// deep-links to the matching tab of this mockup.
const HASH_TO_TAB: Record<string, TabLabel> = {
    "preview-holdings": "holdings",
    "preview-valuation": "valuation",
    "preview-rent-comps": "rent-comps",
    "preview-sales-comps": "sales-comps",
    "preview-rent-trends": "rent-trends",
    "preview-sales-trends": "sales-trends",
    "preview-listings": "listings",
    "preview-research": "research",
    "preview-network": "network",
    "preview-news": "news",
};

export function AppPreview({
    showRentAreaStats = false,
    initialPanel = "home",
    enableAutoCycle = true,
    enableHashLinks = true,
    browserUrl = "app.openmidmarket.com",
}: AppPreviewProps) {
    const [activeTab, setActiveTab] = useState<TabLabel>(initialPanel);
    // Stop cycling once the visitor takes control by clicking a tab.
    const [autoCycle, setAutoCycle] = useState(enableAutoCycle);
    const containerRef = useRef<HTMLDivElement>(null);

    // Deep-link: when the URL hash targets a tab, select it, stop the
    // auto-cycle, and scroll the mockup into view. The workspace instance
    // keeps this on so header feature links land on the product mockup.
    useEffect(() => {
        if (!enableHashLinks) return;
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
    }, [enableHashLinks]);

    useEffect(() => {
        if (!autoCycle) return;
        // Respect users who prefer reduced motion — leave it on the first tab.
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        const id = window.setInterval(() => {
            setActiveTab((current) => {
                const index = PREVIEW_PANEL_ORDER.indexOf(current);
                return PREVIEW_PANEL_ORDER[(index + 1) % PREVIEW_PANEL_ORDER.length];
            });
        }, AUTO_CYCLE_MS);
        return () => window.clearInterval(id);
    }, [autoCycle]);

    const handleTabClick = (label: TabLabel) => {
        setAutoCycle(false);
        setActiveTab(label);
    };

    const Panel = PANELS[activeTab];

    return (
        <div ref={containerRef} className="scroll-mt-24">
            <BrowserWindow url={browserUrl}>
                <PreviewAppShell activePanel={activeTab} onPanelSelect={handleTabClick}>
                    <div
                        className="relative min-h-[420px] min-w-0 overflow-hidden"
                        onPointerDownCapture={() => setAutoCycle(false)}
                    >
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, position: "absolute", inset: 0 }}
                                transition={PREVIEW_FADE_TRANSITION}
                                className="min-w-0 space-y-4 overflow-hidden p-6"
                            >
                                <Panel showRentAreaStats={showRentAreaStats} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </PreviewAppShell>
            </BrowserWindow>
        </div>
    );
}
