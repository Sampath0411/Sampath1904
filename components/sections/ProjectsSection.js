import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { Arrow, Squiggle } from "@/components/Icons";
import ScrollReveal from "@/components/reactbits/ScrollReveal";

/**
 * "Selected Projects" section: two large cards plus a stacked column
 * for the rest — exactly like the original layout, but data-driven.
 */
export default function ProjectsSection({ work, projects }) {
  const featured = projects.filter((p) => p.featured);
  const large = featured.slice(0, 2);
  const rest = featured.slice(2);
  const totalCols = 2 + (rest.length ? 1 : 0);
  const colClass = totalCols >= 3 ? "" : totalCols === 2 ? "cols-2" : "cols-1";

  return (
    <section id="work" aria-labelledby="work-h">
      <div className="wrap">
        <div className="head">
          <div>
            <div className="num">
              {work.num} <Squiggle />
            </div>
            <ScrollReveal
              id="work-h"
              effect="fade"
              mode="enter"
              duration={0.9}
              enableBlur={false}
              baseOpacity={0}
              containerClassName="head-title"
            >
              {work.title}
              <br />
              <em>{work.titleEm}</em>
            </ScrollReveal>
          </div>
          <Link className="viewall" href="/work">
            {work.viewAllLabel} <Arrow size={14} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="empty">{work.emptyText}</p>
        ) : (
          <div className={`projects ${colClass}`.trim()}>
            {large.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
            {rest.length ? (
              <div className="stack">
                {rest.map((p) => (
                  <ProjectCard key={p.id} project={p} small />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
