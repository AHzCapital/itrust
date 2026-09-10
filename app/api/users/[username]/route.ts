import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { decodeRouteSegment, normalizeUsername } from "@/lib/social";

export const runtime = "nodejs";

type Params = { params: Promise<{ username: string }> };

export async function GET(_request: Request, { params }: Params) {
  const current = await getCurrentUser();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { username } = await params;
  const key = normalizeUsername(decodeRouteSegment(username));
  const user = await prisma.user.findUnique({
    where: { usernameKey: key },
    include: {
      _count: { select: { followers: true, following: true, posts: true } },
      followers: { where: { followerId: current.id }, select: { followerId: true } },
      posts: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
  if (!user) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json({
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
    bio: user.bio,
    location: user.location,
    website: user.website,
    verified: user.verified,
    createdAt: user.createdAt,
    counts: { followers: user._count.followers, following: user._count.following, posts: user._count.posts },
    isOwner: current.id === user.id,
    isFollowing: user.followers.length > 0,
    posts: user.posts.map((post) => ({ id: post.id, text: post.text, images: Array.isArray(post.images) ? post.images : [], createdAt: post.createdAt })),
  });
}
