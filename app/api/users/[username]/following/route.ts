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
  const owner = await prisma.user.findUnique({ where: { usernameKey: key }, select: { id: true } });
  if (!owner) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const rows = await prisma.follow.findMany({ where: { followerId: owner.id }, orderBy: { createdAt: "desc" }, include: { following: { select: { id: true, username: true, name: true, image: true, verified: true, bio: true } } } });
  return NextResponse.json(rows.map((row) => row.following));
}
