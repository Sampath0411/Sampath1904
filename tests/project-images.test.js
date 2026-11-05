import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const projects = JSON.parse(
  await readFile(new URL("../data/projects.json", import.meta.url), "utf8")
);
const imageProjectSlugs = [
  "aero-view",
  "glance-windows",
  "devsocio",
  "resume-pulse",
  "agrishield-ai",
  "swiggy-lifeos",
];

test("each requested GitHub project has a local image and useful alt text", async () => {
  for (const slug of imageProjectSlugs) {
    const project = projects.find((item) => item.slug === slug);
    assert.ok(project, `missing project ${slug}`);
    assert.match(project.image, /^\/assets\/projects\//, `${slug} image must be local`);
    assert.ok(project.imageAlt?.trim(), `${slug} image needs descriptive alt text`);
    const asset = new URL(`../public${project.image}`, import.meta.url);
    await access(fileURLToPath(asset));
  }
});
