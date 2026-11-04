import { BrandIcon, ExternalLink } from "@/components/Icons";

export default function ProjectLinkActions({ project, className = "" }) {
  const actions = [
    project.link
      ? {
          href: project.link,
          label: "Open Live Website in a new tab",
          title: "Live Website",
          icon: <ExternalLink size={17} />,
        }
      : null,
    project.repoUrl
      ? {
          href: project.repoUrl,
          label: "Open GitHub Repo in a new tab",
          title: "GitHub Repo",
          icon: <BrandIcon name="github" size={17} />,
        }
      : null,
  ].filter(Boolean);

  if (actions.length === 0) return null;

  return (
    <div className={`project-actions${className ? ` ${className}` : ""}`}>
      {actions.map((action) => (
        <a
          key={action.href}
          className="icon-link"
          href={action.href}
          target="_blank"
          rel="noreferrer"
          aria-label={action.label}
          title={action.title}
        >
          {action.icon}
        </a>
      ))}
    </div>
  );
}
