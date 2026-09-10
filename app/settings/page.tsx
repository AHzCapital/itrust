"use client";

import Link from "next/link";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";
import ThemeSwitcher from "@/components/theme-switcher";
import { normalizeUsername, profileUrl } from "@/lib/social";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const name = session?.user?.name || "Member";
  const username = normalizeUsername(name) || "member";
  return <main className="settingsPage"><Link className="backLink" href={profileUrl(username)}><ArrowLeft size={14}/> Back to profile</Link><span className="kicker">TRUST.ME</span><h1>Settings</h1><div className="settingsCard">
    <section className="settingsSection"><h2>Account</h2><p>Your Trust.Me identity.</p><div className="settingLine"><div><strong>{name}</strong><span>Display name</span></div><ShieldCheck size={18}/></div><div className="settingLine"><div><strong>@{username}</strong><span>Public profile</span></div><Link className="textLink" href={profileUrl(username)}>View</Link></div></section>
    <section className="settingsSection"><h2>Appearance</h2><p>Choose how Trust.Me looks across your devices.</p><ThemeSwitcher/><div className="darkModeNotice">Current preference: <strong>{theme}</strong>. System follows your operating-system appearance.</div></section>
    <section className="settingsSection"><h2>Privacy</h2><p>These controls are prepared for the full multi-user backend.</p><div className="settingLine"><div><strong>Public profile</strong><span>Your public profile can be discovered by other members.</span></div><span>On</span></div><div className="settingLine"><div><strong>Follower count</strong><span>Show your follower count on your profile.</span></div><span>On</span></div></section>
    <section className="settingsSection"><h2>Security</h2><p>Manage your current session.</p><button className="outlineButton" onClick={() => signOut({callbackUrl:"/"})}><LogOut size={15}/> Sign out</button></section>
  </div></main>;
}
