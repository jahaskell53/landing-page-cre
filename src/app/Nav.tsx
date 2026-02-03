"use client";

import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isBrokers = pathname?.startsWith("/brokers");
  const isOwners = pathname?.startsWith("/owners");
  const isLenders = pathname?.startsWith("/lenders");

  return (
    <nav className="nav">
      <a href="/" className="nav-brand">OpenMidmarket</a>
      <div className="nav-links" style={{ display: "flex", justifyContent: "center" }}>
        {isBrokers ? (
          <>
            <a href="#relationships">CRM</a>
            <a href="#seminars">Seminars</a>
            <a href="#pipeline">Pipeline</a>
          </>
        ) : isOwners ? (
          <>
            <a href="/">Home</a>
            <a href="#valuations">Valuations</a>
            <a href="#insights">Insights</a>
          </>
        ) : isLenders ? (
          <>
            <a href="/">Home</a>
            <a href="#dealflow">Deal Flow</a>
            <a href="#underwriting">Underwriting</a>
          </>
        ) : (
          <>
            <a href="/brokers">Brokers</a>
            <a href="/lenders">Lenders</a>
            <a href="/owners">Property Owners</a>
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
