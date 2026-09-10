import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const current = await getCurrentUser();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";
  const users = await prisma.user.findMany({
    where: query ? { OR: [{ username: { contains: query, mode: "insensitive" } }, { name: { contains: query, mode: "insensitive" } }] } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true, username: true, name: true, image: true, bio: true, location: true, verified: true, createdAt: true,
      _count: { select: { followers: true, following: true, posts: true } },
    },
  });
  const following = await prisma.follow.findMany({ where: { followerId: current.id }, select: { followingId: true } });
  const followingSet = new Set(following.map((item) => item.followingId));
  return NextResponse.json(users.filter((user) => user.id !== current.id).map((user) => ({
    ...user,
    followers: user._count.followers,
    following: user._count.following,
    postCount: user._count.posts,
    isFollowing: followingSet.has(user.id),
  })));
}
