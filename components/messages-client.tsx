"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, MessageCircle, Send } from "lucide-react";
import styles from "@/app/messages/messages.module.css";

type Conversation = { id: string; updatedAt: string; other: { id: string; username: string; name: string | null; image: string | null; verified: boolean } | null; lastMessage: { body: string; createdAt: string; senderId: string } | null };
type Thread = { id: string; other: { id: string; username: string; name: string | null; image: string | null; verified: boolean } | null; messages: { id: string; body: string; createdAt: string; senderId: string }[] };

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "T"; }

export function ConversationList() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/messages", { cache: "no-store" }).then((r) => r.json()).then((data) => setItems(Array.isArray(data) ? data : [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
  return <main className={styles.page}><div className={styles.header}><div><span className={styles.kicker}>PRIVATE NETWORK</span><h1>Messages</h1><p>Private conversations between trusted Trust.Me members.</p></div></div><section className={styles.list}>{loading ? <div className={styles.empty}>Loading conversations…</div> : items.length === 0 ? <div className={styles.empty}><MessageCircle size={28}/><h2>No conversations yet.</h2><p>Open a member profile and start a private conversation.</p><Link href="/people" className={styles.primary}>Discover people</Link></div> : items.map((item) => item.other && <Link key={item.id} href={`/messages/${item.id}`} className={styles.row}><div className={styles.avatar}>{item.other.image ? <img src={item.other.image} alt=""/> : initials(item.other.name || item.other.username)}</div><div className={styles.rowBody}><div><strong>{item.other.name || item.other.username}</strong><span>@{item.other.username}</span></div><p>{item.lastMessage?.body || "Start the conversation"}</p></div><time>{item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" }) : "New"}</time></Link>)}</section></main>;
}

export function NewConversation({ username }: { username: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function send() {
    const body = message.trim(); if (!body || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, message: body }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Couldn't send your message.");
      window.location.href = `/messages/${data.conversationId}`;
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't send your message."); setBusy(false); }
  }
  return <main className={styles.threadPage}><header className={styles.threadHeader}><Link href={`/u/${encodeURIComponent(username)}`}><ArrowLeft size={18}/></Link><div><span>PRIVATE MESSAGE</span><strong>@{username}</strong></div></header><section className={styles.newMessage}><MessageCircle size={28}/><h1>Start a private conversation.</h1><p>Your message will be delivered directly to @{username}.</p><textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Write a message…" autoFocus/><div className={styles.composerFooter}><small>Enter to send · Shift + Enter for a new line</small><button className={styles.send} disabled={!message.trim() || busy} onClick={send}>{busy ? "Sending…" : "Send"} <Send size={15}/></button></div>{error && <p className={styles.error}>{error}</p>}</section></main>;
}

export function ConversationThread({ conversationId }: { conversationId: string }) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try { const response = await fetch(`/api/messages/${encodeURIComponent(conversationId)}`, { cache: "no-store" }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Conversation not found."); setThread(data); setError(""); } catch (err) { setError(err instanceof Error ? err.message : "Couldn't load the conversation."); }
  }
  useEffect(() => { load(); const timer = window.setInterval(load, 5000); return () => window.clearInterval(timer); }, [conversationId]);

  const currentId = useMemo(() => thread?.messages.length ? undefined : undefined, [thread]);
  async function send() {
    const body = message.trim(); if (!body || busy) return;
    setBusy(true); setError("");
    try { const response = await fetch(`/api/messages/${encodeURIComponent(conversationId)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: body }) }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Couldn't send your message."); setMessage(""); await load(); } catch (err) { setError(err instanceof Error ? err.message : "Couldn't send your message."); } finally { setBusy(false); }
  }

  if (!thread) return <main className={styles.threadPage}><div className={styles.empty}>{error || "Loading conversation…"}{error && <button className={styles.secondary} onClick={load}>Try again</button>}</div></main>;
  const other = thread.other;
  return <main className={styles.threadPage}><header className={styles.threadHeader}><Link href="/messages"><ArrowLeft size={18}/></Link><Link href={other ? `/u/${encodeURIComponent(other.username)}` : "#"} className={styles.threadPerson}><div className={styles.avatar}>{other?.image ? <img src={other.image} alt=""/> : initials(other?.name || other?.username || "T")}</div><div><strong>{other?.name || other?.username || "Member"}</strong><span>@{other?.username}</span></div></Link></header><section className={styles.messages}>{thread.messages.length === 0 ? <div className={styles.emptyInline}>Start the conversation.</div> : thread.messages.map((item) => <div key={item.id} className={`${styles.message} ${item.senderId === currentId ? styles.mine : ""}`}><div>{item.body}</div><time>{new Date(item.createdAt).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}{item.senderId === currentId && item.readAt ? <><Check size={11}/> Read</> : null}</time></div>)}</section><div className={styles.composer}><textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Write a message…" rows={1}/><button className={styles.send} disabled={!message.trim() || busy} onClick={send}>{busy ? "Sending…" : "Send"} <Send size={15}/></button></div>{error && <p className={styles.error}>{error}</p>}</main>;
}
