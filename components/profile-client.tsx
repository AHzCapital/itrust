"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Camera, Check, Copy, ExternalLink, ImagePlus, Link2, LogOut, MoreHorizontal, Pencil, Plus, Share2, UserPlus, Users, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { BOOKMARKS_KEY, FOLLOWERS_KEY, FOLLOWING_KEY, LIKES_KEY, POSTS_KEY, PROFILE_KEY, SocialPost, SocialProfile, formatPostDate, initials, normalizeUsername, postUrl, profileUrl, readStorage, writeStorage } from "@/lib/social";

const people = [
  { username: "trustme", name: "Trust.Me", image: "" },
  { username: "ahzcapital", name: "AHz Capital", image: "" },
  { username: "nileestate", name: "Nile Estate", image: "" },
];

function toast(message: string) {
  window.dispatchEvent(new CustomEvent("trustme-toast", { detail: message }));
}

export default function ProfileClient() {
  const { data: session, status } = useSession();
  const account = session?.user;
  const defaultProfile = useMemo<SocialProfile>(() => ({ name: account?.name || "", username: normalizeUsername(account?.name || "member") || "member", bio: "", location: "Egypt", image: account?.image || "", createdAt: new Date().toISOString() }), [account?.name, account?.image]);
  const [profile, setProfile] = useState<SocialProfile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [text, setText] = useState("");
  const [postImages, setPostImages] = useState<string[]>([]);
  const [peopleFollowing, setPeopleFollowing] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    if (!account) return;
    const saved = readStorage<SocialProfile | null>(PROFILE_KEY, null);
    setProfile(saved ? { ...defaultProfile, ...saved } : defaultProfile);
    setFollowers(readStorage<string[]>(FOLLOWERS_KEY, []));
    setFollowing(readStorage<string[]>(FOLLOWING_KEY, []));
    setPosts(readStorage<SocialPost[]>(POSTS_KEY, []));
    setPeopleFollowing(readStorage<string[]>("trustme-people-following", []));
    setLikes(readStorage<string[]>(LIKES_KEY, []));
    setBookmarks(readStorage<string[]>(BOOKMARKS_KEY, []));
  }, [account, defaultProfile]);

  if (status === "loading") return <main className="profilePage"><div className="profileLoading">Loading your profile…</div></main>;
  if (!account) return <main className="profilePage"><section className="profileGate"><span className="kicker">TRUST.ME</span><h1>Create your profile.</h1><p>Sign in first, then build your public identity and start publishing.</p><Link className="primary" href="/login">Sign in</Link></section></main>;

  function saveProfile(event: FormEvent) {
    event.preventDefault();
    const clean = { ...profile, username: normalizeUsername(profile.username) || "member" };
    writeStorage(PROFILE_KEY, clean);
    setProfile(clean);
    setEditing(false);
    toast("Profile saved");
  }

  function toggleFollow(username: string) {
    if (normalizeUsername(username) === normalizeUsername(profile.username)) return;
    const next = peopleFollowing.includes(username) ? peopleFollowing.filter((x) => x !== username) : [...peopleFollowing, username];
    setPeopleFollowing(next); writeStorage("trustme-people-following", next);
    setFollowing(next); writeStorage(FOLLOWING_KEY, next);
  }

  function addImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/")).slice(0, 10);
    Promise.all(files.map((file) => new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); }))).then((urls) => setPostImages((current) => [...current, ...urls].slice(0, 10)));
    event.target.value = "";
  }

  function publish(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() && !postImages.length) return;
    const next: SocialPost[] = [{ id: crypto.randomUUID(), authorUsername: profile.username, text: text.trim(), images: postImages, createdAt: new Date().toISOString(), likes: [], bookmarks: [], replyCount: 0 }, ...posts];
    setPosts(next); writeStorage(POSTS_KEY, next); setText(""); setPostImages([]); toast("Published");
  }

  async function shareProfile() {
    const url = `${window.location.origin}${profileUrl(profile.username)}`;
    if (navigator.share) { await navigator.share({ title: `${profile.name || profile.username} on Trust.Me`, text: "Verified. Valuable. Yours.", url }).catch(() => undefined); return; }
    await navigator.clipboard.writeText(url); toast("Profile link copied");
  }

  async function copyPost(post: SocialPost) {
    await navigator.clipboard.writeText(`${window.location.origin}${postUrl(profile.username, post.id)}`);
    toast("Post link copied");
  }

  function toggleLike(id: string) {
    const next = likes.includes(id) ? likes.filter((x) => x !== id) : [...likes, id];
    setLikes(next); writeStorage(LIKES_KEY, next);
  }

  function toggleBookmark(id: string) {
    const next = bookmarks.includes(id) ? bookmarks.filter((x) => x !== id) : [...bookmarks, id];
    setBookmarks(next); writeStorage(BOOKMARKS_KEY, next); toast(next.includes(id) ? "Saved to bookmarks" : "Removed from bookmarks");
  }

  function deletePost(id: string) {
    const next = posts.filter((post) => post.id !== id);
    setPosts(next); writeStorage(POSTS_KEY, next); toast("Post deleted");
  }

  return (
    <main className="profilePage">
      <header className="profileNav"><Link className="logo" href="/">Trust<span>.</span>Me</Link><nav><Link href="/assets">Marketplace</Link><Link href="/creators">Creators</Link><Link href="/how-it-works">How it works</Link></nav><div className="profileNavActions"><Link href={profileUrl(profile.username)} target="_blank" className="profilePublicLink"><ExternalLink size={14}/> Public profile</Link><button className="profileSignout" onClick={() => signOut({ callbackUrl: "/" })}><LogOut size={15}/> Sign out</button></div></header>
      <div className="profileShell">
        <section className="profileHero">
          <div className="profileCover" aria-hidden="true" />
          <div className="profileAvatarWrap">{profile.image ? <img src={profile.image} alt={`${profile.name || "User"} profile`} className="profileAvatar"/> : <div className="profileAvatar profileInitials">{initials(profile.name || account.name || "Trust.Me")}</div>}{editing && <label className="avatarEdit"><Camera size={15}/><input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setProfile((p) => ({ ...p, image: String(reader.result) })); reader.readAsDataURL(file); }}/></label>}</div>
          <div className="profileIdentity"><div className="profileTitle"><div><span className="verifiedMini"><Check size={11}/> Verified account</span><h1>{profile.name || "Your Name"}</h1><p>@{profile.username || "username"}</p></div><div className="profileHeroActions"><button className="iconButton" aria-label="Share profile" onClick={shareProfile}><Share2 size={16}/></button><button className="outlineButton" onClick={() => setEditing((x) => !x)}><Pencil size={15}/> {editing ? "Cancel" : "Edit profile"}</button></div></div><p className="profileBio">{profile.bio || "Tell people who you are and what you are interested in."}</p><p className="profileLocation">{profile.location || "Egypt"}{profile.website ? <> · <a href={profile.website} target="_blank" rel="noreferrer">{profile.website.replace(/^https?:\/\//, "")}</a></> : null}</p><div className="profileStats"><Link href={`${profileUrl(profile.username)}/followers`}><strong>{followers.length}</strong> followers</Link><Link href={`${profileUrl(profile.username)}/following`}><strong>{following.length}</strong> following</Link><span><strong>{posts.length}</strong> posts</span></div></div>
        </section>

        {editing && <form className="editProfileCard" onSubmit={saveProfile}><div className="editGrid"><label>Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" required/></label><label>Username<input value={profile.username} onChange={(e) => setProfile({ ...profile, username: normalizeUsername(e.target.value) })} placeholder="username" required/><small>3–20 letters, numbers or underscores.</small></label><label>Location<input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Egypt"/></label><label>Website<input value={profile.website || ""} onChange={(e) => setProfile({ ...profile, website: e.target.value })} placeholder="https://example.com"/></label><label className="wide">Bio<textarea maxLength={180} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="A short introduction…"/></label></div><div className="editActions"><button className="primary" type="submit"><Check size={16}/> Save profile</button><Link className="secondaryButton" href={profileUrl(profile.username)} target="_blank">Preview public profile</Link></div></form>}

        <div className="profileTabs"><Link className="active" href="#posts">Posts</Link><Link href="#media">Media</Link><Link href="#about">About</Link></div>

        <div className="profileContent" id="posts">
          <section className="profileFeed"><div className="sectionHeading"><div><span className="kicker">YOUR SPACE</span><h2>Publish something.</h2></div><button className="textAction" onClick={shareProfile}><Link2 size={14}/> Share profile</button></div><form className="composer" onSubmit={publish}><div className="composerTop"><div className="smallAvatar">{initials(profile.name || account.name || "T")}</div><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share an idea, an asset, an update…" maxLength={2000}/></div>{postImages.length > 0 && <div className={`postImageGrid draftGrid count-${Math.min(postImages.length, 4)}`}>{postImages.map((src, i) => <div className="draftImage" key={`${src.slice(0, 15)}-${i}`}><img src={src} alt="Upload preview"/><button type="button" aria-label="Remove image" onClick={() => setPostImages(postImages.filter((_, index) => index !== i))}><X size={14}/></button></div>)}</div>}<div className="composerBottom"><label className="mediaButton"><ImagePlus size={17}/> Add photos<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={addImages}/></label><span className="characterCount">{text.length}/2000</span><button className="publishButton" type="submit" disabled={!text.trim() && !postImages.length}>Publish <Plus size={16}/></button></div></form>
          <div className="postList">{posts.length === 0 ? <div className="emptyPosts"><ImagePlus size={24}/><h3>Your first post starts here.</h3><p>Write something or add as many photos as you like, then publish it for your audience.</p></div> : posts.map((post) => <article className="postCard" key={post.id}><div className="postHead"><Link href={profileUrl(profile.username)}><div className="smallAvatar">{initials(profile.name || account.name || "T")}</div></Link><div className="postAuthor"><strong>{profile.name || account.name} <span className="verifiedDot"><Check size={10}/></span></strong><span>@{profile.username} · <Link href={postUrl(profile.username, post.id)}>{formatPostDate(post.createdAt)}</Link></span></div><div className="postMenu"><details><summary aria-label="Post options"><MoreHorizontal size={18}/></summary><div className="menuPanel"><button onClick={() => copyPost(post)}><Copy size={14}/> Copy link</button><Link href={postUrl(profile.username, post.id)} target="_blank"><ExternalLink size={14}/> Open in new tab</Link><button onClick={() => toggleBookmark(post.id)}><Bookmark size={14}/> {bookmarks.includes(post.id) ? "Remove bookmark" : "Bookmark"}</button><button className="danger" onClick={() => deletePost(post.id)}>Delete post</button></div></details></div></div>{post.text && <p className="postText">{post.text}</p>}{post.images.length > 0 && <div className={`postImageGrid count-${Math.min(post.images.length, 4)}`} id="media">{post.images.slice(0, 4).map((src, i) => <img src={src} alt="Post media" key={`${post.id}-${i}`}/>)}</div>}
            <div className="postActions"><button onClick={() => toggleLike(post.id)} className={likes.includes(post.id) ? "liked" : ""}><span>♡</span> {likes.includes(post.id) ? "Liked" : "Like"}</button><button><span>↩</span> Reply</button><button className={bookmarks.includes(post.id) ? "saved" : ""} onClick={() => toggleBookmark(post.id)}><Bookmark size={14}/> {bookmarks.includes(post.id) ? "Saved" : "Save"}</button><button onClick={() => copyPost(post)}><Share2 size={14}/> Share</button></div></article>)}</div></section>
          <aside className="profileSidebar"><div className="peopleCard"><div className="sideTitle"><div><span className="kicker">DISCOVER</span><h3>People to follow</h3></div><Users size={18}/></div>{people.filter((person) => person.username !== profile.username).map((person) => <div className="personRow" key={person.username}><div className="smallAvatar">{initials(person.name)}</div><div className="personInfo"><Link href={profileUrl(person.username)}><strong>{person.name}</strong></Link><span>@{person.username}</span></div><button className={peopleFollowing.includes(person.username) ? "followingButton" : "followButton"} onClick={() => toggleFollow(person.username)}>{peopleFollowing.includes(person.username) ? <><Check size={13}/> Following</> : <><UserPlus size={13}/> Follow</>}</button></div>)}</div><div className="profileNote"><span>ASSET PASSPORT</span><p>Your profile is your public identity across the Trust.Me marketplace.</p></div></aside>
        </div>
      </div>
    </main>
  );
}
