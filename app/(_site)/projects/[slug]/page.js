import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { Arrow } from "@/components/Icons";
import { siteBase } from "@/lib/seo";
import { buildProjectMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found | Sampath" };
  return buildProjectMetadata(project, siteBase());
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getProjects({ publishedOnly: true });
  const index = all.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  return (
    <main>
      <article className="proj-detail">
        <div className="wrap">
          <Link href="/work" className="back">
            <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}>
              <Arrow size={14} />
            </span>{" "}
            Back to all projects
          </Link>

          <div className="meta">
            {project.badge ? <span className="chip">{project.badge}</span> : null}
            {project.category ? <span className="tag">{project.category}</span> : null}
          </div>

          <h1>{project.title}</h1>
          {project.subtitle ? <p className="sub" style={{ color: "#c8c8c0", marginTop: 10 }}>{project.subtitle}</p> : null}

          <div
            className={`cover${project.image ? " img-only" : ""}`}
            style={!project.image && project.gradient ? { background: project.gradient } : undefined}
          >
            {project.image ? (
              <img src={project.image} alt={project.imageAlt || project.title} />
            ) : (
              <div style={{ height: 260, display: "grid", placeItems: "center", color: "var(--mute)", fontSize: 14 }}>
                No preview image yet — upload one from the admin panel.
              </div>
            )}
          </div>

          <div>
            {project.tags?.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>

          {project.description ? <p className="body">{project.description}</p> : null}

          <div className="cta">
            {project.link ? (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-lime">
                Open project <Arrow />
              </a>
            ) : null}
            <Link href="/contact" className="btn btn-glass">
              Start something similar
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              marginTop: 44,
              paddingTop: 22,
              borderTop: "1px solid var(--line)",
              flexWrap: "wrap",
            }}
          >
            {prev ? (
              <Link href={`/projects/${prev.slug}`} className="btn btn-glass btn-sm">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/projects/${next.slug}`} className="btn btn-glass btn-sm">
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
