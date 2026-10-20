import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { TrackedLink } from "@/components/tracking/tracked-link";
import { Button } from "@/components/ui/button";
import { APP_ORIGIN } from "@/lib/app-origin";
import { NavSignupCtaButton } from "./signup-cta";

type NavLink = {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
};

const NAV_LINKS: NavLink[] = [
    {
        label: "Features",
        href: "/#features",
        children: [
            { label: "Holdings", href: "/#preview-holdings" },
            { label: "Valuation", href: "/#preview-valuation" },
            { label: "Rent comps", href: "/#preview-rent-comps" },
            { label: "Sales comps", href: "/#preview-sales-comps" },
            { label: "Rent charts", href: "/#preview-rent-trends" },
            { label: "Sales charts", href: "/#preview-sales-trends" },
            { label: "Sales Listings", href: "/#preview-listings" },
            { label: "Research", href: "/#preview-research" },
            { label: "Connections", href: "/#preview-network" },
            { label: "News", href: "/#preview-news" },
        ],
    },
    { label: "Property owners", href: "/owners" },
    { label: "CRE brokers", href: "/brokers" },
    { label: "CRE lenders", href: "/lenders" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-gray-50/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                    <span className="flex size-6 items-center justify-center rounded bg-blue-900 text-[11px] font-bold text-white dark:bg-blue-600 dark:text-white">
                        OM
                    </span>
                    OpenMidmarket
                </Link>
                <div className="hidden items-center gap-7 text-sm text-gray-600 lg:flex dark:text-gray-400">
                    {NAV_LINKS.map((link) =>
                        link.children ? (
                            <div key={link.label} className="group relative">
                                <a href={link.href} className="flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-gray-100">
                                    {link.label}
                                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                                </a>
                                <div className="invisible absolute top-full left-0 z-30 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                                    <div className="grid w-[26rem] grid-cols-2 gap-0.5 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                                        {link.children.map((child) => (
                                            <a
                                                key={child.label}
                                                href={child.href}
                                                className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                                            >
                                                {child.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <a key={link.label} href={link.href} className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
                                {link.label}
                            </a>
                        ),
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <TrackedLink href={`${APP_ORIGIN}/login`} trackingLocation="header_login">
                            Log in
                        </TrackedLink>
                    </Button>
                    <NavSignupCtaButton trackingLocation="header_signup" />
                </div>
            </nav>
        </header>
    );
}
