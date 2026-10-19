"use client";

import { type ReactNode, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Same fade used by the app-preview tab stack and the rent-trends city views. */
export const PREVIEW_FADE_TRANSITION = { duration: 0.3, ease: "easeInOut" } as const;

export function PreviewFade({
    active,
    className,
    children,
}: {
    active: boolean;
    className?: string;
    children: ReactNode;
}) {
    return (
        <motion.div
            className={className}
            animate={{ opacity: active ? 1 : 0 }}
            transition={PREVIEW_FADE_TRANSITION}
            aria-hidden={!active}
            style={{ pointerEvents: active ? "auto" : "none", zIndex: active ? 1 : 0 }}
        >
            {children}
        </motion.div>
    );
}

export function PreviewFadeStack<T extends { id: string }>({
    items,
    activeId,
    className,
    itemClassName,
    children,
}: {
    items: T[];
    activeId: string;
    className?: string;
    itemClassName?: string;
    children: (item: T) => ReactNode;
}) {
    return (
        <div className={cn("grid min-w-0 overflow-hidden", className)}>
            {items.map((item) => (
                <PreviewFade key={item.id} active={item.id === activeId} className={cn("col-start-1 row-start-1 min-w-0", itemClassName)}>
                    {children(item)}
                </PreviewFade>
            ))}
        </div>
    );
}

export function usePreviewSelection<T extends string>(initial: T) {
    const [selected, setSelected] = useState(initial);
    return [selected, setSelected] as const;
}

export function usePreviewToggle<T extends string>(initial: T | null = null) {
    const [selected, setSelected] = useState<T | null>(initial);
    const toggle = (id: T) => setSelected((current) => (current === id ? null : id));
    return [selected, toggle] as const;
}

const CARD_SELECTED = "border-blue-600 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-900/20";
const CARD_IDLE = "hover:border-gray-300 dark:hover:border-gray-600";
const ROW_SELECTED = "bg-blue-50 dark:bg-blue-900/20";
const ROW_IDLE = "hover:bg-gray-50 dark:hover:bg-gray-800/80";

export function PreviewSelectable({
    selected,
    onSelect,
    variant = "card",
    as = "button",
    className,
    children,
}: {
    selected: boolean;
    onSelect: () => void;
    variant?: "card" | "row";
    as?: "button" | "div" | "tr";
    className?: string;
    children: ReactNode;
}) {
    const variantClass = variant === "row" ? (selected ? ROW_SELECTED : ROW_IDLE) : selected ? CARD_SELECTED : CARD_IDLE;
    const classes = cn("cursor-pointer text-left transition-colors", variantClass, className);

    if (as === "tr") {
        return (
            <tr aria-selected={selected} onClick={onSelect} className={classes}>
                {children}
            </tr>
        );
    }

    if (as === "div") {
        return (
            <div role="button" tabIndex={0} aria-pressed={selected} onClick={onSelect} onKeyDown={onActivate(onSelect)} className={classes}>
                {children}
            </div>
        );
    }

    return (
        <button type="button" aria-pressed={selected} onClick={onSelect} className={classes}>
            {children}
        </button>
    );
}

function onActivate(onSelect: () => void) {
    return (event: { key: string; preventDefault: () => void }) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
        }
    };
}

export function PreviewChip({
    selected,
    onSelect,
    color,
    className,
    children,
}: {
    selected: boolean;
    onSelect: () => void;
    color?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick={onSelect}
            className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-opacity",
                "cursor-pointer hover:opacity-100",
                selected ? "opacity-100" : "opacity-40",
                !color &&
                    (selected
                        ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200"
                        : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"),
                className,
            )}
            style={color ? { borderColor: color, color, backgroundColor: `${color}${selected ? "28" : "14"}` } : undefined}
        >
            {children}
        </button>
    );
}

export function PreviewUnderlineTabs<T extends string>({
    tabs,
    value,
    onChange,
}: {
    tabs: readonly T[];
    value: T;
    onChange: (tab: T) => void;
}) {
    return (
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    aria-pressed={tab === value}
                    onClick={() => onChange(tab)}
                    className={cn(
                        "shrink-0 cursor-pointer border-b-2 pb-0.5 text-[11px] font-medium",
                        tab === value
                            ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                            : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400",
                    )}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
