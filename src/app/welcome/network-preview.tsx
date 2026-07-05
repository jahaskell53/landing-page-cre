"use client";

import { CalendarIcon, CellularIcon, CheckIcon, MailIcon, PlusIcon, SearchIcon, StarIcon } from "@/app/(app)/network/icons";
import { generateAuroraGradient, getInitials } from "@/app/(app)/network/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type MockPerson = {
    id: string;
    name: string;
    starred: boolean;
    hasEmail: boolean;
    category?: "Property Owner" | "Lender" | "Realtor";
    networkStrength: "HIGH" | "MEDIUM" | "LOW";
    auto?: boolean;
    history: { text: string; date: string; type: "email" | "meeting" }[];
};

const MOCK_PEOPLE: MockPerson[] = [
    {
        id: "1",
        name: "Dana Reyes",
        starred: true,
        hasEmail: true,
        category: "Realtor",
        networkStrength: "HIGH",
        auto: true,
        history: [
            { type: "email", text: "Re: 24-unit Oakland listing", date: "2 days ago" },
            { type: "meeting", text: "Coffee at Philz — deal flow", date: "Nov 12 2025" },
        ],
    },
    {
        id: "2",
        name: "Priya Shah",
        starred: true,
        hasEmail: true,
        category: "Lender",
        networkStrength: "MEDIUM",
        history: [{ type: "email", text: "Bridge loan terms follow-up", date: "1 week ago" }],
    },
    {
        id: "3",
        name: "Marcus Lee",
        starred: false,
        hasEmail: false,
        category: "Property Owner",
        networkStrength: "LOW",
        history: [],
    },
    {
        id: "4",
        name: "Elena Chen",
        starred: false,
        hasEmail: true,
        category: "Realtor",
        networkStrength: "MEDIUM",
        auto: true,
        history: [{ type: "email", text: "Intro to Palo Alto seller", date: "3 weeks ago" }],
    },
    {
        id: "5",
        name: "James Ortiz",
        starred: false,
        hasEmail: true,
        category: "Lender",
        networkStrength: "MEDIUM",
        history: [{ type: "meeting", text: "Quarterly lender roundtable", date: "Oct 28 2025" }],
    },
    {
        id: "6",
        name: "Sofia Martinez",
        starred: true,
        hasEmail: true,
        category: "Realtor",
        networkStrength: "HIGH",
        auto: true,
        history: [{ type: "email", text: "Menlo Park duplex — off-market", date: "4 days ago" }],
    },
    {
        id: "7",
        name: "Kevin Nguyen",
        starred: false,
        hasEmail: true,
        category: "Property Owner",
        networkStrength: "MEDIUM",
        history: [{ type: "meeting", text: "Site walk — Sunnyvale 18-unit", date: "Sep 15 2025" }],
    },
    {
        id: "8",
        name: "Rachel Kim",
        starred: false,
        hasEmail: true,
        category: "Lender",
        networkStrength: "HIGH",
        history: [{ type: "email", text: "Refi quote on Fremont portfolio", date: "2 weeks ago" }],
    },
    {
        id: "9",
        name: "Tom Bradley",
        starred: false,
        hasEmail: false,
        category: "Property Owner",
        networkStrength: "LOW",
        history: [],
    },
    {
        id: "10",
        name: "Anita Patel",
        starred: true,
        hasEmail: true,
        category: "Realtor",
        networkStrength: "MEDIUM",
        auto: true,
        history: [
            { type: "email", text: "Cap rate comps for San Mateo", date: "5 days ago" },
            { type: "meeting", text: "Broker open house recap", date: "Oct 3 2025" },
        ],
    },
];

const SELECTED_ID = "1";
const TABS = ["Network", "Board", "Map", "Directory"] as const;

function MockPersonRow({ person, selected }: { person: MockPerson; selected: boolean }) {
    return (
        <div className={cn("flex items-center gap-1.5 px-2.5 py-2", selected && "bg-gray-50 dark:bg-gray-800")}>
            <div className="size-3.5 shrink-0 rounded border border-gray-300 dark:border-gray-600" />
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                    <span className="truncate text-xs text-gray-900 dark:text-gray-100">{person.name}</span>
                    {person.starred && <StarIcon className="size-2.5 shrink-0 text-amber-400" filled />}
                    {person.hasEmail && <MailIcon className="size-2.5 shrink-0 text-teal-500" />}
                </div>
            </div>
            <span className="shrink-0 rounded-md border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400">
                Connect
            </span>
            <Avatar className="size-6 shrink-0">
                <AvatarFallback className="text-[10px] font-medium text-white" style={{ background: generateAuroraGradient(person.name) }}>
                    {getInitials(person.name)}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}

function MockDetailPanel({ person }: { person: MockPerson }) {
    return (
        <div className="flex h-full w-60 shrink-0 flex-col overflow-hidden bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4 flex flex-col items-center">
                    <Avatar className="mb-2 size-14">
                        <AvatarFallback className="text-lg font-medium text-white" style={{ background: generateAuroraGradient(person.name) }}>
                            {getInitials(person.name)}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="max-w-full truncate text-center text-sm font-medium text-gray-900 dark:text-gray-100">{person.name}</h2>
                    <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
                        {person.auto && (
                            <Badge
                                variant="secondary"
                                className="bg-gray-100 px-1.5 py-0 text-[10px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            >
                                AUTO
                            </Badge>
                        )}
                        {person.category && (
                            <Badge
                                variant="secondary"
                                className="bg-blue-100 px-1.5 py-0 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                                {person.category}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="mb-1.5 text-[10px] font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">Network Strength</h3>
                    <div className="flex items-center gap-1.5">
                        <CellularIcon strength={person.networkStrength} className="size-3.5" />
                        <Badge
                            variant="secondary"
                            className="bg-gray-100 px-1.5 py-0 text-[10px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                            {person.networkStrength}
                        </Badge>
                    </div>
                </div>

                <Separator className="my-3" />

                <div>
                    <h3 className="mb-2 text-[10px] font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">History</h3>
                    {person.history.length > 0 ? (
                        <div className="space-y-2">
                            {person.history.map((item) => (
                                <div key={item.text} className="flex gap-1.5">
                                    <div className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/30">
                                        {item.type === "email" ? (
                                            <MailIcon className="size-2 text-blue-600 dark:text-blue-400" />
                                        ) : (
                                            <CalendarIcon className="size-2 text-blue-600 dark:text-blue-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] leading-snug text-gray-700 dark:text-gray-300">{item.text}</p>
                                        <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">No history yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export function NetworkPreview() {
    const selected = MOCK_PEOPLE.find((p) => p.id === SELECTED_ID)!;

    return (
        <div aria-hidden className="pointer-events-none -m-6 flex min-h-[480px] flex-col overflow-hidden bg-white select-none dark:bg-gray-900">
            <div className="shrink-0 border-b border-gray-200 px-3 py-2.5 dark:border-gray-800">
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                        {TABS.map((tab) => (
                            <span
                                key={tab}
                                className={cn(
                                    "shrink-0 border-b-2 pb-0.5 text-[11px] font-medium",
                                    tab === "Network"
                                        ? "border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                                        : "border-transparent text-gray-500 dark:text-gray-400",
                                )}
                            >
                                {tab}
                            </span>
                        ))}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                        <StarIcon className="size-3 text-gray-400" />
                        <svg className="size-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <SearchIcon className="size-3 text-gray-400" />
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">Recency</span>
                        <CheckIcon className="size-3 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
                <div className="flex min-w-0 flex-[3] flex-col overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-3 py-1.5 dark:border-gray-800">
                        <span className="text-[10px] font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">{MOCK_PEOPLE.length} People</span>
                        <PlusIcon className="size-3.5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
                        {MOCK_PEOPLE.map((person) => (
                            <MockPersonRow key={person.id} person={person} selected={person.id === SELECTED_ID} />
                        ))}
                    </div>
                </div>

                <div className="w-px shrink-0 bg-gray-200 dark:bg-gray-800" />

                <MockDetailPanel person={selected} />
            </div>
        </div>
    );
}
