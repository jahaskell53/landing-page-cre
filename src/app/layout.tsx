import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { HERO_PAGE_TITLES } from "@/lib/hero-copy";
import { SITE_ORIGIN } from "@/lib/organization";
import { DEFAULT_LANDING_DESCRIPTION, DEFAULT_OG_IMAGE, ORGANIZATION_NAME } from "@/lib/seo";
import { cn as cx } from "@/lib/utils";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import "@/styles/globals.css";

const inter = localFont({
    src: [
        {
            path: "./fonts/InterVariable.woff2",
            style: "normal",
        },
        {
            path: "./fonts/InterVariable-Italic.woff2",
            style: "italic",
        },
    ],
    display: "swap",
    variable: "--font-inter",
    weight: "100 900",
    fallback: ["-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_ORIGIN),
    title: HERO_PAGE_TITLES.control,
    description: DEFAULT_LANDING_DESCRIPTION,
    openGraph: {
        siteName: ORGANIZATION_NAME,
        type: "website",
        title: HERO_PAGE_TITLES.control,
        description: DEFAULT_LANDING_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
        card: "summary_large_image",
        title: HERO_PAGE_TITLES.control,
        description: DEFAULT_LANDING_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE.url],
    },
};

export const viewport: Viewport = {
    themeColor: "#1e3a8a",
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cx(inter.variable, "bg-primary antialiased")}>
                <RouteProvider>
                    <Theme>{children}</Theme>
                </RouteProvider>
            </body>
        </html>
    );
}
