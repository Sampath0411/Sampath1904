# Project Card Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all six requested GitHub projects accurate, locally stored images on the work cards and detail pages.

**Architecture:** Keep the existing project-card and detail-page components unchanged. Store official Glance/PS26011 visuals and screenshots of the other four official demos under `public/assets/projects/`, then reference them with `image` and `imageAlt` in `data/projects.json`. Add a Node test that checks all six project records point to existing local image files and have useful alt text.

**Tech Stack:** Next.js 16, JSON project data, Node.js test runner, Playwright screenshots.

---

## Files and responsibilities

- Create `tests/project-images.test.js` to assert the six requested project entries have local image paths, non-empty alt text, and existing image files.
- Create `public/assets/projects/glance-windows.png` from the official Glance download artwork in its GitHub repository.
- Create `public/assets/projects/ps26011-3d-building-map.png` from the official `1-city.png` screenshot in the PS26011 repository.
- Create `public/assets/projects/devsocio.jpg`, `resume-pulse.jpg`, `agrishield-ai.jpg`, and `swiggy-lifeos.jpg` by capturing the visible first viewport of each project's linked official demo.
- Modify only the corresponding six entries in `data/projects.json`; keep project copy, outbound links, and featured flags unchanged.

## Task 1: Add failing project-image regression tests

**Files:**
- Create: `tests/project-images.test.js`

- [ ] **Step 1: Add the test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const projects = JSON.parse(
  await readFile(new URL("../data/projects.json", import.meta.url), "utf8")
);
const imageProjectSlugs = [
  "aero-view",
  "glance-windows",
  "devsocio",
  "resume-pulse",
  "agrishield-ai",
  "swiggy-lifeos",
];

test("each requested GitHub project has a local image and useful alt text", async () => {
  for (const slug of imageProjectSlugs) {
    const project = projects.find((item) => item.slug === slug);
    assert.ok(project, `missing project ${slug}`);
    assert.match(project.image, /^\/assets\/projects\//, `${slug} image must be local`);
    assert.ok(project.imageAlt?.trim(), `${slug} image needs descriptive alt text`);
    const asset = new URL(`../public${project.image}`, import.meta.url);
    await access(fileURLToPath(asset));
  }
});
```

- [ ] **Step 2: Run the test and confirm it fails before adding assets**

Run: `node --experimental-default-type=module --test tests/project-images.test.js`

Expected: FAIL because the project image paths/assets have not yet been added.

- [ ] **Step 3: Commit the failing test**

```powershell
git add tests/project-images.test.js
git commit -m "test: require local images for requested projects"
```

## Task 2: Add the six official project visuals

**Files:**
- Create: `public/assets/projects/glance-windows.png`
- Create: `public/assets/projects/ps26011-3d-building-map.png`
- Create: `public/assets/projects/devsocio.jpg`
- Create: `public/assets/projects/resume-pulse.jpg`
- Create: `public/assets/projects/agrishield-ai.jpg`
- Create: `public/assets/projects/swiggy-lifeos.jpg`

- [ ] **Step 1: Create the image directory and copy the two repo-owned official images**

Run from the repository root:

```powershell
New-Item -ItemType Directory -Force public/assets/projects | Out-Null
curl.exe -fLsS "https://raw.githubusercontent.com/Sampath0411/glance-windows/main/assets/GlanceDownload.png" -o public/assets/projects/glance-windows.png
curl.exe -fLsS "https://raw.githubusercontent.com/Sampath0411/PS26011-3D-Building-Map/main/docs/shots/1-city.png" -o public/assets/projects/ps26011-3d-building-map.png
```

- [ ] **Step 2: Capture first-viewport screenshots from the four official project demos**

Run this Python Playwright script from the repository root after the screenshots directory exists:

```python
from pathlib import Path
from playwright.sync_api import sync_playwright

targets = [
    ("devsocio", "https://devsocio-black.vercel.app"),
    ("resume-pulse", "https://resumepulse-zeta.vercel.app"),
    ("agrishield-ai", "https://agrishield-landing.vercel.app/"),
    ("swiggy-lifeos", "https://swiggy-life-ai.vercel.app"),
]
output = Path("public/assets/projects")
output.mkdir(parents=True, exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for slug, url in targets:
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        response = page.goto(url, wait_until="domcontentloaded", timeout=45000)
        if response is None or response.status >= 400:
            raise RuntimeError(f"Demo screenshot unavailable: {url}")
        page.wait_for_timeout(1800)
        page.screenshot(
            path=str(output / f"{slug}.jpg"),
            type="jpeg",
            quality=88,
            full_page=False,
        )
        page.close()
    browser.close()
```

If a demo is unavailable or its rendered page is not a project-relevant visual, stop and report that project rather than using a stock/Google image.

- [ ] **Step 3: Inspect dimensions, file sizes, and previews of all six assets**

Run: `Get-ChildItem public/assets/projects | Select-Object Name,Length`

Expected: six non-empty files with the correct project visual in each.

- [ ] **Step 4: Commit the image assets**

```powershell
git add public/assets/projects
git commit -m "assets: add project-specific portfolio screenshots"
```

## Task 3: Wire images and alt text into project data

**Files:**
- Modify: `data/projects.json`
- Test: `tests/project-images.test.js`

- [ ] **Step 1: Set the six image fields**

Use these paths and descriptions:

| Slug | `image` | `imageAlt` |
|---|---|---|
| `aero-view` | `/assets/projects/ps26011-3d-building-map.png` | `3D ULPIN map interface showing Siripuram, Visakhapatnam` |
| `glance-windows` | `/assets/projects/glance-windows.png` | `Official Glance face-unlock artwork for Windows` |
| `devsocio` | `/assets/projects/devsocio.jpg` | `DevSocio developer-community project homepage` |
| `resume-pulse` | `/assets/projects/resume-pulse.jpg` | `ResumePulse resume-builder project homepage` |
| `agrishield-ai` | `/assets/projects/agrishield-ai.jpg` | `AgriShield AI rice-farming assistant homepage` |
| `swiggy-lifeos` | `/assets/projects/swiggy-lifeos.jpg` | `Swiggy LifeOS lifestyle-assistant demo homepage` |

Do not change titles, descriptions, links, `featured`, or any other projects.

- [ ] **Step 2: Run the focused test**

Run: `node --experimental-default-type=module --test tests/project-images.test.js`

Expected: PASS for all six project records and assets.

- [ ] **Step 3: Commit project-data image mappings**

```powershell
git add data/projects.json
git commit -m "feat: show project-specific portfolio images"
```

## Task 4: Verify portfolio rendering and production readiness

**Files:**
- Verify: `data/projects.json`
- Verify: `public/assets/projects/*`
- Verify: `/work` and `/projects/<slug>` in the browser

- [ ] **Step 1: Run the complete test suite and build**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: Next.js production build completes successfully.

- [ ] **Step 2: Browser-check the work page and six detail pages**

With the local Next.js server running at `http://localhost:3000`, run:

```python
from playwright.sync_api import sync_playwright

projects = [
    ("aero-view", "3D ULPIN map interface showing Siripuram, Visakhapatnam"),
    ("glance-windows", "Official Glance face-unlock artwork for Windows"),
    ("devsocio", "DevSocio developer-community project homepage"),
    ("resume-pulse", "ResumePulse resume-builder project homepage"),
    ("agrishield-ai", "AgriShield AI rice-farming assistant homepage"),
    ("swiggy-lifeos", "Swiggy LifeOS lifestyle-assistant demo homepage"),
]

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))

    page.goto("http://localhost:3000/work", wait_until="networkidle")
    for slug, alt in projects:
        image = page.locator(f'.proj img[alt="{alt}"]')
        assert image.count() == 1, f"missing or duplicate work-card image for {slug}"
        assert image.evaluate("img => img.complete && img.naturalWidth > 0"), f"image failed to load for {slug}"

        page.goto(f"http://localhost:3000/projects/{slug}", wait_until="networkidle")
        detail_image = page.locator(f'.proj-detail img[alt="{alt}"]')
        assert detail_image.count() == 1, f"missing detail image for {slug}"
        assert detail_image.evaluate("img => img.complete && img.naturalWidth > 0"), f"detail image failed for {slug}"

    assert not errors, errors
    browser.close()
```

Expected: all six images load on both `/work` and their project-detail routes, and the browser reports no page errors.

- [ ] **Step 3: Check the diff and commit the verification-ready state**

Run: `git diff --check`

Expected: no whitespace errors.

```powershell
git status --short
```

Expected: only the planned project image files, project JSON, and test are included; leave pre-existing unrelated untracked files untouched.

- [ ] **Step 4: Push through the protected-main PR workflow**

Push the feature branch, open a pull request to `main`, and merge only after its required Vercel check passes. Do not force-push or include unrelated untracked files.
