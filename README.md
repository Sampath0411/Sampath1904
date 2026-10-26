# Sampath Portfolio — Next.js

Full Next.js conversion of the original single-file portfolio, with a CMS-style admin panel.

Bundles a selection of [React Bits](https://reactbits.dev/) interactions (copied source, MIT) — Particles hero background, SplitText name, RotatingText roles, Magnetic CTAs, Spotlight project cards, Tilted service cards, Border-Glow + CountUp stats, ScrollReveal headings, TextLoop marquee, and site-wide GlowCursor / ClickSpark. Extra deps: `gsap`, `@gsap/react`, `motion`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
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

Default password: `admin123` — change it via `ADMIN_PASSWORD` in `.env.local` (see `.env.example`).

- **Edit content** — every text, photo, link and section on the site (hero, SEO meta, skills groups, about + stats, services, contact, socials, footer)
- **Projects** — add / edit / delete projects, feature them on the home page, upload cover photos, set the detail-page copy
- **Messages** — contact-form submissions, with reply/delete

## Data & storage

- `data/site.json` — all editable site content
- `data/projects.json` — projects
- `data/messages.json` — contact messages (auto-created)
- `public/uploads/` — photos uploaded from the admin panel
- `public/assets/` — original images

Everything is file-based (no database). Pages are server-rendered on demand, so admin edits go live immediately on refresh.

## APIs

- `POST /api/login`, `POST /api/logout`
- `GET/PUT /api/content`
- `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/[id]`
- `POST /api/upload` (image, ≤8MB)
- `POST /api/contact`, `DELETE /api/messages`
