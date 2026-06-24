# Next.js + Tailwind CSS Boilerplate

A production-ready starter for building fast, accessible, well-ranked marketing websites with a
blog. Clone it, rebrand it, and ship to Vercel. Built to the conventions in
[`docs/ai-guidelines/`](docs/ai-guidelines/) so both people and AI assistants build it the same way.

## Stack

| Area       | Choice                                                              |
| ---------- | ------------------------------------------------------------------- |
| Framework  | **Next.js 16** (App Router, `src/` dir, Turbopack)                  |
| Language   | **TypeScript** (`strict`)                                           |
| React      | **19.2** with the **React Compiler**                                |
| Styling    | **Tailwind CSS v4** — CSS-first config, **no `tailwind.config.js`** |
| UI         | **Headless UI v2** + **Heroicons v2**                               |
| Email      | **Resend** (contact form via a Server Action)                       |
| Validation | **Zod** (env, forms, blog frontmatter)                              |
| Blog       | **MDX** (`next-mdx-remote`) with build-time **Shiki** highlighting  |
| Caching    | Next.js **Cache Components** (`'use cache'`)                        |
| Hosting    | **Vercel** (`@vercel/analytics` + `@vercel/speed-insights`)         |

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`, `format:check`.

## Environment variables

Set these in `.env.local` for local dev and in the Vercel dashboard per environment. Never commit
secrets — `.env.example` documents every variable.

| Variable               | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (metadata, sitemap, robots, RSS, canonicals) |
| `RESEND_API_KEY`       | Resend API key (server-only) for the contact form               |
| `RESEND_FROM`          | Verified sender address Resend sends from                       |
| `CONTACT_TO_EMAIL`     | Where contact submissions are delivered                         |

## What's included

- **Marketing pages** — home, about, contact, with a shared header (sticky, accessible mobile drawer)
  and footer.
- **Contact form** — Server Action + Zod validation + Resend, with accessible inline errors and a
  honeypot. See `src/app/contact/`.
- **MDX blog** — index, post pages (`generateStaticParams`, Article + Breadcrumb JSON-LD), RSS feed
  at `/feed.xml`. Posts live in `src/content/posts/*.mdx` with Zod-validated frontmatter.
- **SEO layer** — metadata templates + canonicals, `sitemap.ts`, `robots.ts`, static OG image,
  `Organization` JSON-LD, semantic landmarks, and a skip link.
- **Design system** — brand tokens in `src/app/globals.css`, shared primitives (`Button`,
  `Container`, `Section`, `SectionHeading`), and the `cn()` utility.

## Project structure

```
src/
  app/                 # routes (App Router)
    about/             # example marketing subpage
    contact/           # contact page, form component, Server Action
    blog/              # index + [slug] post pages
    feed.xml/          # RSS route handler
    layout.tsx page.tsx globals.css sitemap.ts robots.ts
    not-found.tsx error.tsx loading.tsx
  components/          # ui/ primitives, layout/ header+footer, cta-band, mdx-content
  content/posts/       # MDX blog posts
  lib/                 # utils (cn), site config, env (Zod), posts loader, jsonld
public/
  og-image.png         # static 1200x630 social sharing image
tailwind-plus-catalog/ # 657 Tailwind Plus blocks — reference to copy FROM (build-excluded)
docs/ai-guidelines/    # the four best-practices guides (read these before building)
```

## Production defaults this starter protects

- **Flat starter routes:** example pages live at `src/app/about` and `src/app/contact`. Avoid route
  groups such as `(marketing)` until a project has multiple route layouts that truly need them.
- **Static OG image:** social preview metadata points at `public/og-image.png`. Dynamic
  `opengraph-image.tsx` routes are useful for blogs/products, but must be production-tested because
  social scrapers only care whether the final image URL returns `200`.
- **Friendly form errors:** Server Actions preprocess missing `FormData` values before Zod validation
  so users never see raw messages like `Invalid input: expected string, received undefined`.
- **Consistent form dropdowns:** all dropdown fields should use
  `src/components/ui/select-field.tsx`, which removes native browser chevrons, adds the project
  chevron icon, and keeps focus/error styling consistent.
- **Central site config:** `src/lib/site.ts` owns canonical URLs, nav, footer links, contact details,
  and social links. Set `NEXT_PUBLIC_SITE_URL` before deploy so canonical, OG, sitemap, RSS and
  JSON-LD URLs are correct.
- **Asset hygiene:** convert large hero/banner PNGs to WebP or AVIF, keep `og-image.png` at 1200x630,
  and verify every first-viewport image has a sensible `sizes` value.

## The Tailwind Plus component catalogue

`tailwind-plus-catalog/` holds **657 prebuilt Tailwind Plus blocks** (marketing, application UI,
e-commerce). It's a **catalogue to copy from**, not a package to import. It is committed for
reference but excluded from:

- the **Tailwind build** (`@source not` in `globals.css`),
- **TypeScript** (`tsconfig.json` `exclude`),
- **ESLint** and **Prettier** (ignore lists).

This keeps the production CSS small (~10KB gzipped here). Browse it with
[`tailwind-plus-catalog/COMPONENT_INDEX.md`](tailwind-plus-catalog/COMPONENT_INDEX.md).

**Workflow to use a block** (full detail in
[`docs/ai-guidelines/tailwind-nextjs-best-practices.md`](docs/ai-guidelines/tailwind-nextjs-best-practices.md) §8):

1. Find the closest block in the catalogue.
2. Copy it into `src/` as a project component (kebab-case file, PascalCase export).
3. Convert to TypeScript; extract placeholder content into typed props or data.
4. **Rebrand**: replace `indigo-*` with `primary-*`, apply the project radius/shadow tokens and fonts.
5. Keep it a Server Component unless it needs interactivity, then add `'use client'` at the leaf.

## Guidelines (read before building)

These guides are the authority on how this project is built. They are written for both engineers and
AI assistants (see [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md)):

### Repeated card grids

Repeated cards use equal-height rows by default. Let the grid stretch its children; make each card
`flex h-full flex-col`, give its variable content area `flex-1`, and anchor the final action, icon row,
or metadata with `mt-auto` plus deliberate top padding. Repeated image stages need a stable height or
aspect ratio. Verify action alignment in every desktop/tablet row and allow natural card heights when
the layout stacks on mobile.

- [Next.js best practices](docs/ai-guidelines/nextjs-best-practices.md) — App Router idioms, caching, Server Actions, images.
- [SEO best practices](docs/ai-guidelines/nextjs-seo-best-practices.md) — metadata, structured data, rendering, Core Web Vitals.
- [Tailwind v4 best practices](docs/ai-guidelines/tailwind-nextjs-best-practices.md) — CSS-first config, tokens, the catalogue workflow.
- [UX/UI best practices](docs/ai-guidelines/ux-ui-best-practices.md) — layout, type, colour, components, page templates.
- [Production checklist](docs/production-checklist.md) — final deploy checks for metadata, forms, assets, and previews.
- [Asset pipeline](docs/asset-pipeline.md) — image conversion, OG image rules, banner crop checks.
- [Form validation](docs/form-validation.md) — Zod + Server Action patterns for friendly errors.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel. Every push builds a **Preview**; merging to `main` deploys to **Production**.
3. Set the environment variables above per environment in the Vercel dashboard.
4. Recommended: set the function region near your audience (e.g. `syd1`) and add your production
   domain (choose www or apex as canonical, 308-redirect the other).

After deploy, verify social previews with a fresh cache-busted URL such as
`https://example.com/?v=preview-1`. WhatsApp, Facebook and LinkedIn cache aggressively.

## Notes

- **Known advisory:** `npm audit` reports a moderate `postcss` advisory via a transitive dependency
  **pinned inside `next@16.2.9`**. The only `npm audit fix --force` resolution downgrades Next.js to
  v9 (not viable). The vector (XSS via PostCSS stringify of attacker-controlled CSS) does not apply
  to this statically-built site; it clears when Next.js bumps its bundled `postcss`. Tracked as an
  accepted risk — do not "fix" it by downgrading the framework.
- All code here is a starting point and should be reviewed and tested before production use.
