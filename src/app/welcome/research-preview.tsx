"use client";

import { ArrowUp, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatContainerContent, ChatContainerRoot } from "@/components/ui/chat-container";
import { Markdown } from "@/components/ui/markdown";
import { Message } from "@/components/ui/message";
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";

const RESEARCH_INSIGHTS = [
    { t: "Underwriting summary — 24-unit, San Mateo", d: "Projected 5.4% stabilized yield on cost." },
    { t: "Owner watchlist — 3 new off-market leads", d: "Matched to your buy-box criteria." },
];

const SAMPLE_USER = "How is the multifamily market in San Mateo, CA?";

const SAMPLE_ASSISTANT = `San Mateo mid-market multifamily remains tight, with Peninsula fundamentals supporting stable occupancy and rent growth.

**Rent trends:** Median 1BR asking rent sits in the mid-$2,000s, with modest week-over-week movement and stronger gains near transit corridors.

**Sales activity:** Closed $/door runs above the East Bay and tracks closer to core Peninsula markets, which keeps entry caps compressed for value-add buyers.

**News:** Recent headlines around housing supply and permitting on the Peninsula are worth watching for owners with 20–80 unit assets in San Mateo County.`;

const PREVIEW_CARD = "rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";

export function ResearchPreview() {
    return (
        <div aria-hidden className="pointer-events-none -m-6 flex min-h-[480px] flex-col bg-white select-none dark:bg-gray-900">
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
                    <div key={r.t} className={`${PREVIEW_CARD} p-3.5`}>
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 shrink-0 text-gray-400" />
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.t}</div>
                        </div>
                        <p className="mt-1.5 pl-6 text-sm text-gray-600 dark:text-gray-400">{r.d}</p>
                    </div>
                ))}
            </div>

            <div className="relative min-h-0 flex-1">
                <ChatContainerRoot className="h-full">
                    <ChatContainerContent className="gap-4 px-4 py-4">
                        <Message className="justify-end">
                            <div className="max-w-[85%] rounded-2xl bg-gray-900 px-3.5 py-2 text-sm whitespace-pre-wrap text-white dark:bg-gray-100 dark:text-gray-900">
                                {SAMPLE_USER}
                            </div>
                        </Message>

                        <Message className="flex-col items-stretch gap-2">
                            <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    <Settings2 className="size-3 shrink-0" />
                                    <span>
                                        <span className="text-gray-800 dark:text-gray-200">get_rent_trends_by_city</span>
                                        <span className="text-gray-500 dark:text-gray-400">(San Mateo, CA · 1BR)</span>
                                    </span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    <Settings2 className="size-3 shrink-0" />
                                    <span>
                                        <span className="text-gray-800 dark:text-gray-200">search_cre_news</span>
                                        <span className="text-gray-500 dark:text-gray-400">(San Mateo multifamily)</span>
                                    </span>
                                </span>
                            </div>
                            <Markdown className="text-sm">{SAMPLE_ASSISTANT}</Markdown>
                        </Message>
                    </ChatContainerContent>
                </ChatContainerRoot>
            </div>

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
