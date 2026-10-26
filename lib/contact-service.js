import { createHash } from "node:crypto";

export function validateContactPayload(body) {
  if (String(body?.website || "").trim()) return { ok: true, spam: true };

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();
  if (!name || !email || !message) return { ok: false, error: "Name, email and message are required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email" };
  if (name.length > 120 || email.length > 200 || message.length > 5000) return { ok: false, error: "Input too long" };
  return { ok: true, value: { name, email, message } };
}

export function hashContactIp(ip, secret) {
  return createHash("sha256").update(`${String(secret)}:${String(ip)}`).digest("hex");
}

export async function sendResendNotification({ apiKey, from, to, name, email, message, fetchImpl = fetch }) {
  if (!apiKey || !from || !to) return { sent: false, reason: "not_configured" };
  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
      cache: "no-store",
    });
    if (!response.ok) return { sent: false, reason: "provider_error" };
    return { sent: true };
  } catch {
    return { sent: false, reason: "provider_error" };
  }
}
