"use client";

import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isBrokers = pathname?.startsWith("/brokers");

  return (
    <nav className="nav">
      <div className="nav-brand">OpenMidmarket</div>
      <div className="nav-links" style={{ display: "flex", justifyContent: "center" }}>
        {isBrokers ? (
          <>
            <a href="#news">News</a>
            <a href="#sales-listing">Sales Listing</a>
            <a href="#seminars">Seminars</a>
            <a href="#underwriting">CRM</a>
          </>
        ) : (
          <>
            <a href="/brokers">Brokers</a>
            <a href="#lenders">Lenders</a>
            <a href="#owners">Owners</a>
          </>
        )}
      </div>
      <div className="nav-actions" style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "flex-end" }}>
        <a className="nav-login" href="https://app.openmidmarket.com/login" style={{ fontSize: "0.9rem", letterSpacing: "0.1em" }}>Login</a>
        <a className="btn-primary" href="https://app.openmidmarket.com/signup">Sign Up Free</a>
      </div>
    </nav>
  );
}
