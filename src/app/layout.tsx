import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OM | Together, stronger",
  description: "OM - Together, stronger",
  keywords: ["OpenMidmarket", "News", "Vacancy", "Sales Listing", "Seminars", "Underwriting"],
  authors: [{ name: "OpenMidmarket" }],
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
          <div className="nav-brand">OpenMidmarket</div>
          <div className="nav-links" style={{ display: 'flex', justifyContent: 'center' }}>
            <a href="#news">News</a>
            <a href="#sales-listing">Sales Listing</a>
            <a href="#seminars">Seminars</a>
            <a href="#underwriting">CRM</a>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
            <a href="#login" style={{ fontSize: '0.9rem', letterSpacing: '0.1em' }}>Login</a>
            <button className="btn-primary">Sign up</button>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
