"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { BOOKMARKS_KEY, LIKES_KEY, POSTS_KEY, PROFILE_KEY, SocialPost, SocialProfile, formatPostDate, initials, profileUrl, readStorage, writeStorage } from "@/lib/social";

export default function PublicPostClient({ username, postId }: { username: string; postId: string }) {
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [post, setPost] = useState<SocialPost | null>(null);
  const [likes, setLikes] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = readStorage<SocialProfile | null>(PROFILE_KEY, null);
    const found = readStorage<SocialPost[]>(POSTS_KEY, []).find((item) => item.id === postId && item.authorUsername.toLowerCase() === username.toLowerCase());
    setProfile(saved && saved.username.toLowerCase() === username.toLowerCase() ? saved : username === "trustme" ? { name: "Trust.Me", username: "trustme", bio: "Verified assets. Trusted people.", location: "Egypt", image: "" } : null);
    setPost(found || null);
    setLikes(readStorage<string[]>(LIKES_KEY, []));
    setBookmarks(readStorage<string[]>(BOOKMARKS_KEY, []));
  }, [username, postId]);

  async function copyLink() { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); }
  async function share() { if (navigator.share) { await navigator.share({ title: `${profile?.name || username} on Trust.Me`, url: window.location.href }).catch(() => undefined); return; } copyLink(); }
  function toggleLike() { const next = likes.includes(postId) ? likes.filter((x) => x !== postId) : [...likes, postId]; setLikes(next); writeStorage(LIKES_KEY, next); }
  function toggleBookmark() { const next = bookmarks.includes(postId) ? bookmarks.filter((x) => x !== postId) : [...bookmarks, postId]; setBookmarks(next); writeStorage(BOOKMARKS_KEY, next); }

  if (!profile || !post) return <main className="profilePage"><section className="profileGate"><span className="kicker">TRUST.ME</span><h1>This post is unavailable.</h1><p>The post may have been deleted or the link may be incorrect.</p><Link className="primary" href={profileUrl(username)}>View profile</Link></section></main>;

  return <main className="profilePage publicPostPage"><header className="profileNav"><Link className="logo" href="/">Trust<span>.</span>Me</Link><nav><Link href="/assets">Marketplace</Link><Link href="/creators">Creators</Link><Link href="/how-it-works">How it works</Link></nav><Link className="outlineButton" href={profileUrl(profile.username)}>View profile</Link></header><div className="postDetailShell"><Link className="backLink" href={profileUrl(profile.username)}><ArrowLeft size={15}/> Back to @{profile.username}</Link><article className="postDetailCard"><div className="postHead"><Link href={profileUrl(profile.username)}><div className="smallAvatar">{initials(profile.name)}</div></Link><div className="postAuthor"><strong>{profile.name} <span className="verifiedDot"><Check size={10}/></span></strong><span>@{profile.username} · {formatPostDate(post.createdAt)}</span></div></div>{post.text && <p className="postDetailText">{post.text}</p>}{post.images.length > 0 && <div className={`postImageGrid count-${Math.min(post.images.length, 4)}`}>{post.images.map((src, i) => <img key={`${post.id}-${i}`} src={src} alt="Post media"/>)}</div>}<div className="postDetailMeta">{formatPostDate(post.createdAt)} · Trust.Me</div><div className="postActions"><button className={likes.includes(post.id) ? "liked" : ""} onClick={toggleLike}>♡ {likes.includes(post.id) ? "Liked" : "Like"}</button><button>↩ Reply</button><button className={bookmarks.includes(post.id) ? "saved" : ""} onClick={toggleBookmark}><Bookmark size={14}/> {bookmarks.includes(post.id) ? "Saved" : "Save"}</button><button onClick={share}><Share2 size={14}/> Share</button><button onClick={copyLink}><Copy size={14}/> {copied ? "Copied" : "Copy link"}</button></div></article><div className="permalinkCard"><Link2Icon/><div><strong>Permanent post link</strong><span>Anyone with this URL can return to this exact post.</span></div><button onClick={copyLink}>{copied ? <Check size={15}/> : <ExternalLink size={15}/>}</button></div></div>{copied && <div className="toastNotice"><Check size={15}/> Link copied</div>}</main>;
}

function Link2Icon() { return <span className="permalinkIcon"><ExternalLink size={16}/></span>; }
