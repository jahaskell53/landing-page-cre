import type { Metadata } from "next";
import "./globals.css";
import Nav from "./Nav";

export const metadata: Metadata = {
  title: "OpenMidmarket: AI Hub for the midmarket",
  description: "Institutional-grade AI hub for the midmarket",
  keywords: ["OpenMidmarket", "News", "Vacancy", "Sales Listing", "Seminars", "Underwriting"],
  authors: [{ name: "OpenMidmarket" }],
  openGraph: {
    images: ["/preview.jpeg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
