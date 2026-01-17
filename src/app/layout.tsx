import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Renaissance | Elite CRM for Realtors",
  description: "A profound shift in real estate relationship management. Experience the elegance of architectural precision for the modern agent.",
  keywords: ["CRM", "Realtors", "Real Estate", "Luxury CRM", "Relationship Management"],
  authors: [{ name: "Antigravity Design" }],
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
        <nav className="nav">
          <div className="nav-brand">RENAISSANCE</div>
          <div className="nav-links">
            <a href="#philosophy">Philosophy</a>
            <a href="#features">Function</a>
            <a href="#contact">Connect</a>
          </div>
          <button className="btn-primary">Get Access</button>
        </nav>
        {children}
      </body>
    </html>
  );
}
