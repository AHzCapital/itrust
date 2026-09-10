import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

type Params = { params: Promise<{ conversationId: string }> };

async function getAuthorizedConversation(userId: string, conversationId: string) {
  return prisma.conversation.findFirst({ where: { id: conversationId, participants: { some: { userId } } }, include: { participants: { include: { user: { select: { id: true, username: true, name: true, image: true, verified: true } } } } } });
}

export async function GET(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { conversationId } = await params;
  const conversation = await getAuthorizedConversation(user.id, conversationId);
  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  const messages = await prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, username: true, name: true, image: true } } } });
  await prisma.message.updateMany({ where: { conversationId, senderId: { not: user.id }, readAt: null }, data: { readAt: new Date() } });
  const other = conversation.participants.map((p) => p.user).find((p) => p.id !== user.id) || null;
  return NextResponse.json({ id: conversation.id, currentUserId: user.id, other, messages });
}

export async function POST(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { conversationId } = await params;
  const conversation = await getAuthorizedConversation(user.id, conversationId);
  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 4000) : "";
  if (!message) return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  const created = await prisma.message.create({ data: { conversationId, senderId: user.id, body: message } });
  await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: created.createdAt } });
  return NextResponse.json({ message: created }, { status: 201 });
}
