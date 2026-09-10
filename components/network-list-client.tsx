"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, UserPlus } from "lucide-react";
import { FOLLOWING_KEY, profileUrl, readStorage } from "@/lib/social";

const suggestions = [
  { username: "trustme", name: "Trust.Me", bio: "Verified assets. Trusted people.", image: "" },
  { username: "ahzcapital", name: "AHz Capital", bio: "Research and investing.", image: "" },
  { username: "nileestate", name: "Nile Estate", bio: "Premium Egyptian property.", image: "" },
];

export default function NetworkListClient({ username, mode }: { username: string; mode: "followers" | "following" }) {
  const [following, setFollowing] = useState<string[]>([]);
  useEffect(() => setFollowing(readStorage<string[]>(FOLLOWING_KEY, [])), []);
  const people = mode === "following" ? suggestions.filter((p) => following.includes(p.username)) : [];
  return <main className="profilePage"><header className="profileNav"><Link className="logo" href="/">Trust<span>.</span>Me</Link><nav><Link href="/assets">Marketplace</Link><Link href="/creators">Creators</Link></nav><Link className="outlineButton" href={profileUrl(username)}>View profile</Link></header><div className="networkShell"><Link className="backLink" href={profileUrl(username)}><ArrowLeft size={15}/> Back to @{username}</Link><section className="networkCard"><span className="kicker">TRUST.ME NETWORK</span><h1>{mode === "followers" ? "Followers" : "Following"}</h1><p className="networkIntro">{mode === "followers" ? "People connected to this Trust.Me identity." : "People this profile chooses to follow."}</p>{people.length ? people.map((person) => <div className="networkRow" key={person.username}><div className="smallAvatar">{person.name.slice(0, 1)}</div><div><strong>{person.name} <span className="verifiedDot"><Check size={10}/></span></strong><span>@{person.username}</span><p>{person.bio}</p></div><button className="followButton"><UserPlus size={13}/> Following</button></div>) : <div className="networkEmpty"><h3>{mode === "followers" ? "No followers yet." : "No following yet."}</h3><p>Build your trusted network on Trust.Me.</p></div>}</section></div></main>;
}
