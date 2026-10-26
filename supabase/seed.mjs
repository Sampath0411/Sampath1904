import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnvConfig } from "@next/env";
import { createSupabaseClient } from "../lib/supabase.js";
import { mapPortfolioSeed } from "../lib/portfolio-seed.js";

loadEnvConfig(process.cwd());

const site = JSON.parse(await readFile(resolve("data/site.json"), "utf8"));
const projects = JSON.parse(await readFile(resolve("data/projects.json"), "utf8"));
const seed = mapPortfolioSeed(site, projects);
const supabase = createSupabaseClient();

await supabase.request("portfolio_site?on_conflict=id", {
  method: "POST",
  headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
  body: JSON.stringify([seed.site]),
});

await supabase.request("rpc/replace_portfolio_projects", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ projects_payload: seed.projects.map((row) => ({ ...row.document, published: row.published })) }),
});

console.log(`Seeded site content and ${seed.projects.length} projects. No contact messages were imported.`);
