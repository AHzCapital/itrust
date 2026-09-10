import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="profilePage">
      <section className="profileGate">
        <SearchX size={28} aria-hidden="true" />
        <span className="kicker">TRUST.ME · 404</span>
        <h1>We couldn&apos;t find that page.</h1>
        <p>The address may be incorrect, or the page may no longer be available.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <Link className="primary" href="/"><ArrowLeft size={16} /> Return home</Link>
          <Link className="secondaryButton" href="/assets">Explore assets</Link>
        </div>
      </section>
    </main>
  );
}
