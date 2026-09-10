import type { Metadata } from "next";
import PublicPostClient from "@/components/public-post-client";
import { decodeRouteSegment, normalizeUsername } from "@/lib/social";

export async function generateMetadata({ params }: { params: Promise<{ username: string; postId: string }> }): Promise<Metadata> {
  const { username } = await params;
  const safeUsername = normalizeUsername(decodeRouteSegment(username)) || "profile";
  return {
    title: `${safeUsername}'s post — Trust.Me`,
    description: `A post by ${safeUsername} on Trust.Me — Verified. Valuable. Yours.`,
    openGraph: { title: `${safeUsername}'s post — Trust.Me`, description: `A post by ${safeUsername} on Trust.Me — Verified. Valuable. Yours.`, type: "article" },
  };
}

export default async function PublicPostPage({ params }: { params: Promise<{ username: string; postId: string }> }) {
  const { username, postId } = await params;
  return <PublicPostClient username={normalizeUsername(decodeRouteSegment(username))} postId={decodeRouteSegment(postId)} />;
}
