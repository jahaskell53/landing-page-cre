"use client";

import React, { useMemo } from "react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

export interface MarkdownProps {
    /** Markdown source to render. */
    children: string;
    /** Stable id used to scope memoization in long transcripts. */
    id?: string;
    className?: string;
}

/**
 * Renders markdown to HTML via `marked` (already a project dependency).
 *
 * Vendored from the prompt-kit chat component set. The upstream component uses
 * react-markdown + shiki; this repo standardizes on `marked` (see the research
 * agent), so we keep that renderer to avoid pulling a second markdown stack.
 * The content is always agent- or first-party-authored, so the parsed HTML is
 * trusted (same contract the research page relied on before).
 */
function MarkdownComponent({ children, className }: MarkdownProps) {
    const html = useMemo(() => marked.parse(children, { async: false }) as string, [children]);

    return (
        <div
            className={cn("prose prose-sm max-w-none dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400", className)}
            // Markdown is produced by our own agents / first-party content.
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

const Markdown = React.memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
