"use client";

import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isBrokers = pathname?.startsWith("/brokers");
  const isOwners = pathname?.startsWith("/owners");

  return (
    <nav className="nav">
      <div className="nav-brand">OpenMidmarket</div>
      <div className="nav-links" style={{ display: "flex", justifyContent: "center" }}>
        {isBrokers ? (
          <>
            <a href="/">Home</a>
            <a href="#relationships">CRM</a>
            <a href="#seminars">Seminars</a>
          </>
        ) : isOwners ? (
          <>
            <a href="/">Home</a>
            <a href="#valuations">Valuations</a>
            <a href="#insights">Insights</a>
          </>
        ) : (
          <>
            <a href="/brokers">Brokers</a>
            <a href="#lenders">Lenders</a>
            <a href="/owners">Owners</a>
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
