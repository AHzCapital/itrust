import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { normalizeUsername } from "@/lib/social";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : user.name || "Member";
  const username = normalizeUsername(typeof body.username === "string" ? body.username : user.username);
  const bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 180) : user.bio;
  const location = typeof body.location === "string" ? body.location.trim().slice(0, 80) : user.location;
  const website = typeof body.website === "string" ? body.website.trim().slice(0, 300) : user.website;
  const image = typeof body.image === "string" && body.image.startsWith("http") ? body.image.slice(0, 1000) : user.image;

  if (username.length < 3) return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });

  const collision = await prisma.user.findFirst({ where: { usernameKey: username, NOT: { id: user.id } }, select: { id: true } });
  if (collision) return NextResponse.json({ error: "That username is already taken." }, { status: 409 });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, username, usernameKey: username, bio, location, website: website || null, image: image || null },
  });
  return NextResponse.json(updated);
}
