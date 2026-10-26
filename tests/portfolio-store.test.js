import test from "node:test";
import assert from "node:assert/strict";
import { createPortfolioStore } from "../lib/portfolio-store.js";

test("local store reads and writes content without requiring Supabase", async () => {
  const values = { site: { meta: { title: "Local" } }, projects: [], messages: [] };
  const local = {
    read: (key) => values[key],
    write: (key, value) => { values[key] = value; },
  };
  const store = createPortfolioStore({ local, production: false });

  assert.deepEqual(await store.getSite(), { meta: { title: "Local" } });
  await store.saveSite({ meta: { title: "Updated locally" } });
  assert.equal(values.site.meta.title, "Updated locally");
});

test("remote store maps Supabase rows to existing site and project shapes", async () => {
  const requests = [];
  const client = {
    async request(path, options = {}) {
      requests.push({ path, options });
      if (path.startsWith("portfolio_site?")) return [{ content: { meta: { title: "Remote" } } }];
      if (path.startsWith("portfolio_projects?")) return [
        { document: { id: "p1", slug: "one", title: "One" }, published: true },
        { document: { id: "p2", slug: "draft", title: "Draft" }, published: false },
      ];
      return [];
    },
  };
  const store = createPortfolioStore({ client, local: {}, production: true });

  assert.equal((await store.getSite()).meta.title, "Remote");
  assert.deepEqual((await store.getProjects()).map((project) => project.slug), ["one", "draft"]);
  assert.deepEqual((await store.getProjects({ publishedOnly: true })).map((project) => project.slug), ["one"]);
  assert.equal(requests.length, 3);
});

test("remote mutations use database RPC/REST endpoints and preserve project documents", async () => {
  const requests = [];
  const client = { request: async (path, options = {}) => { requests.push({ path, options }); return null; } };
  const store = createPortfolioStore({ client, local: {}, production: true });
  const projects = [{ id: "p1", slug: "one", title: "One" }];

  await store.saveSite({ meta: { title: "Saved" } });
  await store.saveProjects(projects);
  await store.addMessage({ id: "m1", name: "A", email: "a@example.com", message: "Hello", receivedAt: "2026-10-26T00:00:00.000Z" });
  await store.deleteMessage("m1");

  assert.equal(requests[0].path, "portfolio_site?id=eq.site");
  assert.equal(requests[1].path, "rpc/replace_portfolio_projects");
  assert.equal(requests[1].options.body, JSON.stringify({ projects_payload: projects }));
  assert.equal(requests[2].path, "rpc/store_portfolio_message");
  assert.equal(requests[3].path, "portfolio_messages?id=eq.m1&select=id");
});

test("remote messages map database timestamps to the admin inbox contract", async () => {
  const client = {
    request: async () => [{ id: "m1", name: "Alex", email: "alex@example.com", message: "Hi", received_at: "2026-10-26T00:00:00.000Z" }],
  };
  const store = createPortfolioStore({ client, local: {}, production: true });
  assert.deepEqual(await store.getMessages(), [{
    id: "m1", name: "Alex", email: "alex@example.com", message: "Hi", receivedAt: "2026-10-26T00:00:00.000Z",
  }]);
});

test("contact rate limits are checked through the atomic Supabase function", async () => {
  const requests = [];
  const client = { request: async (path, options = {}) => { requests.push({ path, options }); return true; } };
  const store = createPortfolioStore({ client, local: {}, production: true });

  assert.equal(await store.consumeContactLimit("hashed-client-ip"), true);
  assert.equal(requests[0].path, "rpc/consume_portfolio_contact_limit");
  assert.deepEqual(JSON.parse(requests[0].options.body), { supplied_hash: "hashed-client-ip", max_requests: 5, window_seconds: 3600 });
});

test("production mutations fail clearly instead of pretending local disk writes persist", async () => {
  const store = createPortfolioStore({ local: { read: () => ({}), write() {} }, production: true });
  await assert.rejects(store.saveSite({}), /Supabase is required for production writes/i);
});
