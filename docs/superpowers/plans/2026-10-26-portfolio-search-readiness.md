# Portfolio Search Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the deployed portfolio accurately discoverable and shareable at `https://sampathportfolio-ten.vercel.app/`, and improve its presentation without sacrificing speed, accessibility, or truthful content.

**Architecture:** Keep Next.js App Router metadata and sitemap conventions. Use one explicit production base URL, environment-provided Google verification, page-specific metadata, and factual Person/WebSite structured data. Avoid LocalBusiness/ProfessionalService rich-result markup because the portfolio does not publish the business address/details Google expects. Preserve the existing dark/lime visual identity; use React Bits effects only in the hero and project presentation, with reduced-motion behavior and performance safeguards.

**Tech Stack:** Next.js 16 App Router, React 19, existing React Bits components, Node.js built-in test runner, Google Search Console.

---

## File map

- `lib/seo.js`: canonical production origin and safe URL helpers.
- `app/layout.js`: global metadata, verification tag, structured data.
- `app/sitemap.js`, `app/robots.js`: crawlable production URLs and rules.
- `app/(_site)/projects/[slug]/page.js`: project-level metadata and canonical URLs.
- `components/sections/Hero.js`, `app/globals.css`: approved combined visual direction and reduced-motion/performance behavior.
- `package.json`: repeatable tests using Node's built-in test runner.
- `.env.example` and `README.md`: deployment and Search Console instructions, no secrets.

## Task 1: Lock down SEO URL construction with tests

**Files:** Create `tests/seo.test.js`; modify `package.json`; modify `lib/seo.js`.

- [x] Write Node tests that assert `SITE_URL` wins over content metadata, the configured canonical origin is returned without a trailing slash, and malformed/missing values never produce `yourdomain.com`.
- [x] Run `node --test tests/seo.test.js` and confirm the tests fail against the current implementation.
- [x] Implement URL normalization and an explicit production fallback of `https://sampathportfolio-ten.vercel.app`; preserve a documented environment override for a future custom domain.
- [x] Run `node --test tests/seo.test.js` and confirm all URL tests pass.

## Task 2: Fix global metadata, sitemap, and robots output

**Files:** Modify `app/layout.js`, `app/sitemap.js`, `app/robots.js`; create/update `.env.example` and `README.md`.

- [x] Add assertions for the canonical host, sitemap absolute URLs, `/admin` and `/api` exclusion, and the optional Google verification value.
- [x] Run the relevant tests and confirm the new assertions fail before implementation.
- [x] Use Next.js 16 metadata fields; set metadataBase, canonical, Open Graph, Twitter summary card, and `verification.google` from an environment variable. Ensure the Vercel URL is the default canonical and sitemap origin.
- [x] Generate sitemap entries only for public routes and published projects; do not emit placeholder hosts or private/admin routes.
- [x] Document the Vercel environment variables and the Search Console URL-prefix HTML-tag flow: add property, copy verification value into `GOOGLE_SITE_VERIFICATION`, deploy, verify, submit `/sitemap.xml`, inspect representative URLs.
- [x] Run tests and fetch local `/`, `/robots.txt`, and `/sitemap.xml`; verify all emitted origins match the Vercel deployment URL.

## Task 3: Improve project share/search metadata and truthful structured data

**Files:** Modify `app/(_site)/projects/[slug]/page.js`, `app/layout.js`, and focused SEO tests.

- [x] Add tests for project title, description length/fallback, canonical path, and absolute project social image URLs.
- [x] Verify those assertions fail against current metadata.
- [x] Implement per-project canonical and complete Open Graph/Twitter metadata with image alt where supported by the installed Next version. Keep absent or unverified content out of metadata.
- [x] Add factual Person and WebSite structured data; use the live canonical and HTTP(S) social profiles only. Avoid unsupported LocalBusiness/ProfessionalService markup without published address details. Do not manufacture ratings, client counts, awards, or outcomes.
- [x] Run metadata tests and inspect server-rendered `<head>` output for homepage and project pages.

## Task 4: Apply the approved hybrid visual direction accessibly

**Files:** Modify `components/sections/Hero.js`, relevant React Bits components only if required, and `app/globals.css`.

- [x] Add a behavior test for reduced-motion preferences to the existing test setup (or a focused browser test if motion is only observable in-browser); verify it detects the current always-animated path.
- [x] Preserve layout, colors, portrait, and both equally prominent service paths. Keep one ambient particle effect and one clear selected-work focal point; do not add more continuous effects.
- [x] Respect `prefers-reduced-motion`, avoid unnecessary particle work on small/touch devices, preserve server-rendered dark background, and keep all links keyboard-visible and labeled.
- [x] Run unit tests, production build, and a desktop/mobile browser check including a reduced-motion browser context; check console errors and verify first content stays visible.

## Task 5: Search Console handoff and release checklist

**Files:** Update `README.md` only.

- [x] Include the exact live property URL (`https://sampathportfolio-ten.vercel.app/`), verification procedure, sitemap URL, and expected confirmation checks.
- [x] Clearly note Search Console indexing/verification requires the user to sign in to Google and click the verification/submission controls; implementation cannot perform those account actions.
- [x] Validate instructions against local production `robots.txt` and sitemap responses.

## Acceptance checklist

- Canonical tags and all sitemap locations use the selected live host and never the placeholder domain.
- Search Console verification is configurable without committing a token or other secret.
- Public pages have meaningful metadata; private and API routes remain excluded.
- Structured data contains only factual identity/services and existing social links.
- The approved mixed creative/developer positioning is maintained, and reduced-motion behavior is verified.
- Build and tests pass; final Search Console verification and sitemap submission are clearly handed off to the owner.
