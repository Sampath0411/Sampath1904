import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { mapPortfolioSeed } from "../lib/portfolio-seed.js";

const root = process.cwd();

test("seed mapping preserves current site content and each project's stable identity", async () => {
  const site = JSON.parse(await readFile(resolve(root, "data/site.json"), "utf8"));
  const projects = JSON.parse(await readFile(resolve(root, "data/projects.json"), "utf8"));
  const seed = mapPortfolioSeed(site, projects);

  assert.deepEqual(seed.site, { id: "site", content: site });
  assert.equal(seed.projects.length, projects.length);
  assert.deepEqual(seed.projects.map((row) => row.id), projects.map((project) => project.id));
  assert.deepEqual(seed.projects.map((row) => row.slug), projects.map((project) => project.slug));
  assert.equal(seed.projects[0].document.title, projects[0].title);
  assert.ok(seed.projects.every((row) => row.published === true));
  assert.deepEqual(seed.messages, []);
});

test("seed mapping rejects duplicate/missing project identity before writing", () => {
  assert.throws(() => mapPortfolioSeed({}, [{ id: "p1", slug: "same" }, { id: "p2", slug: "same" }]), /project IDs and slugs.*unique/i);
  assert.throws(() => mapPortfolioSeed({}, [{ id: "", slug: "missing-id" }]), /project IDs and slugs.*unique/i);
});
