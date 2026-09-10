import type { Metadata } from "next";
import PublicProfileClient from "@/components/public-profile-client";
import { decodeRouteSegment, normalizeUsername } from "@/lib/social";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const safeUsername = normalizeUsername(decodeRouteSegment(username)) || "profile";
  return {
    title: `${safeUsername} — Trust.Me`,
    description: `${safeUsername} on Trust.Me — Verified. Valuable. Yours.`,
    openGraph: { title: `${safeUsername} — Trust.Me`, description: `${safeUsername} on Trust.Me — Verified. Valuable. Yours.`, type: "profile" },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const safeUsername = normalizeUsername(decodeRouteSegment(username));
  return <PublicProfileClient username={safeUsername} />;
}
