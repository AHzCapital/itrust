"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Menu, Search, ShieldCheck, Sparkles, X } from "lucide-react";

const assets = [
  { title: "Contemporary Villa with Nile View", location: "Cairo, Egypt", price: "EGP 45M", type: "Residential", badge: "Verified" },
  { title: "Skyline Penthouse", location: "New Cairo, Egypt", price: "EGP 18M", type: "Residential", badge: "Verified" },
  { title: "Modern Commercial Building", location: "Giza, Egypt", price: "EGP 32M", type: "Commercial", badge: "Verified" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <nav className="nav">
        <a className="logo" href="#top">Trust<span>.</span>Me</a>
        <div className={menuOpen ? "navLinks mobileOpen" : "navLinks"}>
          <a href="#assets" onClick={() => setMenuOpen(false)}>Explore Assets</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#sell" onClick={() => setMenuOpen(false)}>Sell an Asset</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </div>
        <div className="navActions">
          <button className="searchBtn" aria-label="Search"><Search size={18} /></button>
          <a className="login" href="#login">Log in</a>
          <a className="primary small" href="#signup">Get Started</a>
          <button className="menuBtn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="heroGlow" />
        <div className="heroCopy">
          <div className="eyebrow"><ShieldCheck size={15} /> Egypt&apos;s verified asset marketplace</div>
          <h1>Own with <em>confidence.</em></h1>
          <p>Discover valuable assets with verified ownership, documentation, and provenance — all in one trusted marketplace.</p>
          <div className="heroCtas">
            <a className="primary" href="#assets">Explore verified assets <ArrowRight size={17} /></a>
            <a className="secondary" href="#sell">List your asset</a>
          </div>
          <div className="trustLine"><CheckCircle2 size={16} /> Every listed asset goes through verification.</div>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="passportCard">
            <div className="passportTop"><span>TRUST.ME</span><span>ASSET PASSPORT</span></div>
            <div className="passportSeal"><ShieldCheck size={38} /></div>
            <div className="passportTitle">VERIFIED ASSET</div>
            <div className="passportLine" /><div className="passportLine short" />
            <div className="passportBottom"><span>OWNERSHIP</span><strong>VERIFIED</strong></div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div><strong>100%</strong><span>Verification-first</span></div>
        <div><strong>EGP</strong><span>Built for Egypt</span></div>
        <div><strong>24/7</strong><span>Access to opportunities</span></div>
        <div><strong>1</strong><span>Trusted destination</span></div>
      </section>

      <section className="section" id="assets">
        <div className="sectionHead"><div><span className="kicker">CURATED MARKETPLACE</span><h2>Assets worth <em>trusting.</em></h2></div><a className="textLink" href="#all">View all assets <ArrowRight size={16} /></a></div>
        <div className="assetGrid">
          {assets.map((asset, i) => <article className="assetCard" key={asset.title}>
            <div className={`assetImage image${i + 1}`}><span className="verified"><CheckCircle2 size={14} /> {asset.badge}</span><button className="heart" aria-label="Save asset">♡</button></div>
            <div className="assetInfo"><div className="assetType">{asset.type}</div><h3>{asset.title}</h3><p>{asset.location}</p><div className="assetFooter"><strong>{asset.price}</strong><ArrowRight size={18} /></div></div>
          </article>)}
        </div>
      </section>

      <section className="passportSection" id="how">
        <div className="passportText"><span className="kicker">THE TRUST.ME STANDARD</span><h2>Every asset has a <em>story.</em><br />We verify it.</h2><p>Our Asset Passport brings ownership, documentation, verification status, and essential details together into a single, easy-to-understand record.</p><div className="checks"><span><CheckCircle2 /> Ownership reviewed</span><span><CheckCircle2 /> Documentation checked</span><span><CheckCircle2 /> Details made transparent</span></div><a className="secondary light" href="#learn">Learn how verification works <ArrowRight size={17} /></a></div>
        <div className="miniPassport"><div className="miniHeader">TRUST.ME <span>01 / 04</span></div><div className="miniCircle"><ShieldCheck size={30} /></div><p>ASSET PASSPORT</p><h3>Verification<br />Complete</h3><div className="miniStamp">✓ VERIFIED</div></div>
      </section>

      <section className="cta" id="sell"><Sparkles size={18} /><h2>Have something valuable?</h2><p>Bring your asset to a marketplace built around trust, transparency, and serious buyers.</p><a className="primary" href="#list">List an asset <ArrowRight size={17} /></a></section>

      <footer id="about"><div><a className="logo" href="#top">Trust<span>.</span>Me</a><p>Verified. Valuable. Yours.</p></div><div className="footerLinks"><a href="#assets">Explore</a><a href="#how">Verification</a><a href="#sell">Sell</a><a href="#about">About</a></div><div className="copyright">© 2026 Trust.Me</div></footer>
    </main>
  );
}
