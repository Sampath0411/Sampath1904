import ProjectCard from "@/components/ProjectCard";
import { getProjects, getSite } from "@/lib/data";
import { siteBase } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return buildPageMetadata({
    title: "Selected Work | Sampath",
    description: "Selected web development, video editing and creative projects by Sampath.",
    path: "/work",
  }, siteBase());
}

export default async function WorkPage() {
  const [site, projects] = await Promise.all([getSite(), getProjects({ publishedOnly: true })]);

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="num">{site.work.num}</div>
          <h1 style={{ fontSize: "clamp(42px,6vw,72px)", fontWeight: 800, letterSpacing: "-.03em" }}>
            {site.work.title} <em style={{ fontStyle: "normal", color: "var(--lime)" }}>{site.work.titleEm}</em>
          </h1>
          <p>
            Every build, edit and shoot — the full collection of projects, not just the featured few.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          {projects.length === 0 ? (
            <p className="empty">{site.work.emptyText}</p>
          ) : (
            <div className="projects" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
