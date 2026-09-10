"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, Check, Copy, ExternalLink, MoreHorizontal, Pencil, Share2, UserPlus, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatPostDate, initials, postUrl, profileUrl } from "@/lib/social";

type PublicProfile = {
  id: string; username: string; name: string | null; image: string | null; bio: string; location: string; website: string | null; verified: boolean;
  counts: { followers: number; following: number; posts: number }; isOwner: boolean; isFollowing: boolean;
  posts: { id: string; text: string; images: string[]; createdAt: string }[];
};

export default function PublicProfileClient({ username }: { username: string }) {
  const { status } = useSession();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followBusy, setFollowBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(username)}`, { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Couldn't load this profile.");
      setProfile(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't load this profile."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (status === "authenticated") load(); else if (status === "unauthenticated") { setLoading(false); setError("Sign in to view Trust.Me member profiles."); } }, [status, username]);
  const publicUrl = useMemo(() => typeof window === "undefined" ? profileUrl(username) : `${window.location.origin}${profileUrl(username)}`, [username]);

  async function share() {
    if (navigator.share) { await navigator.share({ title: `${profile?.name || username} on Trust.Me`, text: "Verified. Valuable. Yours.", url: publicUrl }).catch(() => undefined); return; }
    await navigator.clipboard.writeText(publicUrl); setCopied(true); setTimeout(() => setCopied(false), 1800);
  }

  async function toggleFollow() {
    if (!profile || followBusy) return;
    const next = !profile.isFollowing;
    setFollowBusy(true); setProfile({ ...profile, isFollowing: next, counts: { ...profile.counts, followers: profile.counts.followers + (next ? 1 : -1) } });
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(profile.username)}/follow`, { method: next ? "POST" : "DELETE" });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Couldn't update follow state.");
    } catch (err) {
      setProfile((current) => current ? { ...current, isFollowing: !next, counts: { ...current.counts, followers: current.counts.followers + (next ? -1 : 1) } } : current);
      setError(err instanceof Error ? err.message : "Couldn't update follow state.");
    } finally { setFollowBusy(false); }
  }

  if (loading) return <main className="profilePage"><div className="profileLoading">Loading profile…</div></main>;
  if (error && !profile) return <main className="profilePage"><section className="profileGate"><span className="kicker">TRUST.ME NETWORK</span><h1>{error.includes("not found") ? "Profile not found" : "We couldn't load this profile."}</h1><p>{error}</p><div className="gateActions"><button className="primary" onClick={load}>Try again</button><Link className="secondaryButton" href="/people">Back to People</Link></div></section></main>;
  if (!profile) return null;

  return <main className="profilePage publicProfile"><header className="profileNav"><Link className="logo" href="/">Trust<span>.</span>Me</Link><nav><Link href="/assets">Marketplace</Link><Link href="/creators">Creators</Link><Link href="/how-it-works">How it works</Link></nav>{profile.isOwner ? <Link className="outlineButton" href="/profile"><Pencil size={14}/> Edit profile</Link> : <Link className="outlineButton" href="/people">Discover people</Link>}</header><div className="profileShell"><section className="profileHero"><div className="profileCover"/><div className="profileAvatarWrap">{profile.image ? <img src={profile.image} alt={`${profile.name || profile.username} profile`} className="profileAvatar"/> : <div className="profileAvatar profileInitials">{initials(profile.name || profile.username)}</div>}</div><div className="profileIdentity"><div className="profileTitle"><div><span className="verifiedMini"><Check size={11}/> {profile.verified ? "Verified account" : "Trust.Me member"}</span><h1>{profile.name || profile.username}</h1><p>@{profile.username}</p></div><div className="profileHeroActions"><button className="iconButton" onClick={share} aria-label="Share profile"><Share2 size={16}/></button>{profile.isOwner ? <Link className="outlineButton" href="/profile"><Pencil size={15}/> Edit</Link> : <><button className="outlineButton" onClick={toggleFollow} disabled={followBusy}>{profile.isFollowing ? <><Check size={15}/> Following</> : <><UserPlus size={15}/> Follow</>}</button><Link className="primary profileMessageButton" href={`/messages/new?to=${encodeURIComponent(profile.username)}`}><MessageCircle size={15}/> Message</Link></>}</div></div><p className="profileBio">{profile.bio || "A member of the Trust.Me community."}</p><p className="profileLocation">{profile.location || "Egypt"}{profile.website ? <> · <a href={profile.website} target="_blank" rel="noreferrer">{profile.website.replace(/^https?:\/\//, "")}</a></> : null}</p><div className="profileStats"><Link href={`${profileUrl(profile.username)}/followers`}><strong>{profile.counts.followers}</strong> followers</Link><Link href={`${profileUrl(profile.username)}/following`}><strong>{profile.counts.following}</strong> following</Link><span><strong>{profile.counts.posts}</strong> posts</span></div></div></section><div className="profileTabs"><Link className="active" href="#posts">Posts</Link><Link href="#media">Media</Link><Link href="#about">About</Link></div><div className="profileContent"><section className="profileFeed" id="posts"><div className="sectionHeading"><div><span className="kicker">PUBLIC PROFILE</span><h2>{profile.posts.length ? "Latest posts." : "Nothing here yet."}</h2></div><button className="textAction" onClick={share}>{copied ? <><Check size={14}/> Link copied</> : <><Copy size={14}/> Copy profile link</>}</button></div><div className="postList">{profile.posts.map((post) => <article className="postCard" key={post.id}><div className="postHead"><Link href={profileUrl(profile.username)}><div className="smallAvatar">{initials(profile.name || profile.username)}</div></Link><div className="postAuthor"><strong>{profile.name || profile.username} <span className="verifiedDot"><Check size={10}/></span></strong><span>@{profile.username} · <Link href={postUrl(profile.username, post.id)}>{formatPostDate(post.createdAt)}</Link></span></div><div className="postMenu"><details><summary><MoreHorizontal size={18}/></summary><div className="menuPanel"><button onClick={() => navigator.clipboard.writeText(`${window.location.origin}${postUrl(profile.username, post.id)}`)}><Copy size={14}/> Copy link</button><Link href={postUrl(profile.username, post.id)} target="_blank"><ExternalLink size={14}/> Open in new tab</Link></div></details></div></div>{post.text && <p className="postText">{post.text}</p>}{post.images.length > 0 && <div className={`postImageGrid count-${Math.min(post.images.length, 4)}`} id="media">{post.images.slice(0, 4).map((src, i) => <img key={`${post.id}-${i}`} src={src} alt="Post media"/>)}</div>}<div className="postActions"><button className={likes.includes(post.id) ? "liked" : ""} onClick={() => setLikes((current) => current.includes(post.id) ? current.filter((id) => id !== post.id) : [...current, post.id])}>♡ {likes.includes(post.id) ? "Liked" : "Like"}</button><button>↩ Reply</button><button className={bookmarks.includes(post.id) ? "saved" : ""} onClick={() => setBookmarks((current) => current.includes(post.id) ? current.filter((id) => id !== post.id) : [...current, post.id])}><Bookmark size={14}/> {bookmarks.includes(post.id) ? "Saved" : "Save"}</button><button onClick={share}><Share2 size={14}/> Share</button></div></article>)}</div></section><aside className="profileSidebar"><div className="profileNote"><span>TRUST.ME IDENTITY</span><p>A public profile built around verified identity, trusted relationships and valuable ideas.</p></div></aside></div></div>{copied && <div className="toastNotice"><Check size={15}/> Link copied</div>}</main>;
}
