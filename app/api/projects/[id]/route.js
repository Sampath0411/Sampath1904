import { NextResponse } from "next/server";
import { getProjects, saveProjects, slugify } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { id } = await params;
  const project = getProjects().find((p) => p.id === id || p.slug === id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = projects[index];

  let slug = current.slug;
  if (body.slug !== undefined) {
    slug = slugify(body.slug || current.title);
    if (slug && projects.some((p) => p.id !== id && p.slug === slug)) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
    if (!slug) slug = current.slug;
  }

  projects[index] = {
    ...current,
    ...body,
    id: current.id,
    slug,
    title: String(body.title ?? current.title).trim() || current.title,
    tags: Array.isArray(body.tags)
      ? body.tags.map(String).filter(Boolean)
      : current.tags,
    featured: body.featured !== undefined ? !!body.featured : current.featured,
    layout: body.layout === "small" ? "small" : "large",
  };

  saveProjects(projects);
  return NextResponse.json(projects[index]);
}

export async function DELETE(_req, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const projects = getProjects();
  const next = projects.filter((p) => p.id !== id);
  if (next.length === projects.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  saveProjects(next);
  return NextResponse.json({ ok: true });
}
