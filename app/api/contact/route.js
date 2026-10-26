import { NextResponse } from "next/server";
import { getMessages, saveMessages } from "@/lib/data";
import { getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (name.length > 120 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  const messages = getMessages();
  messages.unshift({
    id: `m_${Date.now().toString(36)}`,
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
  });
  saveMessages(messages.slice(0, 500));

  // Also expose where messages land so the site owner can find them.
  const contactEmail = getSite()?.contact?.email || "";
  return NextResponse.json({ ok: true, deliveredTo: contactEmail });
}
