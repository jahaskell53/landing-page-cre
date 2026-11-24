import type { ReactNode } from "react";
import type { HeroCopy } from "@/lib/hero-copy";
import { cn } from "@/lib/utils";
import { HeroHighlight } from "./hero-highlight";

const EMPHASIS = "font-semibold text-blue-900 dark:text-blue-400";
const HIGHLIGHT_CLASS = "bg-blue-900 text-white dark:bg-blue-600 dark:text-white";
export const HERO_HEADING_CLASS =
    "text-4xl leading-[1.1] font-semibold tracking-tight text-gray-900 sm:text-5xl sm:leading-[1.1] lg:text-6xl lg:leading-[1.1] dark:text-gray-100";

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function decorateHeroSubtitle(text: string, emphasis: readonly string[] = [], italic: readonly string[] = []): ReactNode {
    const marks = [...emphasis, ...italic];
    if (marks.length === 0) return text;
    const pattern = new RegExp(`(${marks.map(escapeRegExp).join("|")})`, "g");
    return text.split(pattern).map((part, index) => {
        if (italic.includes(part)) {
            return (
                <em key={index} className="italic">
                    {part}
                </em>
            );
        }
        if (emphasis.includes(part)) {
            return (
                <span key={index} className={EMPHASIS}>
                    {part}
                </span>
            );
        }
        return part;
    });
}

export function renderHeroHeadline(copy: HeroCopy): ReactNode {
    return copy.lines.map((line, index) => {
        let content: ReactNode = line;
        if (copy.highlight && line.includes(copy.highlight)) {
            const before = line.slice(0, line.indexOf(copy.highlight));
            content = (
                <>
                    {before}
                    <HeroHighlight className={HIGHLIGHT_CLASS}>{copy.highlight}</HeroHighlight>
                </>
            );
        } else if (copy.accent && line.includes(copy.accent)) {
            const start = line.indexOf(copy.accent);
            content = (
                <>
                    {line.slice(0, start)}
                    <span className={cn(EMPHASIS, copy.accent === "mid-market" && "whitespace-nowrap")}>{copy.accent}</span>
                    {line.slice(start + copy.accent.length)}
                </>
            );
        }
        return (
            <span key={line} className={index === 0 && copy.lines.length > 1 ? "mb-3 block" : "block"}>
                {content}
            </span>
        );
    });
}
