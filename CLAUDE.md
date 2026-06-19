# CLAUDE.md — Project guidance for AI assistants

This is a **Next.js 16 + Tailwind CSS v4** boilerplate for marketing websites with a blog, deployed
to Vercel. Before writing code, **read the guides in [`docs/ai-guidelines/`](docs/ai-guidelines/)** —
they are the authority for this project and the kind of sites built from it:

- `nextjs-best-practices.md` — App Router idioms, caching, Server Actions, images, navigation.
- `nextjs-seo-best-practices.md` — metadata, structured data, rendering strategy, Core Web Vitals.
- `tailwind-nextjs-best-practices.md` — Tailwind v4 CSS-first config, design tokens, the catalogue workflow.
- `ux-ui-best-practices.md` — layout, typography, colour, components, page templates.

## Hard rules (do not violate)

- **App Router only.** No `pages/` directory. Routes live in `src/app/`.
- **Tailwind v4 is CSS-first.** There is **no `tailwind.config.js`** and there must never be one.
  Design tokens live in `src/app/globals.css` under `@theme`. No `content` array, no autoprefixer.
  Use v4 class names (e.g. `bg-linear-to-r`, `ring-3`, `shadow-xs`, `outline-hidden`), not v3 ones.
- **Server Components by default.** Add `'use client'` only at interactive leaves (state, effects,
  handlers, Headless UI). A page or layout is never a client component.
- **Forms use Server Actions**, not `useState` + `fetch` to a hand-rolled API route. Validate input
  with **Zod** on the server. See `src/app/(marketing)/contact/`.
- **Data fetching** happens in async Server Components. Cache with `'use cache'` + `cacheTag`; never
  fetch initial page content in `useEffect`.
- **Use the framework primitives:** `next/image` (not `<img>`), `next/link` (not `<a>` for internal
  links), `next/font`, the Metadata API (not hand-rolled `<head>`).
- **Secrets** come from validated env (`src/lib/env.ts` via `getEnv()`), never hardcoded, never in
  `NEXT_PUBLIC_*`.
- **Accessibility & SEO are part of done:** one `<h1>` per page, semantic landmarks, labelled inputs,
  visible focus, descriptive alt text, canonical URLs.

## Using the Tailwind Plus catalogue

`tailwind-plus-catalog/` contains **657 reference blocks** (`.jsx`, `indigo`-themed, exporting
`Example`). It is **copy-from material**, excluded from the build (Tailwind `@source not`, tsconfig,
eslint, prettier). **Never import from it.** To use a block:

1. Find it via `tailwind-plus-catalog/COMPONENT_INDEX.md`.
2. Copy into `src/` as a TypeScript component (kebab-case file, PascalCase export).
3. Retoken: `indigo-*` → `primary-*`; apply the project's radius/shadow tokens and `font-display`.
4. Extract placeholder data into typed props.
5. Keep it server-side unless it needs interactivity; then `'use client'` at the leaf.

After copying blocks, audit for leakage: `grep -rn "indigo" src/` must return nothing.

## Conventions in this repo

- Brand colours & shape tokens: `src/app/globals.css`. Site details & navigation: `src/lib/site.ts`.
- Shared primitives: `src/components/ui/` (`Button`, `Container`, `Section`, `SectionHeading`). Reuse
  them instead of re-pasting utility strings. Merge classes with `cn()` from `src/lib/utils.ts`.
- **Repeated card grids use equal-height rows by default.** Let the grid stretch its children; make
  each card `flex h-full flex-col`, let the variable content area grow with `flex-1`, and anchor the
  final action, icon row, or metadata with `mt-auto` plus deliberate top padding. Give repeated media
  stages a stable height or aspect ratio. Verify action alignment in desktop/tablet rows and allow
  natural card heights when stacked on mobile.
- Blog posts: `src/content/posts/*.mdx` with Zod-validated frontmatter (`src/lib/posts.ts`).
- Verify before declaring done: `npm run typecheck`, `npm run lint`, `npm run build`.
