import NetworkListClient from "@/components/network-list-client";
import { decodeRouteSegment, normalizeUsername } from "@/lib/social";

export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <NetworkListClient username={normalizeUsername(decodeRouteSegment(username))} mode="following" />;
}
