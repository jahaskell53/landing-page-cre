"use client";

import { Calendar, Check, ExternalLink, MapPin, Newspaper, Search, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PreviewChip, PreviewSelectable, usePreviewSelection, usePreviewToggle } from "./preview-interaction";

const PLACEHOLDER_QUERY = "What's happening with office space in South Bay?";

const MOCK_PREFERENCES = {
    regions: ["Alameda County", "Santa Clara County", "San Francisco"],
    interests: "Multifamily acquisitions · Bay Area mid-market",
};

const REDWOOD_CITY_COUNCIL_IMAGE = "/welcome/redwood-city-council.jpg";
const SANTA_CLARA_MISSION_IMAGE = "/welcome/santa-clara-mission.jpeg";
const TIC_FINANCING_IMAGE = "/welcome/tic-financing.jpg";

const MOCK_ARTICLES = [
    {
        id: "news-1",
        title: "Redwood City council delays rent-cap vote",
        description: "City leaders postponed a decision on new rent stabilization rules affecting mid-market multifamily owners across the Peninsula.",
        source: "San Francisco Chronicle",
        date: "2 hours ago",
        counties: ["San Mateo"],
        tags: ["Regulatory", "Multifamily"],
        matchReason: "Relevant to Peninsula multifamily owners",
        imageSrc: REDWOOD_CITY_COUNCIL_IMAGE,
        imageAlt: "Redwood City welcome sign downtown",
    },
    {
        id: "news-2",
        title: "Santa Clara permits up 12% QoQ",
        description: "Multifamily permitting accelerated in South Bay cities as developers respond to sustained rent growth and limited resale inventory.",
        source: "Silicon Valley Business Journal",
        date: "5 hours ago",
        counties: ["Santa Clara"],
        tags: ["Market", "Development"],
        matchReason: "Relevant to multifamily acquisitions",
        imageSrc: SANTA_CLARA_MISSION_IMAGE,
        imageAlt: "Santa Clara Mission",
    },
    {
        id: "news-3",
        title: "New TIC financing rules take effect",
        description: "Updated tenant-in-common guidelines change how fractional ownership deals are structured for small-balance commercial assets.",
        source: "Commercial Observer",
        date: "1 day ago",
        counties: ["San Francisco"],
        tags: ["Regulatory", "Financing"],
        matchReason: "Matches San Francisco in your regions",
        imageSrc: TIC_FINANCING_IMAGE,
        imageAlt: "Tenant-in-common financing",
    },
];

const ARTICLE_TAGS = [...new Set(MOCK_ARTICLES.flatMap((article) => article.tags))];

function regionMatches(article: (typeof MOCK_ARTICLES)[number], region: string) {
    const key = region.replace(/ County$/, "");
    return article.counties.some((county) => county === key || region.includes(county));
}

function MockArticleCard({
    article,
    selected,
    onSelect,
}: {
    article: (typeof MOCK_ARTICLES)[number];
    selected: boolean;
    onSelect: () => void;
}) {
    const { title, description, source, date, counties, tags, matchReason, imageSrc, imageAlt } = article;
    return (
        <PreviewSelectable selected={selected} onSelect={onSelect} className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex min-w-0 gap-3">
                <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt={imageAlt ?? title} className="h-full w-full object-cover" />
                    ) : (
                        <Newspaper className="size-6 text-gray-300 dark:text-gray-600" />
                    )}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="mb-1 flex items-center gap-1 text-[10px] font-medium text-blue-700 dark:text-blue-400">
                        <Sparkles className="size-2.5 shrink-0" />
                        {matchReason}
                    </p>
                    <div className="flex min-w-0 items-start justify-between gap-2">
                        <h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                        <ExternalLink className="size-3.5 shrink-0 text-gray-400" />
                    </div>
                    <p className={cn("mt-1 text-xs text-gray-500 dark:text-gray-400", selected ? "" : "line-clamp-2")}>{description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{source}</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="size-2.5" />
                            {date}
                        </span>
                        {counties.length > 0 && (
                            <span className="flex items-center gap-1">
                                <MapPin className="size-2.5" />
                                {counties.join(", ")}
                            </span>
                        )}
                    </div>
                    {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PreviewSelectable>
    );
}

export function NewsPreview() {
    const [selectedArticle, setSelectedArticle] = usePreviewSelection(MOCK_ARTICLES[0].id);
    const [region, toggleRegion] = usePreviewToggle<string>(null);
    const [tag, toggleTag] = usePreviewToggle<string>(null);

    const filtered = MOCK_ARTICLES.filter((article) => {
        if (region && !regionMatches(article, region)) return false;
        if (tag && !article.tags.includes(tag)) return false;
        return true;
    });

    return (
        <div className="-m-6 flex flex-col gap-4 bg-white p-6 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">CRE News</h2>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Commercial real estate news personalized for your markets</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
                        <Check className="size-3.5 text-green-600 dark:text-green-400" />
                        Subscribed
                    </div>
                    <Button type="button" variant="outline" className="h-8 gap-1.5 px-2.5 text-xs">
                        <Settings className="size-3.5" />
                        Preferences
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900/40 dark:bg-blue-950/20">
                <p className="text-[10px] font-medium tracking-wide text-blue-800 uppercase dark:text-blue-300">Your preferences</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {MOCK_PREFERENCES.regions.map((item) => (
                        <PreviewChip key={item} selected={region === null || region === item} onSelect={() => toggleRegion(item)}>
                            {item}
                        </PreviewChip>
                    ))}
                </div>
                <p className="mt-2 text-xs text-blue-900/80 dark:text-blue-200/80">{MOCK_PREFERENCES.interests}</p>
            </div>

            <div className="flex max-w-2xl gap-2">
                <div className="relative flex min-w-0 flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" strokeWidth={2} />
                    </div>
                    <div className="w-full truncate rounded-l-lg border border-gray-200 bg-white py-2 pr-28 pl-9 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                        {PLACEHOLDER_QUERY}
                    </div>
                    <div className="absolute inset-y-0 right-0 flex w-28 items-center justify-end rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 pr-2 text-right text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        Last Week
                    </div>
                </div>
                <Button type="button" className="h-auto shrink-0 px-3 py-2 text-sm">
                    Search
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                    Personalized for you
                </span>
                {ARTICLE_TAGS.map((item) => (
                    <PreviewChip key={item} selected={tag === null || tag === item} onSelect={() => toggleTag(item)}>
                        {item}
                    </PreviewChip>
                ))}
            </div>

            <div className="grid gap-3">
                {filtered.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        No stories for that filter
                    </p>
                ) : (
                    filtered.map((article) => (
                        <MockArticleCard
                            key={article.id}
                            article={article}
                            selected={selectedArticle === article.id}
                            onSelect={() => setSelectedArticle(article.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
