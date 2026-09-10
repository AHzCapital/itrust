"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { profileUrl } from "@/lib/social";

type Person = { id: string; username: string; name: string | null; image: string | null; verified: boolean; bio: string };
function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "T"; }

export default function NetworkListClient({ username, mode }: { username: string; mode: "followers" | "following" }) {
  const { status } = useSession(); const [people, setPeople] = useState<Person[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { if (status !== "authenticated") return; fetch(`/api/users/${encodeURIComponent(username)}/${mode}`, { cache: "no-store" }).then(async (response) => { const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Couldn't load network."); setPeople(Array.isArray(data) ? data : []); }).catch((err) => setError(err instanceof Error ? err.message : "Couldn't load network.")).finally(() => setLoading(false)); }, [status, username, mode]);
  return <main className="profilePage"><header className="profileNav"><Link className="logo" href="/">Trust<span>.</span>Me</Link><nav><Link href="/assets">Marketplace</Link><Link href="/creators">Creators</Link></nav><Link className="outlineButton" href={profileUrl(username)}>View profile</Link></header><div className="networkShell"><Link className="backLink" href={profileUrl(username)}><ArrowLeft size={15}/> Back to @{username}</Link><section className="networkCard"><span className="kicker">TRUST.ME NETWORK</span><h1>{mode === "followers" ? "Followers" : "Following"}</h1><p className="networkIntro">{mode === "followers" ? "People connected to this Trust.Me identity." : "People this profile chooses to follow."}</p>{loading ? <div className="networkEmpty"><p>Loading network…</p></div> : error ? <div className="networkEmpty"><h3>Couldn't load this network.</h3><p>{error}</p></div> : people.length ? people.map((person) => <Link href={profileUrl(person.username)} className="networkRow" key={person.id}><div className="smallAvatar">{person.image ? <img src={person.image} alt=""/> : initials(person.name || person.username)}</div><div><strong>{person.name || person.username} {person.verified && <span className="verifiedDot"><Check size={10}/></span>}</strong><span>@{person.username}</span><p>{person.bio}</p></div></Link>) : <div className="networkEmpty"><h3>{mode === "followers" ? "No followers yet." : "No following yet."}</h3><p>Build your trusted network on Trust.Me.</p></div>}</section></div></main>;
}
