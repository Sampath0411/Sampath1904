import test from "node:test";
import assert from "node:assert/strict";
import { buildSitemapEntries, resolveSiteBase } from "../lib/seo-config.js";

test("prefers SITE_URL over the saved canonical and removes trailing slash", () => {
  assert.equal(
    resolveSiteBase({
      siteUrl: "https://sampathportfolio-ten.vercel.app/",
      canonical: "https://yourdomain.com/",
      nodeEnv: "production",
    }),
    "https://sampathportfolio-ten.vercel.app",
  );
});

test("uses the live portfolio URL in production when no URL is configured", () => {
  assert.equal(
    resolveSiteBase({ canonical: "https://yourdomain.com/", nodeEnv: "production" }),
    "https://sampathportfolio-ten.vercel.app",
  );
});

test("uses localhost in development when no URL is configured", () => {
  assert.equal(resolveSiteBase({ nodeEnv: "development" }), "http://localhost:3000");
});

test("rejects invalid and non-HTTP configured URLs without emitting placeholders", () => {
  assert.equal(resolveSiteBase({ siteUrl: "not-a-url", nodeEnv: "production" }), "https://sampathportfolio-ten.vercel.app");
  assert.equal(resolveSiteBase({ siteUrl: "ftp://example.com", nodeEnv: "production" }), "https://sampathportfolio-ten.vercel.app");
});

test("sitemap contains absolute public routes and only non-draft project pages", () => {
  const entries = buildSitemapEntries(
    "https://sampathportfolio-ten.vercel.app",
    [{ slug: "aero-view" }, { slug: "draft-work", published: false }, { title: "No slug" }],
    new Date("2026-10-26T00:00:00.000Z"),
  );
  const urls = entries.map((entry) => entry.url);

  assert.ok(urls.includes("https://sampathportfolio-ten.vercel.app/"));
  assert.ok(urls.includes("https://sampathportfolio-ten.vercel.app/projects/aero-view"));
  assert.ok(!urls.some((url) => url.includes("yourdomain.com")));
  assert.ok(!urls.some((url) => url.includes("draft-work")));
  assert.ok(!urls.some((url) => url.includes("admin") || url.includes("api")));
});
