"use client";

import { useMemo, useState } from "react";
import SiteHeader from "@/components/site-header";
import AssetCard from "@/components/asset-card";
import { assets, categories } from "@/lib/data";

export default function AssetsPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => assets.filter((asset) => {
    const matchesCategory = category === "All" || asset.type === category;
    const q = query.trim().toLowerCase();
    return matchesCategory && (!q || `${asset.title} ${asset.location} ${asset.type}`.toLowerCase().includes(q));
  }), [category, query]);

  return (
    <main>
      <SiteHeader />
      <section className="marketHero">
        <div><span className="kicker">VERIFIED MARKETPLACE</span><h1>Find something <em>worth owning.</em></h1><p>Explore verified assets across Egypt, each presented with a clear Asset Passport and verification trail.</p></div>
        <div className="marketSearch"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by asset, location or type" aria-label="Search assets" /></div>
      </section>
      <section className="marketSection">
        <div className="filterBar"><div className="filters">{categories.map((item) => <button key={item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="resultCount">{filtered.length} verified assets</span></div>
        {filtered.length ? <div className="assetGrid marketplaceGrid">{filtered.map((asset) => <AssetCard key={asset.id} asset={asset} />)}</div> : <div className="emptyState"><h2>No matching assets</h2><p>Try another search or category.</p><button className="secondary" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</button></div>}
      </section>
    </main>
  );
}
