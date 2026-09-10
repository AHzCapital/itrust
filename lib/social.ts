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

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures in the prototype layer.
  }
}

export function normalizeUsername(value: string) {
  return value.trim().replace(/^@/, "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
}

export function profileUrl(username: string) {
  return `/u/${encodeURIComponent(normalizeUsername(username))}`;
}

export function postUrl(username: string, id: string) {
  return `${profileUrl(username)}/post/${encodeURIComponent(id)}`;
}

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "T";
}

export function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
