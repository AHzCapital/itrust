import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 2000) : "";
  const images = Array.isArray(body?.images) ? body.images.filter((x: unknown): x is string => typeof x === "string" && x.startsWith("http")).slice(0, 4) : [];
  if (!text && !images.length) return NextResponse.json({ error: "Write something or add an image." }, { status: 400 });
  const post = await prisma.post.create({ data: { authorId: user.id, text, images } });
  return NextResponse.json({ id: post.id, text: post.text, images, createdAt: post.createdAt }, { status: 201 });
}
