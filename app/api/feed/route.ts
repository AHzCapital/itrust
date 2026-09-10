import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const following = await prisma.follow.findMany({ where: { followerId: user.id }, select: { followingId: true } });
  const authorIds = [user.id, ...following.map((item) => item.followingId)];
  const posts = await prisma.post.findMany({ where: { authorId: { in: authorIds } }, orderBy: { createdAt: "desc" }, take: 50, include: { author: { select: { username: true, name: true, image: true, verified: true } } } });
  const people = await prisma.user.findMany({ where: { id: { not: user.id } }, orderBy: { followers: { _count: "desc" } }, take: 4, select: { username: true, name: true, image: true, verified: true, _count: { select: { followers: true } } } });
  return NextResponse.json({ posts: posts.map((post) => ({ id: post.id, authorUsername: post.author.username, authorName: post.author.name, authorImage: post.author.image, verified: post.author.verified, text: post.text, images: Array.isArray(post.images) ? post.images : [], createdAt: post.createdAt })), people: people.map((person) => ({ username: person.username, name: person.name, image: person.image, verified: person.verified, followers: person._count.followers })) });
}
