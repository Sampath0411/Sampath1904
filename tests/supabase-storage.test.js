import test from "node:test";
import assert from "node:assert/strict";
import { createSupabaseStorage } from "../lib/supabase-storage.js";

const env = { SUPABASE_URL: "https://demo.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "storage-secret" };

test("uploaded assets use the public bucket URL without exposing credentials", () => {
  const storage = createSupabaseStorage(env, async () => new Response(null, { status: 200 }));
  assert.equal(storage.publicUrl("1700000000-cover.webp"), "https://demo.supabase.co/storage/v1/object/public/portfolio-assets/1700000000-cover.webp");
});

test("uploads use authenticated server-only storage requests with validated content type", async () => {
  let call;
  const storage = createSupabaseStorage(env, async (url, options) => {
    call = { url, options };
    return new Response(JSON.stringify({ Key: "portfolio-assets/image.webp" }), { status: 200 });
  });
  await storage.upload("image.webp", "image/webp", Buffer.from("image-bytes"));

  assert.equal(call.url, "https://demo.supabase.co/storage/v1/object/portfolio-assets/image.webp");
  assert.equal(call.options.method, "POST");
  assert.equal(call.options.headers.Authorization, "Bearer storage-secret");
  assert.equal(call.options.headers["Content-Type"], "image/webp");
  assert.equal(call.options.headers["x-upsert"], "true");
});

test("storage failures are sanitized", async () => {
  const storage = createSupabaseStorage(env, async () => new Response("private key leaked", { status: 403 }));
  await assert.rejects(storage.upload("image.webp", "image/webp", Buffer.from("x")), (error) => {
    assert.match(error.message, /Supabase Storage request failed \(403\)/);
    assert.doesNotMatch(error.message, /private key/);
    return true;
  });
});
