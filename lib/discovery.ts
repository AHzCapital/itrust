import { FOLLOWERS_KEY, FOLLOWING_KEY, POSTS_KEY, PROFILE_KEY, SocialPost, SocialProfile, readStorage } from "@/lib/social";

export type DiscoveryPerson = SocialProfile & { followers: number; verified?: boolean; postCount: number };

export function currentDiscoveryPeople(): DiscoveryPerson[] {
  if (typeof window === "undefined") return [];
  const profile = readStorage<SocialProfile | null>(PROFILE_KEY, null);
  if (!profile?.username) return [];
  const posts = readStorage<SocialPost[]>(POSTS_KEY, []);
  const followers = readStorage<string[]>(FOLLOWERS_KEY, []);
  const following = readStorage<string[]>(FOLLOWING_KEY, []);
  const own: DiscoveryPerson = {
    ...profile,
    followers: followers.length,
    verified: true,
    postCount: posts.length,
  };
  return [own, ...following
    .filter((username) => username && username !== profile.username)
    .map((username) => ({
      name: username,
      username,
      bio: "Trust.Me member",
      location: "Egypt",
      image: "",
      followers: 0,
      verified: false,
      postCount: 0,
    }))];
}

export function compactNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (value >= 1000000) return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return String(Math.max(0, Math.round(value)));
}
