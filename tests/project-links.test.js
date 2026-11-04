import test from "node:test";
import assert from "node:assert/strict";
import {
  ProjectLinkError,
  normalizeGitHubRepoUrl,
  normalizeHttpUrl,
  normalizeProjectLinks,
} from "../lib/project-links.js";

test("blank links normalize to empty strings", () => {
  assert.deepEqual(normalizeProjectLinks({ link: "", repoUrl: "   " }), {
    link: "",
    repoUrl: "",
  });
  assert.equal(normalizeHttpUrl(null, "Live Website"), "");
});

test("live website URLs are normalized to http(s) URLs", () => {
  assert.equal(normalizeHttpUrl("Example.com/path", "Live Website"), "https://example.com/path");
  assert.equal(normalizeHttpUrl("http://example.com/", "Live Website"), "http://example.com/");
  assert.equal(normalizeHttpUrl("https://example.com/page?a=1#top", "Live Website"), "https://example.com/page?a=1#top");
});

test("live website URLs reject userinfo", () => {
  assert.throws(() => normalizeHttpUrl("https://github.com@evil.com/x", "Live Website"), ProjectLinkError);
  assert.throws(() => normalizeHttpUrl("https://user:pass@example.com/x", "Live Website"), ProjectLinkError);
});

test("non-string inputs are rejected with ProjectLinkError", () => {
  assert.throws(() => normalizeHttpUrl(42, "Live Website"), ProjectLinkError);
  assert.throws(() => normalizeHttpUrl({}, "Live Website"), ProjectLinkError);
  assert.throws(() => normalizeHttpUrl(["https://example.com"], "Live Website"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl(123), ProjectLinkError);
});

test("live website URLs reject non-http schemes and malformed input", () => {
  assert.throws(() => normalizeHttpUrl("javascript:alert(1)", "Live Website"), ProjectLinkError);
  assert.throws(() => normalizeHttpUrl("ftp://example.com", "Live Website"), ProjectLinkError);
  assert.throws(() => normalizeHttpUrl("https://", "Live Website"), ProjectLinkError);
});

test("GitHub repo URLs normalize to canonical repository roots", () => {
  assert.equal(
    normalizeGitHubRepoUrl("https://github.com/Sampath0411/Sampath1904.git/?utm_source=x#readme"),
    "https://github.com/Sampath0411/Sampath1904"
  );
  assert.equal(
    normalizeGitHubRepoUrl("github.com/Sampath0411/Sampath1904/"),
    "https://github.com/Sampath0411/Sampath1904"
  );
  assert.equal(normalizeGitHubRepoUrl("https://www.github.com/owner/repo"), "https://github.com/owner/repo");
  assert.equal(
    normalizeGitHubRepoUrl("https://github.com:443/owner/repo"),
    "https://github.com/owner/repo"
  );
});

test("non-http schemes followed by digits are rejected, not coerced", () => {
  assert.throws(() => normalizeHttpUrl("javascript:123", "Live Website"), ProjectLinkError);
  assert.throws(() => normalizeHttpUrl("data:123", "Live Website"), ProjectLinkError);
  assert.throws(() => normalizeHttpUrl("ftp:88/path", "Live Website"), ProjectLinkError);
});

test("GitHub repo URLs reject invalid owner and repository names", () => {
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/-owner/repo"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner-/repo"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl(`https://github.com/${"a".repeat(40)}/repo`), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner/re po"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl(`https://github.com/owner/${"r".repeat(101)}`), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner/."), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner/.."), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner/.git"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner/..."), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner/---"), ProjectLinkError);
});

test("GitHub repo URLs reject non-GitHub hosts and non-root paths", () => {
  assert.throws(() => normalizeGitHubRepoUrl("https://gitlab.com/owner/repo"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner/repo/tree/main"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("http://github.com/owner/repo"), ProjectLinkError);
});

test("GitHub repo URLs reject ambiguous or non-canonical URLs", () => {
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com:8080/owner/repo"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("github.com:8080/owner/repo"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://user:pass@github.com/owner/repo"), ProjectLinkError);
  assert.throws(() => normalizeGitHubRepoUrl("https://user@github.com/owner/repo"), ProjectLinkError);
});

test("GitHub repo URLs accept www-prefixed host and canonicalize", () => {
  assert.equal(
    normalizeGitHubRepoUrl("https://www.github.com/owner/repo"),
    "https://github.com/owner/repo"
  );
});

test("GitHub repo URLs strip .git suffix, trailing slash and query/fragment", () => {
  assert.equal(
    normalizeGitHubRepoUrl("https://github.com/owner/repo.git"),
    "https://github.com/owner/repo"
  );
  assert.equal(
    normalizeGitHubRepoUrl("https://github.com/owner/repo/"),
    "https://github.com/owner/repo"
  );
  assert.equal(
    normalizeGitHubRepoUrl("https://github.com/owner/repo?tab=readme#readme"),
    "https://github.com/owner/repo"
  );
});

test("blank GitHub repo URLs normalize to empty strings", () => {
  assert.equal(normalizeGitHubRepoUrl(""), "");
  assert.equal(normalizeGitHubRepoUrl("   "), "");
  assert.equal(normalizeGitHubRepoUrl(null), "");
  assert.equal(normalizeGitHubRepoUrl(undefined), "");
});

test("normalizeProjectLinks preserves omitted fields and normalizes supplied fields", () => {
  const current = { link: "https://current.example/", repoUrl: "https://github.com/current/repo" };
  assert.deepEqual(normalizeProjectLinks({}, current), current);
  assert.deepEqual(
    normalizeProjectLinks({ link: "https://new.example/" }, current),
    { link: "https://new.example/", repoUrl: "https://github.com/current/repo" }
  );
  assert.deepEqual(
    normalizeProjectLinks({ repoUrl: "" }, current),
    { link: "https://current.example/", repoUrl: "" }
  );
});
