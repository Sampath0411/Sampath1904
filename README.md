# Sampath Portfolio — Next.js

Full Next.js conversion of the original single-file portfolio, with a CMS-style admin panel.

Bundles a selection of [React Bits](https://reactbits.dev/) interactions (copied source, MIT) — Particles hero background, SplitText name, RotatingText roles, Magnetic CTAs, Spotlight project cards, Tilted service cards, Border-Glow + CountUp stats, ScrollReveal headings, TextLoop marquee, and site-wide GlowCursor / ClickSpark. Extra deps: `gsap`, `@gsap/react`, `motion`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
npm test                     # unit tests
```

## Pages

| Route | What |
|---|---|
| `/` | Home — hero, featured projects, skills, about, services, contact |
| `/work` | All projects |
| `/projects/[slug]` | Project detail template (one per project) |
| `/about` | About + services |
| `/skills` | Skills |
| `/contact` | Contact form + socials |
| `/admin` | Admin panel (password required) |

## Admin (`/admin`)

For local development only, the default password is `admin123`; production disables admin authentication unless both `ADMIN_PASSWORD` (at least 16 characters) and `AUTH_SECRET` (at least 32 random characters) are configured. Set unique values in Vercel; never deploy the development defaults.

- **Edit content** — every text, photo, link and section on the site (hero, SEO meta, skills groups, about + stats, services, contact, socials, footer)
- **Projects** — add / edit / delete projects, feature them on the home page, upload cover photos, set the detail-page copy
- **Messages** — contact-form submissions, with reply/delete

## Data & storage

- `data/site.json` — all editable site content
- `data/projects.json` — projects
- `data/messages.json` — contact messages (auto-created)
- `data/uploads/` — photos uploaded from the admin panel during local development
- `public/assets/` — original images

Local development is file-based. Pages are server-rendered on demand, so local admin edits go live immediately on refresh; Vercel production uses the configured Supabase database instead.

Local development uses the JSON files above. Vercel production requires Supabase because serverless local-disk writes are not durable. Production mutations fail closed until Supabase is configured rather than claiming a local write was saved.

### Supabase + Resend production setup

1. Create a Supabase project and open **SQL Editor**. Run `supabase/schema.sql` once.
2. In the project Settings, copy the Project URL and `service_role` key into your **local** `.env.local` as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Keep the service-role key server-only; never add `NEXT_PUBLIC_` to it.
3. Run `npm run db:seed` from the project root. It copies the checked-in site/project JSON into Supabase and does not import messages.
4. Create a Resend account, verify a sender domain, and configure `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL`. The sender must be verified by Resend. Contact messages still persist to the admin inbox if email notification is temporarily unavailable.
5. Add all required production variables in Vercel: `SITE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL`. Generate strong secrets rather than reusing website passwords.
6. Redeploy. Test `/admin` login, edit a harmless text field, upload an image, submit a test contact form, and confirm both the admin inbox and email notification.

The Supabase schema enables row-level security and grants data access only to the server-side service role; admin routes continue to require the signed session. Uploaded portfolio assets are public-read so they can display on the site, but browser upload/update/delete policies are not created. Contact rate limits use a hash of the requester IP, not the raw address.

The portfolio stores contact form name, email, message, and submission time so Sampath can reply. Messages remain until deleted in the admin inbox; the form also sends an email notification when Resend is configured. Update the privacy policy to match your actual retention practice and applicable law before collecting real inquiries.

## Search engines and Google Search Console

The production canonical origin is `https://sampath-dev.is-a.dev/`. Set `SITE_URL` in Vercel to that origin (no trailing slash); update it later if you attach a custom domain. `robots.txt` and `sitemap.xml` are generated from this origin.

To register the deployed site in Google Search Console:

1. Sign in at [Google Search Console](https://search.google.com/search-console/) and add a **URL-prefix** property for `https://sampath-dev.is-a.dev/`.
2. Choose the **HTML tag** verification method and copy the `content` value Google gives you. Do not paste the whole tag.
3. Add that value as the `GOOGLE_SITE_VERIFICATION` environment variable in Vercel for Production, then redeploy.
4. In Search Console, select **Verify**. If Google cannot see the tag, confirm the variable is set for Production and that the latest deploy is live.
5. In **Indexing → Sitemaps**, submit `https://sampath-dev.is-a.dev/sitemap.xml`.
6. Use **URL inspection** on the homepage and a project page, then request indexing if Google offers the option. Indexing is not guaranteed and may take time.

The Google verification token is intentionally not committed. Search Console ownership verification and sitemap submission require your Google account, so you must perform those final clicks. The sitemap includes public pages/projects only; `/admin` and `/api/` are disallowed by `robots.txt`.

Google does not use the legacy `meta keywords` field for ranking. Strong titles/descriptions, useful original project detail, fast mobile pages, accessible semantic content, and real links matter more; do not add invented client counts, ratings, awards, or performance claims.

## APIs

- `POST /api/login`, `POST /api/logout`
- `GET/PUT /api/content`
- `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/[id]`
- `POST /api/upload` (image, ≤8MB)
- `POST /api/contact`, `DELETE /api/messages`
