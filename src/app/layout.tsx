import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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
    title: "OpenMidmarket — The AI platform that democratizes the multifamily mid-market",
    description:
        "OpenMidmarket is the AI platform that democratizes the multifamily mid-market — AI-powered CRM, real-time market data, and a dedicated professional network in one clean workspace.",
    openGraph: {
        title: "OpenMidmarket — The AI platform that democratizes the multifamily mid-market",
        description: "AI-powered CRM, real-time market data, and a dedicated CRE professional network — in one workspace.",
        images: "/og-preview.jpeg",
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
