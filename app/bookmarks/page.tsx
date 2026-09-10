"use client";

import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SocialPost, readStorage, profileUrl, postUrl } from "@/lib/social";

export default function BookmarksPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  useEffect(() => {
    const saved = readStorage<string[]>("trustme-bookmarks", []);
    setPosts(readStorage<SocialPost[]>("trustme-posts", []).filter(p => saved.includes(p.id)));
  }, []);
  return <main className="explorePage"><header className="exploreHead"><div><span className="kicker">YOUR COLLECTION</span><h1>Bookmarks</h1><p>Keep the ideas, posts and opportunities you want to return to.</p></div></header>{posts.length === 0 ? <div className="emptyState"><Bookmark size={25}/><h2>Nothing saved yet.</h2><p>Save a post and it will appear here.</p><Link className="secondary" href="/explore">Explore Trust.Me <ArrowRight size={15}/></Link></div> : <section className="discoverPanel">{posts.map(post => <article className="rankRow" key={post.id}><Bookmark size={16}/><div className="personMeta"><strong>@{post.authorUsername}</strong><span>{post.text || "Shared media"}</span></div><Link href={postUrl(post.authorUsername,post.id)}><ArrowRight size={15}/></Link></article>)}</section>}</main>;
}
