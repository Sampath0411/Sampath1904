import test from "node:test";
import assert from "node:assert/strict";
import { buildPageMetadata, buildProjectMetadata, buildSiteMetadata, buildStructuredData, serializeStructuredData } from "../lib/seo-metadata.js";

const base = "https://sampathportfolio-ten.vercel.app";

test("site metadata uses canonical absolute URLs and optional Search Console verification", () => {
  const metadata = buildSiteMetadata({
    meta: {
      title: "Sampath | Developer & Video Editor",
      description: "Portfolio description",
      author: "Sampath",
      canonical: `${base}/`,
      ogImage: "/assets/og.jpg",
    },
    hero: { lead: "Web and video work" },
  }, base, "google-token");

  assert.equal(metadata.alternates.canonical, `${base}/`);
  assert.equal(metadata.openGraph.url, `${base}/`);
  assert.deepEqual(metadata.openGraph.images, [{ url: `${base}/assets/og.jpg`, alt: "Sampath | Developer & Video Editor" }]);
  assert.equal(metadata.verification.google, "google-token");
  assert.deepEqual(metadata.twitter.images, [`${base}/assets/og.jpg`]);
});

test("site metadata omits Google verification when no token is configured", () => {
  const metadata = buildSiteMetadata({ meta: { title: "Sampath", description: "Portfolio", canonical: `${base}/` } }, base, "");
  assert.equal(metadata.verification, undefined);
});

test("project metadata is canonical to its route and uses bounded meaningful descriptions", () => {
  const metadata = buildProjectMetadata({
    slug: "aero-view",
    title: "AERO-VIEW",
    subtitle: "3D property mapping system",
    description: "A detailed case study.",
    image: "/assets/aero-view.jpg",
    imageAlt: "Aerial map view",
  }, base);

  assert.equal(metadata.alternates.canonical, `${base}/projects/aero-view`);
  assert.equal(metadata.description, "3D property mapping system");
  assert.deepEqual(metadata.openGraph.images, [{ url: `${base}/assets/aero-view.jpg`, alt: "Aerial map view" }]);
  assert.deepEqual(metadata.twitter.images, [`${base}/assets/aero-view.jpg`]);
});

test("project metadata falls back to a bounded description and safely omits empty image", () => {
  const metadata = buildProjectMetadata({ slug: "demo", title: "Demo", description: "x".repeat(200), image: "" }, base);
  assert.equal(metadata.description.length, 160);
  assert.equal(metadata.openGraph.images, undefined);
});

test("social metadata rejects non-HTTP image URLs from editable project content", () => {
  const metadata = buildProjectMetadata({ slug: "demo", title: "Demo", image: "javascript:alert(1)" }, base);
  assert.equal(metadata.openGraph.images, undefined);
  assert.equal(metadata.twitter.images, undefined);
});

test("static route metadata gets its own canonical and social share title", () => {
  const metadata = buildPageMetadata({ title: "Work | Sampath", description: "Selected web and video projects.", path: "/work" }, base);
  assert.equal(metadata.alternates.canonical, `${base}/work`);
  assert.equal(metadata.openGraph.url, `${base}/work`);
  assert.equal(metadata.openGraph.title, "Work | Sampath");
});

test("structured data contains factual person and website identities plus valid social links", () => {
  const graph = buildStructuredData({
    meta: { author: "Sampath", description: "Portfolio", canonical: `${base}/` },
    contact: { socials: [{ url: "https://github.com/Sampath0411" }, { url: "#" }, { url: "javascript:alert(1)" }] },
  }, base);

  assert.equal(graph[0].url, `${base}/`);
  assert.deepEqual(graph[0].sameAs, ["https://github.com/Sampath0411"]);
  assert.equal(graph[1].url, `${base}/`);
  assert.equal(graph.length, 2);
  assert.equal(JSON.stringify(graph).includes("ratingValue"), false);
});

test("structured data serialization escapes script-breaking content and stays valid JSON", () => {
  const json = serializeStructuredData([{ name: "</script><script>alert(1)</script>" }]);
  assert.equal(json.includes("</script>"), false);
  assert.deepEqual(JSON.parse(json), [{ name: "</script><script>alert(1)</script>" }]);
});
