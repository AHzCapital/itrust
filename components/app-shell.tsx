"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, Home, LogOut, Menu, Settings, Store, Users, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { normalizeUsername, profileUrl, PROFILE_KEY, readStorage, SocialProfile, writeStorage } from "@/lib/social";
import ThemeSwitcher from "@/components/theme-switcher";

const items = [["Home", "/", Home], ["Explore", "/explore", Compass], ["People", "/people", Users], ["Assets", "/assets", Store], ["Bookmarks", "/bookmarks", Bookmark]] as const;

function buildDefaultProfile(name: string, image: string): SocialProfile {
  return { name, username: normalizeUsername(name) || "member", bio: "", location: "Egypt", image, createdAt: new Date().toISOString() };
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false); };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setUserMenuOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", key); };
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const sync = () => {
      const name = session.user?.name || "Member";
      const image = session.user?.image || "";
      const saved = readStorage<SocialProfile | null>(PROFILE_KEY, null);
      const next = saved?.username ? { ...buildDefaultProfile(name, image), ...saved } : buildDefaultProfile(name, image);
      if (!saved) writeStorage(PROFILE_KEY, next);
      setProfile(next);
    };
    sync();
    window.addEventListener("trustme-profile-updated", sync);
    return () => window.removeEventListener("trustme-profile-updated", sync);
  }, [session?.user, status]);

  if (status !== "authenticated") return <>{children}</>;

  const name = profile?.name || session.user?.name || "Member";
  const username = profile?.username || normalizeUsername(name) || "member";
  const image = profile?.image || session.user?.image || "";
  const initials = name.split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase() || "T";
  const close = () => { setMobileOpen(false); setUserMenuOpen(false); };
  const profileHref = profileUrl(username);

  return <div className="appFrame">
    <aside className={mobileOpen ? "appSidebar open" : "appSidebar"}>
      <div className="appBrand"><Link className="logo" href="/" onClick={close}>Trust<span>.</span>Me</Link><button className="sidebarClose" onClick={close} aria-label="Close menu"><X size={18}/></button></div>
      <div className="appNavLabel">Workspace</div>
      <nav className="appNav">
        {items.map(([label, href, Icon]) => <Link key={href} href={href} onClick={close} className={pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}><Icon size={18}/><span>{label}</span></Link>)}
        <Link href={profileHref} onClick={close} className={pathname.startsWith("/u/") || pathname === "/profile" ? "active" : ""}><div className="navAvatar">{image ? <img src={image} alt=""/> : initials}</div><span>Profile</span></Link>
        <Link href="/settings" onClick={close} className={pathname.startsWith("/settings") ? "active" : ""}><Settings size={18}/><span>Settings</span></Link>
      </nav>
      <div className="appSidebarBottom" ref={menuRef}>
        <button className="appUser" onClick={() => setUserMenuOpen(x => !x)} aria-expanded={userMenuOpen}><div className="navAvatar">{image ? <img src={image} alt=""/> : initials}</div><div><strong>{name}</strong><span>@{username}</span></div><span className="userChevron">•••</span></button>
        {userMenuOpen && <div className="userMenu"><Link href={profileHref} onClick={close}>View profile</Link><Link href="/settings" onClick={close}>Settings</Link><div className="userMenuTheme"><span>Appearance</span><ThemeSwitcher/></div><button onClick={() => signOut({ callbackUrl: "/" })}><LogOut size={14}/> Sign out</button></div>}
      </div>
    </aside>
    {mobileOpen && <button className="appOverlay" aria-label="Close menu" onClick={close}/>} 
    <div className="appMain"><header className="mobileAppHeader"><button onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20}/></button><Link className="logo" href="/">Trust<span>.</span>Me</Link><Link href={profileHref} aria-label="My profile"><div className="navAvatar">{image ? <img src={image} alt=""/> : initials}</div></Link></header>{children}</div>
    <nav className="mobileBottomNav"><Link className={pathname === "/" ? "active" : ""} href="/"><Home size={19}/><span>Home</span></Link><Link className={pathname === "/explore" ? "active" : ""} href="/explore"><Compass size={19}/><span>Explore</span></Link><Link className="mobileCreate" href={profileHref}><span>+</span></Link><Link className={pathname === "/people" ? "active" : ""} href="/people"><Users size={19}/><span>People</span></Link><Link className={pathname.startsWith("/u/") ? "active" : ""} href={profileHref}><div className="navAvatar">{image ? <img src={image} alt=""/> : initials}</div><span>Profile</span></Link></nav>
  </div>;
}
