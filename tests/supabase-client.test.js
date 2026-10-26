import test from "node:test";
import assert from "node:assert/strict";
import { createSupabaseClient, getSupabaseConfig } from "../lib/supabase.js";

test("requires both Supabase server credentials together", () => {
  assert.throws(() => getSupabaseConfig({ SUPABASE_URL: "https://demo.supabase.co" }), /both.*required/i);
  assert.throws(() => getSupabaseConfig({ SUPABASE_SERVICE_ROLE_KEY: "secret" }), /both.*required/i);
});

test("validates a configured Supabase URL and keeps its service key server-side", () => {
  assert.deepEqual(
    getSupabaseConfig({ SUPABASE_URL: "https://demo.supabase.co/", SUPABASE_SERVICE_ROLE_KEY: "server-secret" }),
    { url: "https://demo.supabase.co", serviceRoleKey: "server-secret" },
  );
  assert.throws(() => getSupabaseConfig({ SUPABASE_URL: "not a url", SUPABASE_SERVICE_ROLE_KEY: "secret" }), /valid.*https/i);
});

test("Supabase REST client sends service credentials and decodes JSON responses", async () => {
  const calls = [];
  const client = createSupabaseClient(
    { SUPABASE_URL: "https://demo.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "server-secret" },
    async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify([{ id: "site" }]), { status: 200, headers: { "Content-Type": "application/json" } });
    },
  );

  const data = await client.request("site_content?select=id", { method: "GET" });
  assert.deepEqual(data, [{ id: "site" }]);
  assert.equal(calls[0].url, "https://demo.supabase.co/rest/v1/site_content?select=id");
  assert.equal(calls[0].options.headers.apikey, "server-secret");
  assert.equal(calls[0].options.headers.Authorization, "Bearer server-secret");
});

test("REST errors do not expose response body details", async () => {
  const client = createSupabaseClient(
    { SUPABASE_URL: "https://demo.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "secret" },
    async () => new Response("private SQL error: secret column", { status: 500 }),
  );

  await assert.rejects(client.request("site_content"), (error) => {
    assert.match(error.message, /Supabase request failed \(500\)/);
    assert.doesNotMatch(error.message, /secret column/);
    return true;
  });
});
