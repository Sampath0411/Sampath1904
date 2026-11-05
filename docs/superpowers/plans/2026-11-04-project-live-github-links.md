# Project Live Website and GitHub Repo Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a validated Live Website link and GitHub Repo link to every project, editable in admin and visible from project cards, the Work/Home grids, and project detail pages.

**Architecture:** Reuse the existing `link` field as the Live Website URL and add an optional `repoUrl` string to each project document. Centralize URL validation and normalization in `lib/project-links.js` so the admin UI and both project API routes share the same rules. Render compact shared icon actions from `components/ProjectLinkActions.js` for cards; use text buttons on detail pages.

**Tech Stack:** Next.js App Router, React, Node test runner, existing CSS in `app/globals.css`, Supabase document JSON / local `data/projects.json`.

---

## File map

- Create `lib/project-links.js` — shared HTTP(S) and GitHub repository URL validation/normalization; exports `ProjectLinkError`, `normalizeHttpUrl`, `normalizeGitHubRepoUrl`, `normalizeProjectLinks`.
- Create `tests/project-links.test.js` — unit tests for blank values, normalization, invalid schemes/hosts, `.git` and URL decoration handling.
- Modify `app/api/projects/route.js` — validate links on create and persist `repoUrl`.
- Modify `app/api/projects/[id]/route.js` — validate links on update, preserve omitted fields, clear blank fields.
- Modify `components/admin/AdminPanel.js` — rename External link to Live Website, add GitHub Repo, normalize before submit, include `repoUrl` in blank project.
- Create `components/ProjectLinkActions.js` — shared compact Live Website / GitHub Repo icon links.
- Modify `components/Icons.js` — add `ExternalLink`.
- Modify `components/ProjectCard.js` — render icon links beside “View project”.
- Modify `app/(_site)/projects/[slug]/page.js` — render Live Website and GitHub Repo buttons.
- Modify `app/globals.css` — styles for `.project-footer`, `.project-actions`, `.icon-link`.

## Data contract

Project objects gain one optional property:

```js
{
  link: "https://example.com/",      // existing field, now labelled Live Website
  repoUrl: "https://github.com/owner/repo" // absent or empty means no repo button
}
```

Both fields normalize to canonical URLs before saving. Blank strings are valid and render no public controls. Omitted fields on `PUT` preserve stored values; blank strings clear them.

## Task 1: Add failing URL-normalization tests

**Files:**
- Create: `tests/project-links.test.js`

- [x] **Step 1: Write the failing test**

```js
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
});

test("GitHub repo URLs reject non-GitHub hosts and non-root paths", () => {
  assert.throws(() => normalizeGitHubRepoUrl("https://gitlab.com/owner/repo"), /github\.com/i);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner"), /repository root/i);
  assert.throws(() => normalizeGitHubRepoUrl("https://github.com/owner/repo/tree/main"), /repository root/i);
  assert.throws(() => normalizeGitHubRepoUrl("http://github.com/owner/repo"), /https/i);
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
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --experimental-default-type=module --test tests/project-links.test.js`

Expected before implementation: FAIL with module-not-found.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/project-links.test.js
git commit -m "test: cover project link normalization"
```

## Task 2: Implement shared link normalization

**Files:**
- Create: `lib/project-links.js`
- Test: `tests/project-links.test.js`

- [x] **Step 1: Create `lib/project-links.js`**

```js
export class ProjectLinkError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProjectLinkError";
  }
}

const hasScheme = (value) => /^[a-z][a-z0-9+.-]*:/i.test(value);

function parseHttpUrl(value, label) {
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
  return parsed;
}

export function normalizeHttpUrl(value, label = "Link") {
  const parsed = parseHttpUrl(value, label);
  return parsed ? parsed.toString() : "";
}

const GITHUB_OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const GITHUB_REPO = /^[A-Za-z0-9._-]{1,100}$/;

export function normalizeGitHubRepoUrl(value) {
  const parsed = parseHttpUrl(value, "GitHub Repo");
  if (!parsed) return "";
  if (parsed.protocol !== "https:") {
    throw new ProjectLinkError("GitHub Repo must use https.");
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
  if (!GITHUB_OWNER.test(owner) || !GITHUB_REPO.test(repo) || repo === "." || repo === "..") {
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
```

- [x] **Step 2: Run the test to verify it passes**

Run: `node --experimental-default-type=module --test tests/project-links.test.js`

Expected: PASS, 6 tests.

- [ ] **Step 3: Commit the helper and tests**

```bash
git add lib/project-links.js tests/project-links.test.js
git commit -m "feat: validate project live and repo links"
```

## Task 3: Apply shared validation in project create/update APIs

**Files:**
- Modify: `app/api/projects/route.js`
- Modify: `app/api/projects/[id]/route.js`

- [ ] **Step 1: Update `app/api/projects/route.js` imports**

Replace:

```js
import { getProjects, saveProjects, newId, slugify } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
```

with:

```js
import { getProjects, saveProjects, newId, slugify } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import { ProjectLinkError, normalizeProjectLinks } from "@/lib/project-links";
```

- [ ] **Step 2: Validate links before building the new project**

After the title check and before `const projects = await getProjects();`, add:

```js
  let links;
  try {
    links = normalizeProjectLinks(body);
  } catch (err) {
    if (err instanceof ProjectLinkError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
```

Then replace `link: body.link || "",` with:

```js
    link: links.link,
    repoUrl: links.repoUrl,
```

- [ ] **Step 3: Update `app/api/projects/[id]/route.js` imports**

Replace:

```js
import { getProjects, saveProjects, slugify } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
```

with:

```js
import { getProjects, saveProjects, slugify } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import { ProjectLinkError, normalizeProjectLinks } from "@/lib/project-links";
```

- [ ] **Step 4: Validate and preserve update links**

After `const current = projects[index];`, add:

```js
  let links;
  try {
    links = normalizeProjectLinks(body, current);
  } catch (err) {
    if (err instanceof ProjectLinkError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
  const { link: _link, repoUrl: _repoUrl, ...rest } = body;
```

Then replace the `projects[index] = { ...current, ...body, ...` block with:

```js
  projects[index] = {
    ...current,
    ...rest,
    link: links.link,
    repoUrl: links.repoUrl,
    id: current.id,
    slug,
    title: String(body.title ?? current.title).trim() || current.title,
```

Leave the remaining fields (`tags`, `featured`, `layout`, and closing) unchanged.

- [ ] **Step 5: Run project-link tests and existing test suite**

Run: `node --experimental-default-type=module --test tests/project-links.test.js`
Expected: PASS.

Run: `npm test`
Expected: PASS with no failed tests.

- [ ] **Step 6: Commit API changes**

```bash
git add app/api/projects/route.js "app/api/projects/[id]/route.js"
git commit -m "feat: persist validated GitHub repo links"
```

## Task 4: Update the admin project form

**Files:**
- Modify: `components/admin/AdminPanel.js`

- [ ] **Step 1: Import the shared normalizer**

After the existing import of `ImagePicker`, add:

```js
import { normalizeProjectLinks, ProjectLinkError } from "@/lib/project-links";
```

- [ ] **Step 2: Add `repoUrl` to a blank project**

In `blankProject()`, after `link: "",` add:

```js
      repoUrl: "",
```

- [ ] **Step 3: Normalize before `saveProject` sends the request**

Inside `saveProject()`, replace:

```js
      const isNew = !draft.id;
      const res = await fetch(isNew ? "/api/projects" : `/api/projects/${draft.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
```

with:

```js
      let links;
      try {
        links = normalizeProjectLinks(draft);
      } catch (err) {
        if (err instanceof ProjectLinkError) {
          flash("err", err.message);
          setBusy(false);
          return;
        }
        throw err;
      }
      const payload = { ...draft, ...links };
      const isNew = !draft.id;
      const res = await fetch(isNew ? "/api/projects" : `/api/projects/${draft.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
```

- [ ] **Step 4: Rename External link and add GitHub Repo input**

Replace:

```jsx
                <Field label="External link" value={draft.link} onChange={(v) => updDraft("link", v)} placeholder="https://…" />
```

with:

```jsx
                <Field label="Live Website" value={draft.link} onChange={(v) => updDraft("link", v)} placeholder="https://example.com" />
                <Field label="GitHub Repo" value={draft.repoUrl ?? ""} onChange={(v) => updDraft("repoUrl", v)} placeholder="https://github.com/owner/repo" />
```

- [ ] **Step 5: Build admin UI to catch syntax/render errors**

Run: `npm run build`

Expected: build completes without syntax/import errors.

- [ ] **Step 6: Commit admin changes**

```bash
git add components/admin/AdminPanel.js
git commit -m "feat: edit live and GitHub links in project admin"
```

## Task 5: Add compact public project link actions

**Files:**
- Modify: `components/Icons.js`
- Create: `components/ProjectLinkActions.js`
- Modify: `components/ProjectCard.js`

- [ ] **Step 1: Add `ExternalLink` to `components/Icons.js`**

After the `ArrowUp` function, add:

```jsx
export function ExternalLink({ size = 16 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
```

- [ ] **Step 2: Create `components/ProjectLinkActions.js`**

```jsx
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
```

- [ ] **Step 3: Import `ProjectLinkActions` in `components/ProjectCard.js`**

After the `SpotlightCard` import, add:

```js
import ProjectLinkActions from "@/components/ProjectLinkActions";
```

- [ ] **Step 4: Replace both “View project” blocks with a footer row**

In the small card branch, replace:

```jsx
      <Link href={`/projects/${project.slug}`} className="btn btn-lime btn-sm">
        View project <Arrow size={13} />
      </Link>
```

with:

```jsx
      <div className="project-footer">
        <Link href={`/projects/${project.slug}`} className="btn btn-lime btn-sm">
          View project <Arrow size={13} />
        </Link>
        <ProjectLinkActions project={project} />
      </div>
```

Make the same replacement in the large card branch.

- [ ] **Step 5: Add styles to `app/globals.css`**

Insert after the `.proj.no-hover:hover{transform:none}` rule:

```css
.project-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}
.project-actions{display:flex;align-items:center;gap:8px}
.icon-link{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.04);color:var(--lime);transition:border-color .2s,background .2s,transform .2s}
.icon-link:hover{border-color:var(--lime);background:rgba(200,255,0,.08);transform:translateY(-2px)}
.icon-link:focus-visible{outline:2px solid var(--lime);outline-offset:3px}
```

- [ ] **Step 6: Commit public card actions**

```bash
git add components/Icons.js components/ProjectLinkActions.js components/ProjectCard.js app/globals.css
git commit -m "feat: show project live and repo actions on cards"
```

## Task 6: Show link buttons on project detail pages

**Files:**
- Modify: `app/(_site)/projects/[slug]/page.js`

- [ ] **Step 1: Import `BrandIcon`**

Replace:

```js
import { Arrow } from "@/components/Icons";
```

with:

```js
import { Arrow, BrandIcon } from "@/components/Icons";
```

- [ ] **Step 2: Replace the CTA link block**

Replace:

```jsx
            {project.link ? (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-lime">
                Open project <Arrow />
              </a>
            ) : null}
```

with:

```jsx
            {project.link ? (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-lime">
                Live Website <Arrow />
              </a>
            ) : null}
            {project.repoUrl ? (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-glass">
                <BrandIcon name="github" size={18} /> GitHub Repo
              </a>
            ) : null}
```

- [ ] **Step 3: Build to verify server/client boundaries**

Run: `npm run build`

Expected: build completes successfully.

- [ ] **Step 4: Commit detail-page buttons**

```bash
git add "app/(_site)/projects/[slug]/page.js"
git commit -m "feat: show project live and repo actions on detail pages"
```

## Task 7: End-to-end verification

**Files:**
- No source changes expected.

- [ ] **Step 1: Run the full automated checks**

Run: `npm test`
Expected: all tests pass, including `tests/project-links.test.js`.

Run: `npm run build`
Expected: production build completes successfully.

- [ ] **Step 2: Start the site locally**

Run in the background: `npm run dev`

Open `/admin`, log in, edit a project, and set:

```text
Live Website: https://example.com
GitHub Repo: https://github.com/Sampath0411/Sampath1904
```

Save, then inspect:

- `/` featured project card shows both icon buttons.
- `/work` project card shows both icon buttons.
- `/projects/<slug>` shows `Live Website` and `GitHub Repo` buttons.
- `https://github.com/Sampath0411/Sampath1904.git` normalizes to the repository root.
- `https://gitlab.com/owner/repo` is rejected with “GitHub Repo must be a github.com repository URL.”
- Blank fields remove both public controls.

- [ ] **Step 3: Confirm persisted data**

Run: `git diff data/projects.json`

Expected: only intentional local test-data updates appear. If test data was edited solely for verification, restore only those temporary edits with `git restore --source=HEAD -- data/projects.json` after confirmation.

- [ ] **Step 4: Review final diff**

Run: `git status --short`
Expected: only intended files plus the pre-existing untracked `rulebook-extracted.txt` remain.

Run: `git log --oneline -6`
Expected: commits for tests, validation, admin, card actions, and detail actions appear in order.
