"use client";

import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, Compass, Menu, Search, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AssetCard from "@/components/asset-card";
import { assets } from "@/lib/data";
import { compactNumber, currentDiscoveryPeople, DiscoveryPerson } from "@/lib/discovery";
import { BOOKMARKS_KEY, SocialPost, formatPostDate, initials, postUrl, profileUrl, PROFILE_KEY, readStorage, SocialProfile } from "@/lib/social";

function AuthenticatedHome() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [people, setPeople] = useState<DiscoveryPerson[]>([]);
  const [profile, setProfile] = useState<SocialProfile | null>(null);

  useEffect(() => {
    setPosts(readStorage<SocialPost[]>("trustme-posts", []));
    setPeople(currentDiscoveryPeople().sort((a, b) => b.followers - a.followers));
    setProfile(readStorage<SocialProfile | null>(PROFILE_KEY, null));
  }, []);

  const name = profile?.name || session?.user?.name || "Member";
  const username = profile?.username || name.toLowerCase().replace(/[^a-z0-9_]/g, "") || "member";
  const ownProfileUrl = profileUrl(username);

  return <main className="socialHome">
    <section className="socialHomeHero">
      <div><span className="kicker">YOUR TRUST.ME</span><h1>Good to see you, <em>{name.split(" ")[0]}.</em></h1><p>Your network, verified opportunities and the people shaping Trust.Me — in one place.</p></div>
      <Link className="primary" href={ownProfileUrl}>Open your profile <ArrowRight size={16}/></Link>
    </section>
    <div className="socialHomeGrid">
      <section className="socialFeedPanel">
        <div className="feedHeading"><div><span className="kicker">YOUR FEED</span><h2>Latest from your network</h2></div><Link href="/people"><Users size={15}/> Find people</Link></div>
        {posts.length === 0 ? <div className="socialEmpty"><Compass size={25}/><h3>Your network starts here.</h3><p>Follow people you trust and their posts will appear here.</p><Link className="secondary" href="/people">Discover people</Link></div> : posts.slice(0, 8).map(post => <article className="homePost" key={post.id}><div className="homePostAvatar">{initials(post.authorUsername)}</div><div className="homePostBody"><div><strong>@{post.authorUsername}</strong><span> · <Link href={postUrl(post.authorUsername, post.id)}>{formatPostDate(post.createdAt)}</Link></span></div>{post.text && <p>{post.text}</p>}{post.images.length > 0 && <div className="homePostImages">{post.images.slice(0, 4).map((src, i) => <img src={src} alt="Post media" key={i}/>)}</div>}<Link className="homePostLink" href={postUrl(post.authorUsername, post.id)}>Open post <ArrowRight size={13}/></Link></div></article>)}
      </section>
      <aside className="socialHomeAside">
        <section className="discoverPanel"><span className="kicker">NETWORK</span><h2>Most followed</h2><p className="panelSub">The members with the largest audiences.</p>{people.slice(0, 4).map((p, i) => <Link className="homePerson" href={profileUrl(p.username)} key={p.username}><span className="homeRank">{String(i + 1).padStart(2, "0")}</span><span className="personAvatar">{p.image ? <img src={p.image} alt=""/> : initials(p.name)}</span><span className="personMeta"><strong>{p.name} {p.verified && <span className="verifiedDot"><Check size={9}/></span>}</strong><span>@{p.username}</span></span><span className="followCount"><strong>{compactNumber(p.followers)}</strong> followers</span></Link>)}</section>
        <section className="discoverPanel"><span className="kicker">MARKETPLACE</span><h2>Verified assets</h2><p className="panelSub">Explore what is available now.</p>{assets.slice(0, 2).map(a => <Link className="homeAsset" href={`/assets/${a.id}`} key={a.id}><span>{a.type}</span><strong>{a.title}</strong><small>{a.price}</small></Link>)}</section>
      </aside>
    </div>
  </main>;
}

export default function Home() {
  const { status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  if (status === "authenticated") return <AuthenticatedHome/>;
  return <main><nav className="nav"><Link className="logo" href="/">Trust<span>.</span>Me</Link><div className={menuOpen ? "navLinks mobileOpen" : "navLinks"}><Link href="/assets" onClick={() => setMenuOpen(false)}>Explore Assets</Link><Link href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link><Link href="/sell" onClick={() => setMenuOpen(false)}>Sell an Asset</Link><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link></div><div className="navActions"><Link className="searchBtn" href="/assets" aria-label="Search"><Search size={18}/></Link><Link className="login" href="/login">Log in</Link><Link className="primary small" href="/signup">Get Started</Link><button className="menuBtn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X size={21}/> : <Menu size={21}/>}</button></div></nav><section className="hero" id="top"><div className="heroGlow"/><div className="heroCopy"><div className="eyebrow"><ShieldCheck size={15}/> Egypt&apos;s verified asset marketplace</div><h1>Own with <em>confidence.</em></h1><p>Discover valuable assets with verified ownership, documentation, and provenance — all in one trusted marketplace.</p><div className="heroCtas"><Link className="primary" href="/assets">Explore verified assets <ArrowRight size={17}/></Link><Link className="secondary" href="/sell">List your asset</Link></div><div className="trustLine"><CheckCircle2 size={16}/> Every listed asset goes through verification.</div></div><div className="heroVisual" aria-hidden="true"><div className="passportCard"><div className="passportTop"><span>TRUST.ME</span><span>ASSET PASSPORT</span></div><div className="passportSeal"><ShieldCheck size={38}/></div><div className="passportTitle">VERIFIED ASSET</div><div className="passportLine"/><div className="passportLine short"/><div className="passportBottom"><span>OWNERSHIP</span><strong>VERIFIED</strong></div></div></div></section><section className="stats"><div><strong>100%</strong><span>Verification-first</span></div><div><strong>EGP</strong><span>Built for Egypt</span></div><div><strong>24/7</strong><span>Access to opportunities</span></div><div><strong>1</strong><span>Trusted destination</span></div></section><section className="section" id="assets"><div className="sectionHead"><div><span className="kicker">CURATED MARKETPLACE</span><h2>Assets worth <em>trusting.</em></h2></div><Link className="textLink" href="/assets">View all assets <ArrowRight size={16}/></Link></div><div className="assetGrid">{assets.slice(0, 3).map(asset => <AssetCard key={asset.id} asset={asset}/>)}</div></section><section className="passportSection" id="how"><div className="passportText"><span className="kicker">THE TRUST.ME STANDARD</span><h2>Every asset has a <em>story.</em><br/>We verify it.</h2><p>Our Asset Passport brings ownership, documentation, verification status, and essential details together into a single, easy-to-understand record.</p><div className="checks"><span><CheckCircle2/> Ownership reviewed</span><span><CheckCircle2/> Documentation checked</span><span><CheckCircle2/> Details made transparent</span></div><Link className="secondary light" href="/how-it-works">Learn how verification works <ArrowRight size={17}/></Link></div><div className="miniPassport"><div className="miniHeader">TRUST.ME <span>01 / 04</span></div><div className="miniCircle"><ShieldCheck size={30}/></div><p>ASSET PASSPORT</p><h3>Verification<br/>Complete</h3><div className="miniStamp">✓ VERIFIED</div></div></section><section className="creatorTeaser"><div><span className="kicker">CREATOR NETWORK</span><h2>Discovery needs <em>context.</em></h2><p>Creators can discover, explain, and distribute verified opportunities to audiences that trust them.</p></div><Link className="secondary" href="/creators">Explore the creator network <ArrowRight size={17}/></Link></section><section className="cta" id="sell"><Sparkles size={18}/><h2>Have something valuable?</h2><p>Bring your asset to a marketplace built around trust, transparency, and serious buyers.</p><Link className="primary" href="/sell">List an asset <ArrowRight size={17}/></Link></section><footer id="about"><div><Link className="logo" href="/">Trust<span>.</span>Me</Link><p>Verified. Valuable. Yours.</p></div><div className="footerLinks"><Link href="/assets">Explore</Link><Link href="/how-it-works">Verification</Link><Link href="/creators">Creators</Link><Link href="/sell">Sell</Link><Link href="/about">About</Link></div><div className="copyright">© 2026 Trust.Me</div></footer></main>;
}
