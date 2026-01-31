import type { Metadata } from "next";
import "./globals.css";
import Nav from "./Nav";

export const metadata: Metadata = {
  title: "OM | Together, stronger",
  description: "OM - Together, stronger",
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
