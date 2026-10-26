export function mapPortfolioSeed(site, projects) {
  if (!site || typeof site !== "object" || !Array.isArray(projects)) {
    throw new Error("Portfolio seed requires a site object and a projects array.");
  }

  const ids = new Set();
  const slugs = new Set();
  const projectRows = projects.map((project) => {
    const id = String(project?.id || "").trim();
    const slug = String(project?.slug || "").trim();
    if (!id || !slug || ids.has(id) || slugs.has(slug)) {
      throw new Error("Project IDs and slugs must be present and unique.");
    }
    ids.add(id);
    slugs.add(slug);
    return { id, slug, document: project, published: project.published !== false };
  });

  return {
    site: { id: "site", content: site },
    projects: projectRows,
    messages: [],
  };
}
