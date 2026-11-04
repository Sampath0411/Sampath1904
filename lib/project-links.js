export class ProjectLinkError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProjectLinkError";
  }
}

// A leading token is only treated as a missing scheme (host:port) when it is a
// dotted host with a numeric port, e.g. "github.com:8080/owner/repo". Anything
// else with a scheme-like prefix ("javascript:123", "data:123", "ftp:88/path")
// is parsed as a scheme and rejected unless it is http(s).
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const DOTTED_HOST_PORT = /^[a-z0-9-]+(\.[a-z0-9-]+)+:\d+([/?#]|$)/i;
const hasScheme = (value) => SCHEME.test(value) && !DOTTED_HOST_PORT.test(value);

function parseHttpUrl(value, label) {
  if (value !== null && value !== undefined && typeof value !== "string") {
    throw new ProjectLinkError(`${label} must be a string.`);
  }
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;

  const withScheme = hasScheme(trimmed) ? trimmed : `https://${trimmed}`;
  let parsed;
  try {
    parsed = new URL(withScheme);
  } catch {
    throw new ProjectLinkError(`${label} must be a valid URL.`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ProjectLinkError(`${label} must use http or https.`);
  }
  if (!parsed.hostname) {
    throw new ProjectLinkError(`${label} must include a hostname.`);
  }
  if (parsed.username || parsed.password) {
    throw new ProjectLinkError(`${label} must not include credentials.`);
  }
  return parsed;
}

export function normalizeHttpUrl(value, label = "Link") {
  const parsed = parseHttpUrl(value, label);
  return parsed ? parsed.toString() : "";
}

const GITHUB_OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const GITHUB_REPO = /^[A-Za-z0-9._-]{1,100}$/;
const GITHUB_REPO_HAS_ALNUM = /[A-Za-z0-9]/;

export function normalizeGitHubRepoUrl(value) {
  const parsed = parseHttpUrl(value, "GitHub Repo");
  if (!parsed) return "";
  if (parsed.protocol !== "https:") {
    throw new ProjectLinkError("GitHub Repo must use https.");
  }
  if (parsed.port) {
    throw new ProjectLinkError("GitHub Repo must not include a port.");
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  if (host !== "github.com") {
    throw new ProjectLinkError("GitHub Repo must be a github.com repository URL.");
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts.length !== 2) {
    throw new ProjectLinkError("GitHub Repo must point to a repository root (https://github.com/<owner>/<repo>).");
  }

  const [owner, repoPart] = parts;
  const repo = repoPart.replace(/\.git$/i, "");
  if (!GITHUB_OWNER.test(owner) || !GITHUB_REPO.test(repo) || !GITHUB_REPO_HAS_ALNUM.test(repo)) {
    throw new ProjectLinkError("GitHub Repo has an invalid owner or repository name.");
  }

  return `https://github.com/${owner}/${repo}`;
}

export function normalizeProjectLinks(input = {}, current = {}) {
  const source = input && typeof input === "object" ? input : {};
  const fallback = current && typeof current === "object" ? current : {};
  const pick = (key) =>
    Object.prototype.hasOwnProperty.call(source, key) ? source[key] : fallback[key];

  return {
    link: normalizeHttpUrl(pick("link"), "Live Website"),
    repoUrl: normalizeGitHubRepoUrl(pick("repoUrl")),
  };
}
