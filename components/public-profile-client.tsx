"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, Check, Copy, ExternalLink, MoreHorizontal, Pencil, Share2, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { BOOKMARKS_KEY, FOLLOWING_KEY, LIKES_KEY, POSTS_KEY, PROFILE_KEY, SocialPost, SocialProfile, formatPostDate, initials, postUrl, profileUrl, readStorage, writeStorage } from "@/lib/social";

export default function PublicProfileClient({ username }: { username: string }) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = readStorage<SocialProfile | null>(PROFILE_KEY, null);
    const savedPosts = readStorage<SocialPost[]>(POSTS_KEY, []);
    if (saved && saved.username.toLowerCase() === username.toLowerCase()) setProfile(saved);
    else if (username.toLowerCase() === "trustme") setProfile({ name: "Trust.Me", username: "trustme", bio: "Verified assets. Trusted people. A better way to own with confidence.", location: "Egypt", image: "" });
    else setProfile(null);
    setPosts(savedPosts.filter((post) => post.authorUsername.toLowerCase() === username.toLowerCase()));
    setFollowing(readStorage<string[]>(FOLLOWING_KEY, []));
    setLikes(readStorage<string[]>(LIKES_KEY, []));
    setBookmarks(readStorage<string[]>(BOOKMARKS_KEY, []));
  }, [username]);

  const publicUrl = useMemo(() => typeof window === "undefined" ? profileUrl(username) : `${window.location.origin}${profileUrl(username)}`, [username]);
  const savedUsername = profile?.username?.toLowerCase();
  const isOwner = !!savedUsername && savedUsername === username.toLowerCase() && !!session?.user;

  async function share() {
    if (navigator.share) { await navigator.share({ title: `${profile?.name || username} on Trust.Me`, text: "Verified. Valuable. Yours.", url: publicUrl }).catch(() => undefined); return; }
    await navigator.clipboard.writeText(publicUrl); setCopied(true); setTimeout(() => setCopied(false), 1800);
  }

  async function copyPost(post: SocialPost) {
    await navigator.clipboard.writeText(`${window.location.origin}${postUrl(username, post.id)}`); setCopied(true); setTimeout(() => setCopied(false), 1800);
  }

  function toggleLike(id: string) { const next = likes.includes(id) ? likes.filter((x) => x !== id) : [...likes, id]; setLikes(next); writeStorage(LIKES_KEY, next); }
  function toggleBookmark(id: string) { const next = bookmarks.includes(id) ? bookmarks.filter((x) => x !== id) : [...bookmarks, id]; setBookmarks(next); writeStorage(BOOKMARKS_KEY, next); }

  if (!profile) return <main className="profilePage"><section className="profileGate"><span className="kicker">TRUST.ME</span><h1>This profile doesn't exist.</h1><p>The username may be unavailable or the profile may have moved.</p><Link className="primary" href="/">Return to Trust.Me</Link></section></main>;

  return <main className="profilePage publicProfile"><header className="profileNav"><Link className="logo" href="/">Trust<span>.</span>Me</Link><nav><Link href="/assets">Marketplace</Link><Link href="/creators">Creators</Link><Link href="/how-it-works">How it works</Link></nav>{isOwner ? <Link className="outlineButton" href="/profile"><Pencil size={14}/> Edit profile</Link> : <Link className="outlineButton" href="/login">Join Trust.Me</Link>}</header><div className="profileShell"><section className="profileHero"><div className="profileCover"/><div className="profileAvatarWrap">{profile.image ? <img src={profile.image} alt={`${profile.name} profile`} className="profileAvatar"/> : <div className="profileAvatar profileInitials">{initials(profile.name)}</div>}</div><div className="profileIdentity"><div className="profileTitle"><div><span className="verifiedMini"><Check size={11}/> Verified account</span><h1>{profile.name}</h1><p>@{profile.username}</p></div><div className="profileHeroActions"><button className="iconButton" onClick={share} aria-label="Share profile"><Share2 size={16}/></button>{isOwner ? <Link className="outlineButton" href="/profile"><Pencil size={15}/> Edit</Link> : <button className="outlineButton"><UserPlus size={15}/> Follow</button>}</div></div><p className="profileBio">{profile.bio || "A member of the Trust.Me community."}</p><p className="profileLocation">{profile.location || "Egypt"}{profile.website ? <> · <a href={profile.website} target="_blank" rel="noreferrer">{profile.website.replace(/^https?:\/\//, "")}</a></> : null}</p><div className="profileStats"><span><strong>0</strong> followers</span><span><strong>{following.length}</strong> following</span><span><strong>{posts.length}</strong> posts</span></div></div></section><div className="profileTabs"><Link className="active" href="#posts">Posts</Link><Link href="#media">Media</Link><Link href="#about">About</Link></div><div className="profileContent"><section className="profileFeed" id="posts"><div className="sectionHeading"><div><span className="kicker">PUBLIC PROFILE</span><h2>{posts.length ? "Latest posts." : "Nothing here yet."}</h2></div><button className="textAction" onClick={share}>{copied ? <><Check size={14}/> Link copied</> : <><Copy size={14}/> Copy profile link</>}</button></div><div className="postList">{posts.map((post) => <article className="postCard" key={post.id}><div className="postHead"><Link href={profileUrl(profile.username)}><div className="smallAvatar">{initials(profile.name)}</div></Link><div className="postAuthor"><strong>{profile.name} <span className="verifiedDot"><Check size={10}/></span></strong><span>@{profile.username} · <Link href={postUrl(profile.username, post.id)}>{formatPostDate(post.createdAt)}</Link></span></div><div className="postMenu"><details><summary><MoreHorizontal size={18}/></summary><div className="menuPanel"><button onClick={() => copyPost(post)}><Copy size={14}/> Copy link</button><Link href={postUrl(profile.username, post.id)} target="_blank"><ExternalLink size={14}/> Open in new tab</Link></div></details></div></div>{post.text && <p className="postText">{post.text}</p>}{post.images.length > 0 && <div className={`postImageGrid count-${Math.min(post.images.length, 4)}`} id="media">{post.images.slice(0, 4).map((src, i) => <img key={`${post.id}-${i}`} src={src} alt="Post media"/>)}</div>}<div className="postActions"><button className={likes.includes(post.id) ? "liked" : ""} onClick={() => toggleLike(post.id)}>♡ {likes.includes(post.id) ? "Liked" : "Like"}</button><button>↩ Reply</button><button className={bookmarks.includes(post.id) ? "saved" : ""} onClick={() => toggleBookmark(post.id)}><Bookmark size={14}/> {bookmarks.includes(post.id) ? "Saved" : "Save"}</button><button onClick={() => copyPost(post)}><Share2 size={14}/> Share</button></div></article>)}</div></section><aside className="profileSidebar"><div className="profileNote"><span>TRUST.ME IDENTITY</span><p>A public profile built around verified identity, trusted relationships and valuable ideas.</p></div></aside></div></div>{copied && <div className="toastNotice"><Check size={15}/> Link copied</div>}</main>;
}
