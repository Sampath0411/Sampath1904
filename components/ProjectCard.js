"use client";

import Link from "next/link";
import { Arrow } from "@/components/Icons";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

/**
 * Project card used on the home page and the work page.
 * `small` renders the compact stacked variant.
 * Wrapped in a React Bits SpotlightCard so a lime spotlight follows
 * the pointer across the card surface.
 */
export default function ProjectCard({ project, small = false }) {
  const hasImage = !!project.image;
  const style = !hasImage && project.gradient ? { background: project.gradient } : undefined;

  const thumb = hasImage ? (
    <div className="thumb img-only" style={style}>
      <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" />
      {project.badge ? <span className="badge">{project.badge}</span> : null}
    </div>
  ) : (
    <div className="thumb" style={style}>
      {project.badge ? <span className="badge">{project.badge}</span> : null}
    </div>
  );

  const inner = small ? (
    <>
      {project.badge ? <span className="tag">{project.badge}</span> : null}
      <h3>{project.title}</h3>
      <p className="sub" style={{ marginBottom: 8 }}>{project.subtitle}</p>
      <div>
        {project.tags?.map((t) => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </div>
      <Link href={`/projects/${project.slug}`} className="btn btn-lime btn-sm">
        View project <Arrow size={13} />
      </Link>
    </>
  ) : (
    <>
      {thumb}
      <h3>{project.title}</h3>
      <p className="sub">{project.subtitle}</p>
      <div>
        {project.tags?.map((t) => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </div>
      <Link href={`/projects/${project.slug}`} className="btn btn-lime btn-sm">
        View project <Arrow size={13} />
      </Link>
    </>
  );

  return (
    <SpotlightCard
      className={`glass proj${small ? " small" : ""}`}
      style={{ padding: 16, borderRadius: 28 }}
      spotlightColor="#C8FF00"
      intensity={0.22}
      spotlightSize={320}
      softness={0.75}
      borderGlow={0.45}
      grain={0.04}
      theme="dark"
    >
      {inner}
    </SpotlightCard>
  );
}
