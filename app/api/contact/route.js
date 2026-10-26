import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { addMessage, consumeContactLimit, getSite } from "@/lib/data";
import { hashContactIp, sendResendNotification, validateContactPayload } from "@/lib/contact-service";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const validation = validateContactPayload(body);
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });
  if (validation.spam) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateSecret = process.env.CONTACT_RATE_LIMIT_SECRET || process.env.AUTH_SECRET || "local-contact-rate-limit";
  let allowed;
  try {
    allowed = await consumeContactLimit(hashContactIp(ip, rateSecret));
  } catch {
    return NextResponse.json({ error: "Contact service is temporarily unavailable" }, { status: 503 });
  }
  if (!allowed) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });

  const message = { id: `m_${randomUUID()}`, ...validation.value, receivedAt: new Date().toISOString() };
  try {
    await addMessage(message);
  } catch {
    return NextResponse.json({ error: "Contact service is temporarily unavailable" }, { status: 503 });
  }

  const site = await getSite().catch(() => null);
  const notification = await sendResendNotification({
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL || site?.contact?.email,
    ...validation.value,
  });
  if (!notification.sent) console.warn(`Contact saved; email notification ${notification.reason}.`);

  return NextResponse.json({ ok: true });
}
