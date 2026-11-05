import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const projects = JSON.parse(
  await readFile(new URL("../data/projects.json", import.meta.url), "utf8")
);

test("the requested GitHub repositories are represented in the portfolio", () => {
  const byRepo = new Map(projects.map((project) => [project.repoUrl, project]));
  const requestedRepos = [
    "https://github.com/Sampath0411/glance-windows",
    "https://github.com/Sampath0411/Devsocio",
    "https://github.com/Sampath0411/PS26011-3D-Building-Map",
    "https://github.com/Sampath0411/Resumepulse",
    "https://github.com/Sampath0411/agrishield-ai",
    "https://github.com/Sampath0411/swiggy-life-ai",
  ];

  for (const repo of requestedRepos) {
    assert.ok(byRepo.has(repo), `missing portfolio project for ${repo}`);
  }
});

test("every project has a unique identity and only public projects are listed", () => {
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  assert.ok(projects.every((project) => project.published !== false));
});
