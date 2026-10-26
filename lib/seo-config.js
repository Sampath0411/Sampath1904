export const PRODUCTION_SITE_URL = "https://sampathportfolio-ten.vercel.app";

function validHttpOrigin(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;
    if (url.hostname === "yourdomain.com") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function resolveSiteBase({ siteUrl, canonical, nodeEnv = process.env.NODE_ENV } = {}) {
  return (
    validHttpOrigin(siteUrl) ||
    validHttpOrigin(canonical) ||
    (nodeEnv === "production" ? PRODUCTION_SITE_URL : "http://localhost:3000")
  );
}

export function buildSitemapEntries(base, projects = []) {
  const routes = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/work", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "yearly" },
    { path: "/skills", priority: 0.7, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ].map((route) => ({ ...route, url: new URL(route.path, `${base.replace(/\/$/, "")}/`).toString() }));

  const projectRoutes = projects
    .filter((project) => project?.slug && project.published !== false)
    .map((project) => ({
      url: new URL(`/projects/${encodeURIComponent(project.slug)}`, `${base.replace(/\/$/, "")}/`).toString(),
      lastModified: project.updatedAt || undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...routes, ...projectRoutes];
}
