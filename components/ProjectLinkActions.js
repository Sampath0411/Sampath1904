import { BrandIcon, ExternalLink } from "@/components/Icons";
import { safeHttpHref } from "@/lib/project-links";

export default function ProjectLinkActions({ project }) {
  const title = typeof project?.title === "string" ? project.title.trim() : "";
  const forTitle = title ? ` for ${title}` : "";

  const liveHref = safeHttpHref(project?.link);
  const repoHref = safeHttpHref(project?.repoUrl);

  const actions = [
    liveHref
      ? {
          href: liveHref,
          label: `Open the live website${forTitle} in a new tab`,
          title: "Live Website",
          icon: <ExternalLink size={17} />,
        }
      : null,
    repoHref
      ? {
          href: repoHref,
          label: `Open the GitHub repo${forTitle} in a new tab`,
          title: "GitHub Repo",
          icon: <BrandIcon name="github" size={17} />,
        }
      : null,
  ].filter(Boolean);

  if (actions.length === 0) return null;

  return (
    <div className="project-actions">
      {actions.map((action) => (
        <a
          key={action.href}
          className="icon-link"
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={action.label}
          title={action.title}
        >
          {action.icon}
        </a>
      ))}
    </div>
  );
}
