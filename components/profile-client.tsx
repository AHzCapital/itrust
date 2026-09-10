"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Camera, Check, ImagePlus, LogOut, Pencil, Plus, UserPlus, Users, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

type Profile = { name: string; username: string; bio: string; location: string; image: string };
type Post = { id: string; text: string; images: string[]; createdAt: string };

const people = [
  { username: "trustme", name: "Trust.Me", image: "" },
  { username: "ahzcapital", name: "AHz Capital", image: "" },
  { username: "nileestate", name: "Nile Estate", image: "" },
];

function initials(name: string) { return name.trim().split(/\\s+/).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "T"; }
function read<T>(key: string, fallback: T): T { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
function write(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

export default function ProfileClient() {
  const { data: session, status } = useSession();
  const account = session?.user;
  const defaultProfile = useMemo<Profile>(() => ({ name: account?.name || "", username: account?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "member", bio: "", location: "Egypt", image: account?.image || "" }), [account?.name, account?.image]);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [postImages, setPostImages] = useState<string[]>([]);
  const [peopleFollowing, setPeopleFollowing] = useState<string[]>([]);

  useEffect(() => {
    if (!account) return;
    const saved = read<Profile | null>("trustme-profile", null);
    setProfile(saved ? { ...defaultProfile, ...saved } : defaultProfile);
    setFollowers(read<string[]>("trustme-followers", []));
    setFollowing(read<string[]>("trustme-following", []));
    setPosts(read<Post[]>("trustme-posts", []));
    setPeopleFollowing(read<string[]>("trustme-people-following", []));
  }, [account, defaultProfile]);

  if (status === "loading") return <main className="profilePage"><div className="profileLoading">Loading your profile…</div></main>;
  if (!account) return <main className="profilePage"><section className="profileGate"><span className="kicker">TRUST.ME</span><h1>Create your profile.</h1><p>Sign in first, then build your public identity and start publishing.</p><Link className="primary" href="/login">Sign in</Link></section></main>;

  function saveProfile(event: FormEvent) { event.preventDefault(); write("trustme-profile", profile); setEditing(false); }
  function toggleFollow(username: string) {
    const next = peopleFollowing.includes(username) ? peopleFollowing.filter((x) => x !== username) : [...peopleFollowing, username];
    setPeopleFollowing(next); write("trustme-people-following", next);
    setFollowing(next); write("trustme-following", next);
  }
  function addImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    Promise.all(files.map((file) => new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); }))).then((urls) => setPostImages((current) => [...current, ...urls]));
    event.target.value = "";
  }
  function publish(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() && !postImages.length) return;
    const next = [{ id: crypto.randomUUID(), text: text.trim(), images: postImages, createdAt: new Date().toISOString() }, ...posts];
    setPosts(next); write("trustme-posts", next); setText(""); setPostImages([]);
  }

  return (
    <main className="profilePage">
      <header className="profileNav"><Link className="logo" href="/">Trust<span>.</span>Me</Link><nav><Link href="/assets">Marketplace</Link><Link href="/creators">Creators</Link><Link href="/how-it-works">How it works</Link></nav><button className="profileSignout" onClick={() => signOut({ callbackUrl: "/" })}><LogOut size={15}/> Sign out</button></header>
      <div className="profileShell">
        <section className="profileHero">
          <div className="profileAvatarWrap">
            {profile.image ? <img src={profile.image} alt="Profile" className="profileAvatar"/> : <div className="profileAvatar profileInitials">{initials(profile.name || account.name || "Trust.Me")}</div>}
            {editing && <label className="avatarEdit"><Camera size={15}/><input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setProfile((p) => ({ ...p, image: String(reader.result) })); reader.readAsDataURL(file); }}/></label>}
          </div>
          <div className="profileIdentity"><div className="profileTitle"><div><span className="verifiedMini"><Check size={11}/> Verified account</span><h1>{profile.name || "Your Name"}</h1><p>@{profile.username || "username"}</p></div><button className="outlineButton" onClick={() => setEditing((x) => !x)}><Pencil size={15}/> {editing ? "Cancel" : "Edit profile"}</button></div><p className="profileBio">{profile.bio || "Tell people who you are and what you are interested in."}</p><p className="profileLocation">{profile.location || "Egypt"}</p><div className="profileStats"><span><strong>{followers.length}</strong> followers</span><span><strong>{following.length}</strong> following</span><span><strong>{posts.length}</strong> posts</span></div></div>
        </section>

        {editing && <form className="editProfileCard" onSubmit={saveProfile}><div className="editGrid"><label>Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name"/></label><label>Username<input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value.replace(/\\s/g, "").toLowerCase() })} placeholder="username"/></label><label>Location<input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Egypt"/></label><label className="wide">Bio<textarea maxLength={180} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="A short introduction…"/></label></div><button className="primary" type="submit"><Check size={16}/> Save profile</button></form>}

        <div className="profileContent">
          <section className="profileFeed"><div className="sectionHeading"><div><span className="kicker">YOUR FEED</span><h2>Publish something.</h2></div></div><form className="composer" onSubmit={publish}><div className="composerTop"><div className="smallAvatar">{initials(profile.name || account.name || "T")}</div><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share an idea, an asset, an update…" maxLength={2000}/></div>{postImages.length > 0 && <div className="postImageGrid draftGrid">{postImages.map((src, i) => <div className="draftImage" key={`${src.slice(0, 15)}-${i}`}><img src={src} alt="Upload preview"/><button type="button" onClick={() => setPostImages(postImages.filter((_, index) => index !== i))}><X size={14}/></button></div>)}</div>}<div className="composerBottom"><label className="mediaButton"><ImagePlus size={17}/> Add photos<input type="file" accept="image/*" multiple onChange={addImages}/></label><button className="publishButton" type="submit">Publish <Plus size={16}/></button></div></form>
          <div className="postList">{posts.length === 0 ? <div className="emptyPosts"><ImagePlus size={24}/><h3>Your first post starts here.</h3><p>Write something or add as many photos as you like, then publish it for your audience.</p></div> : posts.map((post) => <article className="postCard" key={post.id}><div className="postHead"><div className="smallAvatar">{initials(profile.name || account.name || "T")}</div><div><strong>{profile.name || account.name}</strong><span>@{profile.username} · {new Date(post.createdAt).toLocaleDateString()}</span></div></div>{post.text && <p className="postText">{post.text}</p>}{post.images.length > 0 && <div className="postImageGrid">{post.images.map((src, i) => <img src={src} alt="Post" key={`${post.id}-${i}`}/>)}</div>}</article>)}</div></section>
          <aside className="profileSidebar"><div className="peopleCard"><div className="sideTitle"><div><span className="kicker">DISCOVER</span><h3>People to follow</h3></div><Users size={18}/></div>{people.map((person) => <div className="personRow" key={person.username}><div className="smallAvatar">{initials(person.name)}</div><div className="personInfo"><strong>{person.name}</strong><span>@{person.username}</span></div><button className={peopleFollowing.includes(person.username) ? "followingButton" : "followButton"} onClick={() => toggleFollow(person.username)}>{peopleFollowing.includes(person.username) ? <><Check size={13}/> Following</> : <><UserPlus size={13}/> Follow</>}</button></div>)}</div><div className="profileNote"><span>ASSET PASSPORT</span><p>Your profile is your public identity across the Trust.Me marketplace.</p></div></aside>
        </div>
      </div>
    </main>
  );
}
