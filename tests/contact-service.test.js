import test from "node:test";
import assert from "node:assert/strict";
import { hashContactIp, sendResendNotification, validateContactPayload } from "../lib/contact-service.js";

test("contact validation trims input and enforces field limits and email format", () => {
  assert.deepEqual(validateContactPayload({ name: "  Alex  ", email: " alex@example.com ", message: "  Hello  " }), {
    ok: true,
    value: { name: "Alex", email: "alex@example.com", message: "Hello" },
  });
  assert.deepEqual(validateContactPayload({ name: "A", email: "bad", message: "Hello" }), { ok: false, error: "Please enter a valid email" });
  assert.deepEqual(validateContactPayload({ name: "A", email: "a@example.com", message: "" }), { ok: false, error: "Name, email and message are required" });
  assert.deepEqual(validateContactPayload({ name: "A".repeat(121), email: "a@example.com", message: "Hello" }), { ok: false, error: "Input too long" });
});

test("honeypot submissions are identified without treating them as valid messages", () => {
  assert.deepEqual(validateContactPayload({ website: "https://bot.example", name: "Bot" }), { ok: true, spam: true });
});

test("rate-limit identifiers are deterministic hashes and never contain the raw address", () => {
  const hash = hashContactIp("203.0.113.7", "a-long-private-secret");
  assert.equal(hash, hashContactIp("203.0.113.7", "a-long-private-secret"));
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(hash.includes("203.0.113.7"), false);
});

test("Resend receives plain-text visitor data and does not leak provider errors", async () => {
  let request;
  const result = await sendResendNotification({
    apiKey: "resend-secret",
    from: "Portfolio <hello@example.com>",
    to: "owner@example.com",
    name: "Alex",
    email: "alex@example.com",
    message: "Please build a site",
    fetchImpl: async (url, options) => {
      request = { url, options };
      return new Response(JSON.stringify({ id: "email-1" }), { status: 200 });
    },
  });

  assert.deepEqual(result, { sent: true });
  assert.equal(request.url, "https://api.resend.com/emails");
  assert.equal(request.options.headers.Authorization, "Bearer resend-secret");
  const body = JSON.parse(request.options.body);
  assert.deepEqual(body.to, ["owner@example.com"]);
  assert.equal(body.reply_to, "alex@example.com");
  assert.match(body.text, /Please build a site/);
  assert.equal(body.html, undefined);
});

test("Resend unavailable and provider failures return safe non-throwing states", async () => {
  assert.deepEqual(await sendResendNotification({}), { sent: false, reason: "not_configured" });
  const failed = await sendResendNotification({
    apiKey: "resend-secret",
    from: "hello@example.com",
    to: "owner@example.com",
    name: "Alex",
    email: "alex@example.com",
    message: "Hello",
    fetchImpl: async () => new Response("private provider detail", { status: 500 }),
  });
  assert.deepEqual(failed, { sent: false, reason: "provider_error" });
});
