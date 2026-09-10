"use client";

import Link from "next/link";
import { ArrowRight, Check, TrendingUp, Users } from "lucide-react";
import { compactNumber, currentDiscoveryPeople } from "@/lib/discovery";
import { initials, profileUrl, readStorage, SocialPost } from "@/lib/social";
import { assets } from "@/lib/data";

export default function ExplorePage() {
  const people = currentDiscoveryPeople().sort((a,b) => b.followers - a.followers);
  const posts = typeof window === "undefined" ? [] : readStorage<SocialPost[]>("trustme-posts", []);
  return <main className="explorePage"><header className="exploreHead"><div><span className="kicker">DISCOVERY</span><h1>Explore</h1><p>Discover the people, ideas and assets shaping Trust.Me.</p></div><Link className="secondary" href="/people">View all people <ArrowRight size={15}/></Link></header>
    <div className="discoveryGrid"><section className="discoverPanel"><span className="kicker">THE TRUST.ME NETWORK</span><h2>Most followed</h2><p className="panelSub">The most followed members on Trust.Me.</p><div className="discoverList">{people.slice(0,5).map((p,i) => <div className="rankRow" key={p.username}><span className="rankNo">{String(i+1).padStart(2,"0")}</span><Link href={profileUrl(p.username)} className="personAvatar">{p.image ? <img src={p.image} alt=""/> : initials(p.name)}</Link><div className="personMeta"><Link href={profileUrl(p.username)}><strong>{p.name} {p.verified && <span className="verifiedDot"><Check size={9}/></span>}</strong></Link><span>@{p.username}</span></div><div className="followCount"><strong>{compactNumber(p.followers)}</strong> followers</div></div>)}</div></section>
      <section className="discoverPanel"><span className="kicker">DISCOVER</span><h2>People to follow</h2><p className="panelSub">Build your network around trusted voices.</p>{people.slice(0,3).map(p => <div className="rankRow" key={p.username}><Link href={profileUrl(p.username)} className="personAvatar">{p.image ? <img src={p.image} alt=""/> : initials(p.name)}</Link><div className="personMeta"><Link href={profileUrl(p.username)}><strong>{p.name}</strong></Link><span>@{p.username}</span></div><span className="rankBadge">{p.verified ? "Verified" : "Member"}</span></div>)}</section></div>
    <section className="discoverPanel" style={{marginTop:22}}><span className="kicker">MARKETPLACE</span><h2>Popular assets</h2><p className="panelSub">Explore verified opportunities alongside the people behind the market.</p><div className="discoverList">{assets.slice(0,3).map(asset => <Link className="rankRow" href={`/assets/${asset.id}`} key={asset.id}><span className="rankBadge">Verified</span><div className="personMeta"><strong>{asset.title}</strong><span>{asset.location}</span></div><div className="followCount"><strong>{asset.price}</strong></div></Link>)}</div></section>
    <section className="discoverPanel" style={{marginTop:22}}><span className="kicker">LATEST</span><h2>Latest posts</h2><p className="panelSub">Fresh ideas from the Trust.Me network.</p>{posts.length ? posts.slice(0,4).map(post => <Link className="rankRow" href={profileUrl(post.authorUsername)} key={post.id}><TrendingUp size={18}/><div className="personMeta"><strong>@{post.authorUsername}</strong><span>{post.text || "Shared media"}</span></div><ArrowRight size={15}/></Link>) : <div className="emptyState" style={{padding:40}}><Users size={22}/><h2>The network is growing.</h2><p>Be among the first to build your network and publish on Trust.Me.</p></div>}</section>
  </main>;
}
