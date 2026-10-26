import { NextResponse } from "next/server";
import { getMessages, saveMessages } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json().catch(() => ({}));
  const messages = getMessages();
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  saveMessages(next);
  return NextResponse.json({ ok: true });
}
