import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  if (!allowed.has(file.type)) return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image must be 8MB or smaller." }, { status: 413 });
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80) || "image";
  const blob = await put(`users/${user.id}/${crypto.randomUUID()}-${safeName}`, file, { access: "public", addRandomSuffix: false });
  return NextResponse.json({ url: blob.url });
}
