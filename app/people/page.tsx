"use client";

import Link from "next/link";
import { Search, Check, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { compactNumber, currentDiscoveryPeople, DiscoveryPerson } from "@/lib/discovery";
import { initials, profileUrl, readStorage, writeStorage, PROFILE_KEY, SocialProfile } from "@/lib/social";

export default function PeoplePage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Popular");
  const [peopleSource, setPeopleSource] = useState<DiscoveryPerson[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [profile, setProfile] = useState<SocialProfile | null>(null);

  useEffect(() => {
    setPeopleSource(currentDiscoveryPeople());
    setFollowing(readStorage<string[]>("trustme-people-following", []));
    setProfile(readStorage<SocialProfile | null>(PROFILE_KEY, null));
  }, []);

  const people = useMemo(() => {
    const list = peopleSource.filter(p => `${p.name} ${p.username}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === "New") return [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (sort === "Active") return [...list].sort((a, b) => b.postCount - a.postCount);
    if (sort === "Verified") return list.filter(p => p.verified);
    return [...list].sort((a, b) => b.followers - a.followers);
  }, [peopleSource, query, sort]);

  const me = profile?.username || session?.user?.name?.toLowerCase().replace(/[^a-z0-9_]/g, "") || "";
  const toggle = (username: string) => {
    const next = following.includes(username) ? following.filter(x => x !== username) : [...following, username];
    setFollowing(next);
    writeStorage("trustme-people-following", next);
  };

  return <main className="peoplePage">
    <header className="peopleHead"><div><span className="kicker">TRUST.ME NETWORK</span><h1>People</h1><p>The people shaping the Trust.Me network. Discover thoughtful members, verified voices and the profiles worth following.</p></div><div className="searchPeople"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people" aria-label="Search people"/></div></header>
    <div className="peopleToolbar"><div className="sortTabs">{["Popular", "Active", "Verified", "New"].map(x => <button key={x} className={sort === x ? "active" : ""} onClick={() => setSort(x)}>{x}</button>)}</div><span className="resultCount">{people.length} members</span></div>
    <section className="peopleRows">{people.length === 0 ? <div className="emptyState"><h2>No people found.</h2><p>Try another name or username.</p></div> : people.map((person, index) => { const isMe = person.username === me; return <div className="peopleRow" key={person.username}><span className="rankNo">{String(index + 1).padStart(2, "0")}</span><Link href={profileUrl(person.username)} className="personAvatar">{person.image ? <img src={person.image} alt=""/> : initials(person.name)}</Link><div className="personMeta"><Link href={profileUrl(person.username)}><strong>{person.name} {person.verified && <span className="verifiedDot"><Check size={9}/></span>}</strong></Link><span>@{person.username}</span><div className="peopleBio">{person.bio}</div></div><div className="followCount"><strong>{compactNumber(person.followers)}</strong> followers</div>{!isMe && <button className={following.includes(person.username) ? "followingButton" : "followButton"} onClick={() => toggle(person.username)}>{following.includes(person.username) ? <><Check size={12}/> Following</> : <><UserPlus size={12}/> Follow</>}</button>}</div>; })}</section>
  </main>;
}
