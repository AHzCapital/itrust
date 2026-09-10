import { readStorage, SocialProfile, SocialPost, PROFILE_KEY, POSTS_KEY, FOLLOWING_KEY } from "@/lib/social";

export type DiscoveryPerson = SocialProfile & { followers: number; verified?: boolean; postCount: number };

export const demoPeople: DiscoveryPerson[] = [
  { name: "Trust.Me", username: "trustme", bio: "Verified assets, trusted discovery.", location: "Egypt", image: "", followers: 12400, verified: true, postCount: 84, createdAt: "2026-01-10" },
  { name: "AHz Capital", username: "ahzcapital", bio: "Research, investing and transformative technology.", location: "Egypt", image: "", followers: 9800, verified: true, postCount: 61, createdAt: "2026-02-12" },
  { name: "Nile Estate", username: "nileestate", bio: "Curated property and real-estate opportunities.", location: "Cairo, Egypt", image: "", followers: 7300, verified: true, postCount: 47, createdAt: "2026-03-04" },
  { name: "Cairo Ventures", username: "cairoventures", bio: "Backing ambitious Egyptian founders.", location: "Cairo, Egypt", image: "", followers: 6100, verified: true, postCount: 39, createdAt: "2026-03-18" },
  { name: "Nile Advisory", username: "nileadvisory", bio: "Independent perspectives on Egyptian markets.", location: "Giza, Egypt", image: "", followers: 4800, verified: false, postCount: 31, createdAt: "2026-04-02" },
];

export function currentDiscoveryPeople(): DiscoveryPerson[] {
  if (typeof window === "undefined") return demoPeople;
  const profile = readStorage<SocialProfile | null>(PROFILE_KEY, null);
  if (!profile?.username) return demoPeople;
  const posts = readStorage<SocialPost[]>(POSTS_KEY, []);
  const following = readStorage<string[]>(FOLLOWING_KEY, []);
  const own: DiscoveryPerson = { ...profile, followers: readStorage<string[]>("trustme-followers", []).length, verified: true, postCount: posts.length };
  return [own, ...demoPeople.filter(p => p.username !== profile.username).map(p => ({ ...p, followers: p.followers + (following.includes(p.username) ? 0 : 0) }))];
}

export function compactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return String(value);
}
