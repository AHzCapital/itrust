export type SocialProfile = {
  name: string;
  username: string;
  bio: string;
  location: string;
  image: string;
  website?: string;
  coverImage?: string;
  createdAt?: string;
};

export type SocialPost = {
  id: string;
  authorUsername: string;
  text: string;
  images: string[];
  createdAt: string;
  likes?: string[];
  bookmarks?: string[];
  replyCount?: number;
};

export const PROFILE_KEY = "trustme-profile";
export const POSTS_KEY = "trustme-posts";
export const FOLLOWERS_KEY = "trustme-followers";
export const FOLLOWING_KEY = "trustme-following";
export const LIKES_KEY = "trustme-likes";
export const BOOKMARKS_KEY = "trustme-bookmarks";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeProfile(value: unknown): SocialProfile | null {
  if (!isRecord(value) || typeof value.username !== "string") return null;
  return {
    name: typeof value.name === "string" ? value.name : "Member",
    username: normalizeUsername(value.username) || "member",
    bio: typeof value.bio === "string" ? value.bio : "",
    location: typeof value.location === "string" ? value.location : "Egypt",
    image: typeof value.image === "string" ? value.image : "",
    website: typeof value.website === "string" ? value.website : undefined,
    coverImage: typeof value.coverImage === "string" ? value.coverImage : undefined,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : undefined,
  };
}

function sanitizePost(value: unknown): SocialPost | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.authorUsername !== "string") return null;
  return {
    id: value.id,
    authorUsername: normalizeUsername(value.authorUsername),
    text: typeof value.text === "string" ? value.text : "",
    images: Array.isArray(value.images) ? value.images.filter((item): item is string => typeof item === "string") : [],
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date(0).toISOString(),
    likes: Array.isArray(value.likes) ? value.likes.filter((item): item is string => typeof item === "string") : [],
    bookmarks: Array.isArray(value.bookmarks) ? value.bookmarks.filter((item): item is string => typeof item === "string") : [],
    replyCount: typeof value.replyCount === "number" ? value.replyCount : 0,
  };
}

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    if (key === PROFILE_KEY) return (sanitizeProfile(value) as T | null) ?? fallback;
    if (key === POSTS_KEY) return (Array.isArray(value) ? value.map(sanitizePost).filter((item): item is SocialPost => item !== null) : fallback) as T;
    if ([FOLLOWERS_KEY, FOLLOWING_KEY, LIKES_KEY, BOOKMARKS_KEY, "trustme-people-following"].includes(key)) {
      return (Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback) as T;
    }
    return value as T;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }
}

export function normalizeUsername(value: string) {
  return value.trim().replace(/^@/, "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
}

export function decodeRouteSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function profileUrl(username: string) {
  const safeUsername = normalizeUsername(username) || "member";
  return `/u/${encodeURIComponent(safeUsername)}`;
}

export function postUrl(username: string, id: string) {
  return `${profileUrl(username)}/post/${encodeURIComponent(id)}`;
}

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "T";
}

export function formatPostDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
