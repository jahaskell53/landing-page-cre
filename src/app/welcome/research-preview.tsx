"use client";

import { ArrowUp, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatContainerContent, ChatContainerRoot } from "@/components/ui/chat-container";
import { Markdown } from "@/components/ui/markdown";
import { Message } from "@/components/ui/message";
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PreviewFadeStack, PreviewSelectable, usePreviewSelection } from "./preview-interaction";

const RESEARCH_INSIGHTS = [
    {
        id: "insight-1",
        t: "Underwriting summary — 24-unit, San Mateo",
        d: "Projected 5.4% stabilized yield on cost.",
        user: "How is the multifamily market in San Mateo, CA?",
        assistant: `San Mateo mid-market multifamily remains tight, with Peninsula fundamentals supporting stable occupancy and rent growth.

**Rent trends:** Median 1BR asking rent sits in the mid-$2,000s, with modest week-over-week movement and stronger gains near transit corridors.

**Sales activity:** Closed $/door runs above the East Bay and tracks closer to core Peninsula markets, which keeps entry caps compressed for value-add buyers.

**News:** Recent headlines around housing supply and permitting on the Peninsula are worth watching for owners with 20–80 unit assets in San Mateo County.`,
        tools: [
            { name: "get_rent_trends_by_city", args: "San Mateo, CA · 1BR" },
            { name: "search_cre_news", args: "San Mateo multifamily" },
        ],
    },
    {
        id: "insight-2",
        t: "Owner watchlist — 3 new off-market leads",
        d: "Matched to your buy-box criteria.",
        user: "Which off-market owners match my 20–80 unit buy box?",
        assistant: `Three Peninsula owners look like a fit this week:

1. **Lakeshore Apartments** — 32 units in Oakland, 96% occupied.
2. **Mission Court** — 24 units in San Jose, some in-place rent gap.
3. **A 22-unit El Camino listing** still off-market through a warm intro.

All three sit inside your unit and geography filters.`,
        tools: [{ name: "match_buy_box", args: "20–80 units · Peninsula" }],
    },
];

const PREVIEW_CARD = "rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";

export function ResearchPreview() {
    const [selectedId, setSelectedId] = usePreviewSelection(RESEARCH_INSIGHTS[0].id);

    return (
        <div className="-m-6 flex min-h-[480px] flex-col bg-white dark:bg-gray-900">
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                    <Sparkles className="size-5 text-gray-900 dark:text-gray-100" />
                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Research Agent</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rent &amp; sales trends, market activity, and CRE news</p>
                    </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    <Sparkles className="size-3" />
                    Live
                </span>
            </header>

            <div className="space-y-2.5 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                {RESEARCH_INSIGHTS.map((r) => (
                    <PreviewSelectable
                        key={r.id}
                        selected={selectedId === r.id}
                        onSelect={() => setSelectedId(r.id)}
                        className={`${PREVIEW_CARD} w-full p-3.5`}
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 shrink-0 text-gray-400" />
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.t}</div>
                        </div>
                        <p className="mt-1.5 pl-6 text-sm text-gray-600 dark:text-gray-400">{r.d}</p>
                    </PreviewSelectable>
                ))}
            </div>

            <PreviewFadeStack items={RESEARCH_INSIGHTS} activeId={selectedId} className="relative min-h-0 flex-1" itemClassName="h-full">
                {(insight) => (
                    <ChatContainerRoot className="h-full">
                        <ChatContainerContent className="gap-4 px-4 py-4">
                            <Message className="justify-end">
                                <div className="max-w-[85%] rounded-2xl bg-gray-900 px-3.5 py-2 text-sm whitespace-pre-wrap text-white dark:bg-gray-100 dark:text-gray-900">
                                    {insight.user}
                                </div>
                            </Message>

                            <Message className="flex-col items-stretch gap-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {insight.tools.map((tool) => (
                                        <span
                                            key={tool.name}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                        >
                                            <Settings2 className="size-3 shrink-0" />
                                            <span>
                                                <span className="text-gray-800 dark:text-gray-200">{tool.name}</span>
                                                <span className="text-gray-500 dark:text-gray-400">({tool.args})</span>
                                            </span>
                                        </span>
                                    ))}
                                </div>
                                <Markdown className="text-sm">{insight.assistant}</Markdown>
                            </Message>
                        </ChatContainerContent>
                    </ChatContainerRoot>
                )}
            </PreviewFadeStack>

            <div className="border-t border-gray-200 px-3 py-2.5 dark:border-gray-800">
                <PromptInput value="" onValueChange={() => {}} onSubmit={() => {}} isLoading={false}>
                    <PromptInputTextarea placeholder="Ask about a market…" disabled rows={1} />
                    <PromptInputActions className="justify-end pt-1.5">
                        <PromptInputAction tooltip="Send">
                            <Button disabled size="icon" className="size-8 rounded-full" aria-label="Send">
                                <ArrowUp className="size-4" />
                            </Button>
                        </PromptInputAction>
                    </PromptInputActions>
                </PromptInput>
            </div>
        </div>
    );
}
