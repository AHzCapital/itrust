"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, Home, LogOut, Menu, Moon, Search, Settings, ShieldCheck, Store, Users, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { normalizeUsername, profileUrl } from "@/lib/social";
import ThemeSwitcher from "@/components/theme-switcher";

const items = [
  ["Home", "/", Home], ["Explore", "/explore", Compass], ["People", "/people", Users], ["Assets", "/assets", Store], ["Bookmarks", "/bookmarks", Bookmark],
] as const;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (status !== "authenticated" || pathname === "/") return <>{children}</>;
  const name = session.user?.name || "Member";
  const username = normalizeUsername(name) || "member";
  const image = session.user?.image || "";
  const initials = name.split(/\s+/).slice(0,2).map(x => x[0]).join("").toUpperCase() || "T";
  const close = () => setMobileOpen(false);
  return <div className="appFrame">
    <aside className={mobileOpen ? "appSidebar open" : "appSidebar"}>
      <div className="appBrand"><Link className="logo" href="/" onClick={close}>Trust<span>.</span>Me</Link><button className="sidebarClose" onClick={close} aria-label="Close menu"><X size={18}/></button></div>
      <div className="appNavLabel">Workspace</div>
      <nav className="appNav">{items.map(([label, href, Icon]) => <Link key={href} href={href} onClick={close} className={pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}><Icon size={18}/><span>{label}</span></Link>)}
        <Link href={profileUrl(username)} onClick={close} className={pathname.startsWith("/u/") || pathname === "/profile" ? "active" : ""}><div className="navAvatar">{image ? <img src={image} alt=""/> : initials}</div><span>Profile</span></Link>
        <Link href="/settings" onClick={close} className={pathname.startsWith("/settings") ? "active" : ""}><Settings size={18}/><span>Settings</span></Link>
      </nav>
      <div className="appSidebarBottom"><div className="appUser"><div className="navAvatar">{image ? <img src={image} alt=""/> : initials}</div><div><strong>{name}</strong><span>@{username}</span></div></div><button className="signOutIcon" onClick={() => signOut({ callbackUrl: "/" })} aria-label="Sign out"><LogOut size={17}/></button></div>
    </aside>
    {mobileOpen && <button className="appOverlay" aria-label="Close menu" onClick={close}/>} 
    <div className="appMain"><header className="mobileAppHeader"><button onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20}/></button><Link className="logo" href="/">Trust<span>.</span>Me</Link><Link href={profileUrl(username)} aria-label="My profile"><div className="navAvatar">{image ? <img src={image} alt=""/> : initials}</div></Link></header>{children}</div>
    <nav className="mobileBottomNav"><Link className={pathname === "/" ? "active" : ""} href="/"><Home size={19}/><span>Home</span></Link><Link className={pathname === "/explore" ? "active" : ""} href="/explore"><Compass size={19}/><span>Explore</span></Link><Link className="mobileCreate" href="/profile"><span>+</span></Link><Link className={pathname === "/people" ? "active" : ""} href="/people"><Users size={19}/><span>People</span></Link><Link className={pathname.startsWith("/u/") ? "active" : ""} href={profileUrl(username)}><div className="navAvatar">{image ? <img src={image} alt=""/> : initials}</div><span>Profile</span></Link></nav>
  </div>;
}
