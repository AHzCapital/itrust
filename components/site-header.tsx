"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <Link className="logo" href="/" onClick={close}>Trust<span>.</span>Me</Link>
      <nav className={open ? "navLinks mobileOpen" : "navLinks"}>
        <Link href="/assets" onClick={close}>Explore Assets</Link>
        <Link href="/how-it-works" onClick={close}>How It Works</Link>
        <Link href="/sell" onClick={close}>Sell an Asset</Link>
        <Link href="/about" onClick={close}>About</Link>
      </nav>
      <div className="navActions">
        <Link className="searchBtn" href="/assets" aria-label="Search assets"><Search size={18} /></Link>
        <Link className="login" href="/login">Log in</Link>
        <Link className="primary small" href="/signup">Get Started</Link>
        <button className="menuBtn" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>
  );
}
