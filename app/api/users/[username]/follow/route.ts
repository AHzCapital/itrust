import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { decodeRouteSegment, normalizeUsername } from "@/lib/social";

export const runtime = "nodejs";

type Params = { params: Promise<{ username: string }> };

async function resolveTarget(username: string) {
  return prisma.user.findUnique({ where: { usernameKey: normalizeUsername(decodeRouteSegment(username)) }, select: { id: true } });
}

export async function POST(_request: Request, { params }: Params) {
  const current = await getCurrentUser();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { username } = await params;
  const target = await resolveTarget(username);
  if (!target) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  if (target.id === current.id) return NextResponse.json({ error: "You cannot follow yourself." }, { status: 400 });
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: current.id, followingId: target.id } },
    update: {},
    create: { followerId: current.id, followingId: target.id },
  });
  return NextResponse.json({ following: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const current = await getCurrentUser();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { username } = await params;
  const target = await resolveTarget(username);
  if (!target) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  await prisma.follow.deleteMany({ where: { followerId: current.id, followingId: target.id } });
  return NextResponse.json({ following: false });
}
