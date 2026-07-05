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
    title: "Institutional-grade CRE platform. Built for the mid-market.",
    description:
        "A unified ecosystem leveraging predictive AI, real-time data, and a dedicated CRE professional network. Gain an edge with institutional power tailored for your speed.",
    openGraph: {
        title: "Institutional-grade CRE platform. Built for the mid-market.",
        description:
            "A unified ecosystem leveraging predictive AI, real-time data, and a dedicated CRE professional network. Gain an edge with institutional power tailored for your speed.",
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
