"use client";

import Link from "next/link";
import { RefreshCw, ShieldAlert } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f5ef", color: "#151817", fontFamily: "Arial, sans-serif" }}>
          <section style={{ width: "min(560px, 100%)", textAlign: "center", padding: 48, border: "1px solid rgba(21,24,23,.12)", background: "rgba(255,255,255,.72)" }}>
            <ShieldAlert size={30} aria-hidden="true" />
            <p style={{ letterSpacing: ".14em", fontSize: 11, margin: "20px 0 10px", opacity: .65 }}>TRUST.ME · SYSTEM ERROR</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(34px, 6vw, 56px)", lineHeight: 1.05, margin: 0 }}>We&apos;ll get you back in.</h1>
            <p style={{ lineHeight: 1.7, opacity: .72 }}>The application encountered an unexpected problem. Try again or return to the home page.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
              <button onClick={() => reset()} style={{ border: 0, padding: "12px 18px", background: "#153d2d", color: "white", cursor: "pointer" }}><RefreshCw size={15} /> Try again</button>
              <Link href="/" style={{ padding: "11px 18px", border: "1px solid rgba(21,24,23,.18)", color: "inherit", textDecoration: "none" }}>Return home</Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
