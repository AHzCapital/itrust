import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (post.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
