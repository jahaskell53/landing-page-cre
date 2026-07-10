"use client";

import type { ReactNode } from "react";
import { BarChart3, Bell, Building2, ChevronDown, ChevronRight, HelpCircle, Home, type LucideIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type PreviewPanelId =
    | "home"
    | "holdings"
    | "valuation"
    | "rent-comps"
    | "sales-comps"
    | "rent-trends"
    | "sales-trends"
    | "listings"
    | "research"
    | "network"
    | "news";

type PreviewNavChild = {
    label: string;
    panel: PreviewPanelId;
};

type PreviewNavSection = {
    id: string;
    label: string;
    icon: LucideIcon;
    panel?: PreviewPanelId;
    children?: PreviewNavChild[];
};

/** Mirrors the property-owner spine from the authenticated app sidebar. */
export const PREVIEW_SECTIONS: PreviewNavSection[] = [
    {
        id: "feed",
        label: "Home",
        icon: Home,
        children: [{ label: "My Feed", panel: "home" }],
    },
    {
        id: "my-assets",
        label: "My Assets",
        icon: Building2,
        panel: "holdings",
    },
    {
        id: "market",
        label: "Research",
        icon: BarChart3,
        children: [
            { label: "Sales Listings", panel: "listings" },
            { label: "Rent comps", panel: "rent-comps" },
            { label: "Rent charts", panel: "rent-trends" },
            { label: "Sales comps", panel: "sales-comps" },
            { label: "Sales charts", panel: "sales-trends" },
            { label: "Valuation", panel: "valuation" },
            { label: "Research", panel: "research" },
        ],
    },
    {
        id: "network",
        label: "Network",
        icon: Users,
        children: [
            { label: "Connections", panel: "network" },
            { label: "News", panel: "news" },
        ],
    },
];

const CHEVRON_SLOT = "flex h-4 w-4 shrink-0 items-center justify-center";
const ICON_SLOT = "h-4 w-4 shrink-0";
const CHILD_INDENT = "pl-[3.25rem]";

export const PREVIEW_PANEL_ORDER: PreviewPanelId[] = [
    "home",
    "holdings",
    "valuation",
    "rent-comps",
    "sales-comps",
    "rent-trends",
    "sales-trends",
    "listings",
    "research",
    "network",
    "news",
];

function sectionForPanel(panel: PreviewPanelId): string {
    for (const section of PREVIEW_SECTIONS) {
        if (section.panel === panel) return section.id;
        if (section.children?.some((c) => c.panel === panel)) return section.id;
    }
    return "feed";
}

function MockAccountAvatar() {
    return (
        <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
            style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)" }}
        >
            JR
        </div>
    );
}

interface PreviewAppShellProps {
    activePanel: PreviewPanelId;
    onPanelSelect?: (panel: PreviewPanelId) => void;
    children: ReactNode;
}

export function PreviewAppShell({ activePanel, onPanelSelect, children }: PreviewAppShellProps) {
    const interactive = !!onPanelSelect;
    const activeSectionId = sectionForPanel(activePanel);

    const rowClass = (active: boolean) =>
        cn(
            "flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm font-medium transition-colors",
            active
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/80",
            interactive ? "cursor-pointer" : "cursor-default",
        );

    const handleSectionClick = (section: PreviewNavSection) => {
        if (!interactive || !onPanelSelect) return;
        const target = section.panel ?? section.children?.[0]?.panel;
        if (target) onPanelSelect(target);
    };

    return (
        <div className="flex min-w-0 overflow-hidden bg-white dark:bg-gray-900">
            <aside className="hidden w-[210px] shrink-0 flex-col border-r border-gray-200/80 bg-gray-50 sm:flex dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-2 p-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded bg-blue-900 text-[11px] font-bold text-white dark:bg-blue-600 dark:text-white">
                        OM
                    </span>
                    <span className="min-w-0 truncate text-xs font-semibold text-gray-900 dark:text-gray-100">OpenMidmarket</span>
                </div>

                <nav className="space-y-0.5 overflow-y-auto px-3 py-2">
                    {PREVIEW_SECTIONS.map((section) => {
                        const Icon = section.icon;
                        const grouped = !!section.children?.length;
                        const sectionActive = section.id === activeSectionId;

                        if (!grouped) {
                            const active = section.panel === activePanel;
                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    disabled={!interactive}
                                    onClick={() => section.panel && onPanelSelect?.(section.panel)}
                                    className={rowClass(active)}
                                >
                                    <span className={CHEVRON_SLOT} aria-hidden />
                                    <Icon className={ICON_SLOT} />
                                    <span>{section.label}</span>
                                </button>
                            );
                        }

                        const open = sectionActive;
                        const headerActive = sectionActive && !open;

                        return (
                            <div key={section.id}>
                                <button
                                    type="button"
                                    disabled={!interactive}
                                    onClick={() => handleSectionClick(section)}
                                    className={rowClass(headerActive)}
                                    aria-expanded={open}
                                >
                                    <span className={CHEVRON_SLOT}>
                                        {open ? (
                                            <ChevronDown className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" strokeWidth={3} />
                                        ) : (
                                            <ChevronRight className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" strokeWidth={3} />
                                        )}
                                    </span>
                                    <Icon className={ICON_SLOT} />
                                    <span className={cn(headerActive && "text-blue-600 dark:text-blue-400")}>{section.label}</span>
                                </button>
                                {open ? (
                                    <div className="mt-0.5 space-y-0.5">
                                        {section.children!.map((child) => {
                                            const active = child.panel === activePanel;
                                            return (
                                                <button
                                                    key={child.label}
                                                    type="button"
                                                    disabled={!interactive}
                                                    onClick={() => onPanelSelect?.(child.panel)}
                                                    className={cn(rowClass(active), CHILD_INDENT)}
                                                >
                                                    <span>{child.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            <div className="grid min-w-0 flex-1 overflow-hidden">
                <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-gray-200/80 bg-gray-50 px-4 dark:border-gray-800 dark:bg-gray-950">
                    <div className="min-w-0 flex-1" />
                    <div className="flex shrink-0 items-center gap-1">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 dark:text-gray-400">
                            <HelpCircle className="h-5 w-5" />
                        </span>
                        <span className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 dark:text-gray-400">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                                3
                            </span>
                        </span>
                        <MockAccountAvatar />
                    </div>
                </header>

                <div className="min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900">{children}</div>
            </div>
        </div>
    );
}
