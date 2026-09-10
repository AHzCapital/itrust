import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { normalizeUsername } from "@/lib/social";

export const runtime = "nodejs";

function directKey(a: string, b: string) { return [a, b].sort().join(":"); }

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId: user.id } } },
    orderBy: { updatedAt: "desc" },
    include: {
      participants: { include: { user: { select: { id: true, username: true, name: true, image: true, verified: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: { select: { id: true, username: true, name: true } } } },
    },
  });
  return NextResponse.json(conversations.map((conversation) => {
    const other = conversation.participants.map((p) => p.user).find((p) => p.id !== user.id);
    const last = conversation.messages[0] || null;
    return { id: conversation.id, updatedAt: conversation.updatedAt, other, lastMessage: last ? { id: last.id, body: last.body, createdAt: last.createdAt, senderId: last.senderId } : null };
  }));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const username = normalizeUsername(typeof body?.username === "string" ? body.username : "");
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 4000) : "";
  if (!username) return NextResponse.json({ error: "Recipient is required." }, { status: 400 });
  if (!message) return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  const recipient = await prisma.user.findUnique({ where: { usernameKey: username }, select: { id: true } });
  if (!recipient) return NextResponse.json({ error: "Recipient not found." }, { status: 404 });
  if (recipient.id === user.id) return NextResponse.json({ error: "You cannot message yourself." }, { status: 400 });
  const key = directKey(user.id, recipient.id);
  const conversation = await prisma.conversation.upsert({
    where: { directKey: key },
    update: { updatedAt: new Date() },
    create: { directKey: key, participants: { create: [{ userId: user.id }, { userId: recipient.id }] } },
  });
  const created = await prisma.message.create({ data: { conversationId: conversation.id, senderId: user.id, body: message } });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: created.createdAt } });
  return NextResponse.json({ conversationId: conversation.id, message: created }, { status: 201 });
}
