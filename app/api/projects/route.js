import { NextResponse } from "next/server";
import { getProjects, saveProjects, newId, slugify } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import { ProjectLinkError, normalizeProjectLinks } from "@/lib/project-links";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getProjects({ publishedOnly: true }));
}

export async function POST(req) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !String(body.title || "").trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  let links;
  try {
    links = normalizeProjectLinks(body);
  } catch (err) {
    if (err instanceof ProjectLinkError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const projects = await getProjects();
  let slug = slugify(body.slug || body.title);
  if (!slug) slug = `project-${Date.now()}`;
  while (projects.some((p) => p.slug === slug)) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
  }

  const project = {
    id: newId("p"),
    slug,
    title: String(body.title).trim(),
    subtitle: body.subtitle || "",
    description: body.description || "",
    badge: body.badge || body.category || "Project",
    category: body.category || "",
    tags: Array.isArray(body.tags) ? body.tags.map(String).filter(Boolean) : [],
    image: body.image || "",
    imageAlt: body.imageAlt || "",
    link: links.link,
    repoUrl: links.repoUrl,
    featured: !!body.featured,
    published: body.published !== false,
    layout: body.layout === "small" ? "small" : "large",
    gradient: body.gradient || "",
  };

  projects.push(project);
  await saveProjects(projects);
  return NextResponse.json(project, { status: 201 });
}
