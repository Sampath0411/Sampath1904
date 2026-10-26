# Vercel Backend Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio admin CMS, contact inbox, and image uploads durable and operational on Vercel using Supabase and Resend.

**Architecture:** Replace synchronous local-JSON reads/writes in runtime paths with an async data adapter backed by Supabase Postgres and Supabase Storage. Keep checked-in JSON as seed/fallback content for local preview, migrate the existing content into documented SQL seed scripts, and send visitor contact submissions through Resend while storing them in the database. Keep secrets in environment variables and preserve authentication checks on all admin mutations.

**Tech Stack:** Next.js 16 Route Handlers and Server Components, Supabase Postgres/Storage REST APIs or official client, Resend API, Node.js built-in test runner.

---

## File map

- `lib/data.js` and new `lib/supabase.js`: async persistence boundary and local seed fallback.
- `lib/auth-config.js` and `lib/auth.js`: fail-closed production admin credential policy and signed session verification.
- `app/(_site)/**`, `app/layout.js`, `app/sitemap.js`, and `app/api/**`: await data access and preserve public/admin boundaries.
- `app/api/contact/route.js`: validation, durable message storage, and Resend delivery.
- `app/api/upload/route.js`, `app/uploads/[name]/route.js`: authenticated Supabase Storage upload/read flow.
- `supabase/schema.sql` and `supabase/seed.mjs`: database schema and exact initial portfolio content migrated from the checked-in JSON fixtures.
- `.env.example`, `README.md`, `package.json`, and `tests/**`: setup documentation, client dependency, and regression tests.

## Task 1: Define adapter contracts and environment validation

**Files:** Create `tests/data-adapter.test.js`; modify `package.json`; create `lib/supabase.js` and environment documentation.

- [x] Write tests for missing configuration selecting the local JSON adapter, configured mode selecting the remote adapter, and malformed environment values failing with a safe actionable error.
- [x] Run `node --test tests/data-adapter.test.js` and confirm the missing adapter behavior fails.
- [x] Implement the minimal adapter selector and environment validation without logging secret values.
- [x] Run the adapter tests and confirm they pass.

## Task 2: Create persistent schema and seed migration

**Files:** Create `supabase/schema.sql`, `supabase/seed.mjs`, `lib/portfolio-seed.js`, and `tests/seed-data.test.js`.

- [x] Test that current site/project JSON can be transformed to records with stable IDs/slugs and all existing fields retained.
- [x] Confirm tests fail before the migration/seed fixture exists.
- [x] Create tables for site content, projects, and contact messages with primary keys, unique project slugs, timestamps, indexes, restrictive RLS, and an atomic project-replacement RPC. Use a public-read storage bucket with writes only through authenticated server routes.
- [x] Create a seed command that reads exact `data/site.json` and `data/projects.json` content and writes it via Supabase REST; do not seed submitted messages or invent portfolio results.
- [x] Run seed-shape tests and review SQL for consistent fields and constraints. Live Supabase migration remains owner-gated.

## Task 3: Convert content reads and admin writes to async persistence

**Files:** Modify `lib/data.js`, `app/layout.js`, `app/sitemap.js`, public pages in `app/(_site)/**`, and `app/api/content/route.js` plus project API routes.

- [x] Add tests for reading seeded content and persisting authorized updates through the adapter boundary.
- [x] Confirm tests fail for async operations before conversion.
- [x] Convert server-side callers to await data methods, preserving the local JSON path for development and keeping `GET` APIs read-only.
- [x] Ensure all content/project mutations still require a valid admin session and reject malformed payloads.
- [x] Run tests and production build; inspect the affected route tree for missed un-awaited calls.

## Task 4: Deliver contact form submissions

**Files:** Modify `app/api/contact/route.js`, `components/sections/ContactSection.js`; create `tests/contact-route.test.js`.

- [x] Test missing/invalid/oversized fields, honeypot spam field handling, successful durable persistence, Resend delivery failure behavior, and non-PII rate-limit identifiers.
- [x] Run tests and confirm failures against the current local-only handler.
- [x] Implement an atomic database-backed rate limit with hashed IP identifiers, persist the message, send a plain-text email via Resend, and avoid returning private contact routing data to the public caller.
- [x] Show a clear success state after durable storage; if email notification alone fails, keep the stored message and log only a safe non-PII status so visitors do not accidentally submit duplicates.
- [x] Run service tests, production build, and browser smoke; live email/database tests remain owner-gated.

## Task 5: Persist admin uploads in Supabase Storage

**Files:** Modify `app/api/upload/route.js`, `app/uploads/[name]/route.js`, `lib/data.js`, and create `tests/upload-route.test.js`.

- [x] Test server-only storage credentials, accepted image types, size limits, generated object names, and storage failure behavior.
- [x] Verify tests fail against local-disk-only uploads.
- [x] Upload validated images to the configured bucket and return durable URLs; keep SVG disabled unless sanitizer/serving policy is implemented. Preserve admin-only mutation and safe public asset reads.
- [x] Run storage-service tests and production build; live upload remains owner-gated.

## Task 6: Deployment setup and migration handoff

**Files:** Modify `.env.example`, `README.md`, `supabase/schema.sql`, and `supabase/seed.mjs` as needed.

- [x] Document Supabase project creation, applying schema/seed, Storage bucket/policies, Resend sender/domain requirements, and Vercel environment keys by name only.
- [x] State that the owner must provide project credentials, configure a verified Resend sender, and apply the migration before production content writes are enabled.
- [x] Verify no real credentials or message data are committed; run full tests and `npm run build`.

## Acceptance checklist

- Production content, edits, messages, and uploaded assets persist across Vercel invocations/deployments.
- Production admin login fails closed unless explicitly configured with strong password/session secrets.
- Admin mutations/uploads require a valid authenticated session; visitor-facing APIs do not disclose secrets or private routing details.
- Contact submissions have validation, spam/rate protection, durable storage, and configured email delivery.
- Local development remains possible using checked-in JSON without requiring service credentials.
- Schema/seed and setup instructions are provided; deployment remains explicitly gated on real owner-created credentials.
