import { APP_ORIGIN } from "@/lib/app-origin";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Property owners", href: "/owners" },
    { label: "CRE brokers", href: "/brokers" },
    { label: "CRE lenders", href: "/lenders" },
    { label: "Property managers", href: "/property-managers" },
    { label: "Appraisers", href: "/appraisers" },
    { label: "Insurance agents", href: "/insurance-agents" },
    { label: "1031 advisors", href: "/1031-advisors" },
    { label: "SF rent by neighborhood", href: `${APP_ORIGIN}/rent/sf` },
    { label: "Free rent comps tool", href: `${APP_ORIGIN}/analytics/rent-comps` },
    { label: "Rent prices by city", href: `${APP_ORIGIN}/rent` },
    { label: "Parking costs by city", href: `${APP_ORIGIN}/parking` },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
];

export function SiteFooter({ variant = "page" }: { variant?: "page" | "overlay" }) {
    const year = new Date().getFullYear();
    const linkClass =
        variant === "overlay"
            ? "transition-colors hover:text-white"
            : "transition-colors hover:text-gray-900 dark:hover:text-gray-100";

    const body = (
        <div className="space-y-6">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {FOOTER_LINKS.map((link) => (
                    <a key={link.label} href={link.href} className={linkClass}>
                        {link.label}
                    </a>
                ))}
            </nav>
            <p>© {year} OpenMidmarket</p>
        </div>
    );

    if (variant === "overlay") {
        return body;
    }

    return (
        <footer
            className={cn(
                "border-t border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500",
                "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400",
            )}
        >
            {body}
        </footer>
    );
}
