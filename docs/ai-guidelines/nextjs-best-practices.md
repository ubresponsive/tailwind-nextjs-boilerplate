# Next.js Best Practices for Building a Multipage Website with Blog

Implementation guide for an AI agent building a production website with Next.js. Follow every directive unless a project constraint explicitly prevents it. Current as at June 2026, targeting Next.js 16 (App Router). Pair this document with `nextjs-seo-best-practices.md` for SEO detail.

---

## 1. Project Baseline

| Item      | Standard                                                                       |
| --------- | ------------------------------------------------------------------------------ |
| Framework | Next.js 16.x, App Router only. Never use the Pages Router (`pages/` directory) |
| Language  | TypeScript, `strict: true`                                                     |
| React     | 19.2 (ships with Next.js 16), React Compiler enabled                           |
| Bundler   | Turbopack (default in v16, do not opt back to webpack)                         |
| Styling   | Tailwind CSS v4                                                                |
| Linting   | ESLint with `eslint-config-next`                                               |
| Hosting   | Vercel                                                                         |

Scaffold with: `npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir`

Enable Cache Components and React Compiler:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [50, 75, 90], // required allowlist in v16
    remotePatterns: [
      { protocol: "https", hostname: "cdn.example.com", pathname: "/**" },
    ],
  },
};
export default nextConfig;
```

---

## 2. Golden Rule: Next.js Idioms over React Habits

The single most common failure when agents build Next.js sites is reaching for generic React patterns. Before writing any hook, check this table. If a Next.js mechanism exists, it is mandatory.

| React habit (do NOT use)                             | Next.js way (use this)                                                                   | Why                                                           |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `useEffect` + `fetch` + `useState` for page data     | `async` Server Component with `await fetch()`                                            | Server rendered, cacheable, no loading spinner, SEO safe      |
| `useState` + `onSubmit` handler posting JSON         | Server Actions with `useActionState`                                                     | Progressive enhancement, no API boilerplate, works without JS |
| `<img>` tag                                          | `next/image` `<Image>`                                                                   | Optimisation, AVIF/WebP, lazy loading, zero CLS               |
| `<a href>` for internal links                        | `next/link` `<Link>`                                                                     | Client navigation, prefetching, scroll handling               |
| `react-router` or manual routing                     | File based App Router (`app/` directory)                                                 | Routing is the framework                                      |
| `react-helmet` or manual `<head>` edits              | Metadata API (`export const metadata`, `generateMetadata`)                               | Streamed, deduplicated, type safe                             |
| `useRouter` from `next/router`                       | `useRouter`, `usePathname`, `useSearchParams` from `next/navigation`                     | `next/router` is the legacy Pages Router API                  |
| Manual `React.lazy` code splitting                   | Route based splitting (automatic) plus `next/dynamic` for heavy client widgets           | Built in per route                                            |
| Google Fonts `<link>` tag or `@import`               | `next/font`                                                                              | Self hosted, zero layout shift, no render blocking            |
| Raw `<script>` tags                                  | `next/script` with a loading strategy                                                    | Controls execution timing, protects CWV                       |
| `useMemo`/`useCallback` sprinkled everywhere         | Rely on React Compiler                                                                   | Automatic memoisation in v16; manual memo is noise            |
| Client side redirect via `useEffect` + `router.push` | `redirect()` / `permanentRedirect()` in Server Components, or `next.config.ts` redirects | Server side, correct status codes                             |
| Global fetch caching libraries for server data       | `'use cache'`, `cacheLife`, `cacheTag`, `revalidateTag`                                  | Framework native caching                                      |
| Context provider for server data                     | Pass props from Server Components; compose layouts                                       | Context forces client rendering                               |
| `window` access at module top level                  | Guard inside `useEffect` or Client Component event handlers                              | Server rendering has no `window`                              |

SWR or TanStack Query are permitted only for genuinely client side, frequently refetched state (live polling, optimistic UI), never for initial page content.

---

## 3. Project Structure

```
src/
  app/
    layout.tsx              # root layout: html, body, fonts, metadata defaults
    page.tsx                # home
    about/page.tsx
    contact/page.tsx
    blog/
      page.tsx              # blog index
      [slug]/page.tsx       # blog post
    api/                    # route handlers only where Server Actions do not fit
      newsletter/route.ts
    sitemap.ts
    robots.ts
    not-found.tsx
    error.tsx
    loading.tsx
  components/
    ui/                     # buttons, cards, inputs (mostly server safe)
    layout/                 # header, footer, nav
  lib/                      # data access, utilities, content loading
  content/                  # MDX or markdown blog posts (if file based)
proxy.ts                    # request interception (replaces middleware.ts in v16)
```

Rules:

- Colocate route specific components inside the route folder; share generic ones from `components/`.
- Keep simple marketing routes flat (`app/about`, `app/contact`). Use route groups such as
  `(marketing)` or `(blog)` only when a project genuinely needs multiple shared layouts.
- One root layout with `<html lang="en-AU">` and `<body>`; nested layouts must not repeat them.
- Add `loading.tsx` (instant loading UI via Suspense) and `error.tsx` (client error boundary) to every data bearing route segment.
- `middleware.ts` is deprecated. Use `proxy.ts` exporting a `proxy` function for redirects, rewrites, auth gating at the network boundary. Keep it thin; never fetch heavy data there.

---

## 4. Server and Client Components

Server Components are the default and should remain the overwhelming majority.

- Add `'use client'` only when the component needs state, effects, event handlers, browser APIs, or hook based libraries.
- Push `'use client'` to the leaves. A page is never a Client Component; an interactive button or a mobile nav toggle is.
- Pass Server Components into Client Components as `children` or props to avoid converting whole subtrees to client.
- Never import a Server Component into a Client Component module.
- Mark server only data modules with `import 'server-only'` so secrets can never leak into the client bundle.
- Client Components still server render their initial HTML. Do not gate their output behind `useEffect` mounted flags unless genuinely required, as that blanks content for crawlers.

Decision test before every component: "Does this need interactivity in the browser?" If no, it is a Server Component and must not contain hooks.

---

## 5. Data Fetching

- Fetch in Server Components with `async/await`. Fetch where the data is used; React deduplicates identical requests within a render.
- Parallelise independent requests with `Promise.all`; avoid sequential await waterfalls.
- `params` and `searchParams` are async in v16: `const { slug } = await params`.
- Use `generateStaticParams` for the blog so all posts prebuild:

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <article>...</article>;
}
```

- Call `notFound()` for missing content so the route returns a real 404.
- Wrap slow, non critical sections in `<Suspense fallback={...}>` to stream the shell immediately.

---

## 6. Caching (Cache Components Model)

Next.js 16 replaces implicit caching with an explicit model. Nothing is cached unless marked. The agent must apply caching deliberately:

```tsx
// Cache a data function
export async function getAllPosts() {
  "use cache";
  cacheLife("hours"); // profiles: seconds, minutes, hours, days, weeks, max
  cacheTag("posts");
  return db.post.findMany();
}
```

```ts
// Invalidate after a mutation (in a Server Action)
import { revalidateTag, updateTag } from "next/cache";

revalidateTag("posts"); // background revalidation
updateTag("posts"); // immediate refresh within the same request
```

| Content                          | Strategy                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| Marketing pages, blog posts      | Static via `generateStaticParams`; `'use cache'` with `cacheLife('days')` on content loaders |
| Blog index, listings             | `'use cache'` + `cacheTag('posts')`, invalidate on publish                                   |
| Per request or personalised data | No directive; runs dynamically at request time                                               |
| Expensive shared computations    | `'use cache'` at function level                                                              |

Rules:

- Tag every cached read that a mutation can affect, and revalidate that tag in the mutating Server Action.
- Do not use `export const revalidate` segment config together with Cache Components; prefer `cacheLife`.
- Never cache functions that read `cookies()`, `headers()`, or per user data.

---

## 7. API Routing and Server Functions

Prefer Server Actions for mutations triggered by your own UI. Use Route Handlers only when an HTTP endpoint must exist (webhooks, third party callbacks, public JSON APIs, RSS feeds).

```ts
// app/api/newsletter/route.ts (Route Handler, only when an endpoint is required)
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  // validate, persist
  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- Route Handlers live at `app/**/route.ts` and export HTTP verb functions (`GET`, `POST`).
- A folder cannot contain both `route.ts` and `page.tsx`.
- Validate all input with Zod at the boundary. Never trust the client.
- Return correct status codes and set `Cache-Control` headers on public `GET` endpoints.
- Do not create an API route purely for your own form or button to call. That is the Server Action use case.

---

## 8. Forms (Server Actions, Not useState)

This is the highest value correction to default agent behaviour. Build forms with Server Actions:

```tsx
// app/contact/actions.ts
"use server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message is too short"),
});

export async function submitContact(prevState: FormState, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors };
  }
  await sendEmail(parsed.data);
  return { status: "success" };
}
```

```tsx
// app/contact/contact-form.tsx
"use client";
import { useActionState } from "react";
import { submitContact } from "./actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, {
    status: "idle",
  });
  return (
    <form action={formAction} noValidate>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        aria-invalid={!!state.errors?.email}
        aria-describedby="email-error"
      />
      {state.errors?.email && (
        <p id="email-error" role="alert">
          {state.errors.email}
        </p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? "Sending" : "Send"}
      </button>
    </form>
  );
}
```

Rules:

- Use `<form action={serverAction}>`, `useActionState` for state and errors, `useFormStatus` in shared submit buttons.
- Validate with the same Zod schema on the server always; client validation is a convenience only.
- Use `useOptimistic` for instant feedback on likes, comments, and similar mutations.
- After a successful mutation, call `revalidateTag`/`updateTag` or `redirect()` inside the action.
- Semantic markup is mandatory: `<label htmlFor>`, correct `type`, `autoComplete`, error text linked via `aria-describedby`.
- Never serialise form state into JSON and POST it to a hand rolled API route with `fetch` in an `onSubmit` handler.

---

## 9. Images (next/image)

Per the current Image API (v16):

```tsx
import Image from 'next/image'
import hero from '@/public/hero.webp'

// Hero / LCP image: static import gives automatic width, height, blur placeholder
<Image src={hero} alt="Builders reviewing timber order on a tablet"
  preload placeholder="blur" sizes="100vw" className="h-auto w-full" />

// Card image in a responsive grid
<Image src={post.cover} alt={post.coverAlt} width={800} height={450}
  sizes="(max-width: 768px) 100vw, 33vw" className="h-auto w-full rounded-lg" />

// Unknown dimensions: fill inside a relatively positioned, sized container
<div className="relative aspect-video">
  <Image src={url} alt="..." fill sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover" />
</div>
```

| Rule                | Detail                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Always `next/image` | Never raw `<img>` for content images                                                                                                    |
| `alt` required      | Descriptive; empty string `alt=""` only for decorative images                                                                           |
| LCP image           | Use `preload` (v16; the old `priority` prop is deprecated). One per page. All other images keep default lazy loading                    |
| `sizes`             | Mandatory whenever `fill` is used or CSS makes the image responsive; without it the browser assumes 100vw and downloads oversized files |
| Static imports      | Prefer for local images: automatic dimensions plus `placeholder="blur"`                                                                 |
| Remote images       | Must be allowlisted in `images.remotePatterns` with the tightest possible hostname and pathname                                         |
| SVG logos and icons | Serve as `unoptimized` or inline components; do not enable `dangerouslyAllowSVG` unless required, and then set the recommended CSP      |
| Aspect ratio        | When CSS sets a custom width, also set `height: 'auto'` (or Tailwind `h-auto`) to avoid distortion                                      |

---

## 10. Links, Navigation and Scrolling

- All internal navigation uses `<Link href>`. External links use `<a>` with `rel="noopener"` and, where appropriate, `target="_blank"`.
- Prefetching is automatic for `<Link>` in the viewport; disable with `prefetch={false}` only on huge link lists (footers with hundreds of links).
- Programmatic navigation only inside Client Components via `useRouter` from `next/navigation` (`router.push`, `router.replace`, `router.refresh`).
- Read the current path with `usePathname` and query strings with `useSearchParams` (wrap consumers of `useSearchParams` in `<Suspense>`).
- Scrolling behaviour:
  - `<Link>` scrolls to top on navigation by default and preserves position on back/forward. Keep this default; pass `scroll={false}` only for in place updates such as filter changes.
  - Anchor links to page sections use `<Link href="/pricing#faq">`; give sections stable `id` attributes and `scroll-mt-20` (Tailwind) to offset a sticky header.
  - Apply `scroll-smooth` on `<html>` for anchor scrolling, gated by `motion-safe:` so reduced motion preferences are respected.
  - Build infinite scroll on the blog index only as progressive enhancement over real paginated URLs (`/blog?page=2`) so every post remains crawlable. Provide visible pagination links.
- Active nav state: derive from `usePathname` in a small Client Component, not state synchronisation effects.

---

## 11. Fonts, CSS and Tailwind

- Load fonts exclusively with `next/font`:

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })

<html lang="en-AU" className={inter.variable}>
```

- Tailwind v4 uses CSS first configuration. Define design tokens in `globals.css` with `@theme`; there is no `tailwind.config.js` by default:

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-sans);
  --color-primary: #cd442c;
  --color-secondary: #006ca7;
}
```

- Styling order of preference: Tailwind utilities, then CSS Modules for genuinely complex component styles, then global CSS only for resets and tokens.
- Never use runtime CSS in JS libraries (styled-components, emotion) in the App Router; they force client rendering and slow streaming.
- Keep class lists readable; extract repeated patterns into components, not `@apply` heavy stylesheets.
- Respect user preferences: `motion-safe:`/`motion-reduce:` variants for animation, `dark:` only if a dark theme is in scope.

---

## 12. SEO Essentials

Full detail lives in `nextjs-seo-best-practices.md`. Non negotiables while building:

- Root `metadata` with title template, default description, and `metadataBase`; `generateMetadata` with unique title, description, canonical, and Open Graph data on every dynamic route.
- `app/sitemap.ts` and `app/robots.ts` file conventions.
- One `<h1>` per page, correct h2/h3 nesting, semantic landmarks.
- JSON-LD: `Organization` site wide, `Article` plus `BreadcrumbList` on blog posts.
- A static `public/og-image.png` for the default site preview. Use dynamic `opengraph-image.tsx`
  routes only for content types that need per-page images, and verify the generated image URL returns
  `200` in production.
- All indexable content present in server rendered HTML.

---

## 13. Blog Implementation Pattern

- Content source: MDX files in `content/posts/` with frontmatter (title, description, date, updated, author, tags, cover, coverAlt). Use `@next/mdx` or a content layer library; parse frontmatter with a schema so malformed posts fail the build.
- Routes: `/blog` index with pagination, `/blog/[slug]` posts, optional `/blog/tag/[tag]`.
- Prebuild every post with `generateStaticParams`; cache content loaders with `'use cache'` and `cacheTag('posts')`.
- Each post renders: h1 title, author with link to bio, visible published and updated dates, cover image (`preload` on the post page), body, related posts, breadcrumb.
- Generate an RSS feed via a Route Handler at `app/feed.xml/route.ts` with an appropriate `Cache-Control` header.
- Reading experience: max width around 65 to 75 characters (`max-w-prose`), generous line height, code blocks with syntax highlighting rendered at build time (e.g. Shiki), not client side highlighters.
- Headings within posts get stable ids for anchor links; optionally render a table of contents from the MDX AST.

---

## 14. Performance

- Stream with `loading.tsx` and targeted `<Suspense>` boundaries so the shell paints immediately.
- React Compiler is enabled: do not hand write `useMemo`, `useCallback`, `React.memo` unless profiling proves a need.
- Heavy client only widgets (maps, charts, video players) load via `next/dynamic` with `ssr: false` and a sized placeholder to prevent CLS.
- Third party scripts via `next/script`: analytics with `strategy="afterInteractive"`, chat widgets and similar with `lazyOnload`. Nothing render blocking.
- Keep client bundles lean: audit with `@next/bundle-analyzer`; avoid importing large libraries into Client Components; prefer server side data shaping so the client receives final props.
- Targets: Lighthouse 90+ across Performance, Accessibility, Best Practices, SEO; LCP under 2.5s, INP under 200ms, CLS under 0.1.

---

## 15. Accessibility

- Semantic HTML first: `<header>`, `<nav aria-label="Main">`, one `<main>`, `<footer>`, `<article>` for posts, real `<button>` and `<a>` elements. Never click handlers on divs.
- Skip link as the first focusable element targeting `#main-content`.
- Visible focus styles on all interactive elements (`focus-visible:` utilities); never remove outlines without replacement.
- Colour contrast 4.5:1 minimum for text; verify brand colours on their actual backgrounds.
- Mobile nav, accordions, and modals: manage focus, support Escape, use `aria-expanded`, `aria-controls`, and trap focus in modals (or use the native `<dialog>` element).
- Announce async results (form success, errors) with `role="status"` or `role="alert"`.
- `useEffect` is legitimate here: syncing focus, listeners, and body scroll locks for client widgets. The prohibition is on using it for data fetching and derived state.
- Test keyboard only and with axe in CI.

---

## 16. ESLint and TypeScript

- Use the Next.js ESLint preset; do not disable `@next/next` rules (they catch `<img>`, `<a>` misuse, missing `alt`, font issues).
- Add `eslint-plugin-jsx-a11y` (included via `eslint-config-next`) and treat warnings as errors in CI.
- `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` must remain false.
- Type route params as `Promise<{ slug: string }>` per v16 async APIs.
- No `any` in lib and action code; model content frontmatter and form payloads with Zod inferred types.

---

## 17. Environment Variables

| Rule                  | Detail                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Server secrets        | Plain names (`DATABASE_URL`, `RESEND_API_KEY`), read only in server code                                               |
| Client exposed values | Must be prefixed `NEXT_PUBLIC_` and are baked in at build time; never put secrets here                                 |
| Local development     | `.env.local`, which is gitignored. Commit a `.env.example` documenting every variable                                  |
| Validation            | Validate `process.env` at startup with a Zod schema in `lib/env.ts`; import that, never raw `process.env`, in app code |
| Leak protection       | Add `import 'server-only'` to modules reading secrets                                                                  |

---

## 18. Turbopack

- Turbopack is the default bundler and dev server in v16. Do not add webpack specific configuration or webpack only loaders.
- `next dev` and `next build` need no flags. Only fall back with `--webpack` if a required loader has no Turbopack equivalent, and document why.
- Enable filesystem caching for faster cold starts on large projects when stable in the installed minor version.
- Configure any loader needs under the `turbopack` key in `next.config.ts`, not `webpack()` callbacks.

---

## 19. Deployment with Vercel

- Connect the Git repository; every push builds a Preview Deployment, merges to main deploy to Production. Do not hand roll CI deploy scripts.
- Set environment variables per environment (Development, Preview, Production) in Vercel project settings; never commit them.
- Functions: pages, Server Actions, and Route Handlers deploy as Vercel Functions automatically. Default Node.js runtime is correct; only use `export const runtime = 'edge'` for latency critical, dependency light handlers.
- Set the function region close to the primary audience and data store (Sydney `syd1` for an Australian audience).
- Static pages and cached output serve from the CDN; ISR and `'use cache'` revalidation work natively on Vercel.
- Add `@vercel/analytics` and `@vercel/speed-insights` to monitor real user Core Web Vitals.
- Configure the production domain with www or apex chosen as canonical and the other 308 redirected (Vercel handles this in domain settings).
- Set security headers (`Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`) via `headers()` in `next.config.ts`.
- Protect Preview Deployments from indexing (Vercel sends `X-Robots-Tag: noindex` on previews by default; do not override).

---

## 20. Anti-Patterns (Reject in Review)

| Anti-pattern                                    | Correction                                   |
| ----------------------------------------------- | -------------------------------------------- |
| `'use client'` at the top of a page or layout   | Move interactivity to leaf components        |
| `useEffect` fetching initial page data          | Async Server Component                       |
| Hand rolled `/api` route called by own form     | Server Action                                |
| `<img>`, `<a>` for internal use, raw `<script>` | `next/image`, `next/link`, `next/script`     |
| `priority` prop on images                       | `preload` (v16 API)                          |
| Missing `sizes` on `fill` images                | Always set `sizes`                           |
| `useMemo`/`useCallback` everywhere              | React Compiler handles it                    |
| `next/router` imports                           | `next/navigation`                            |
| `middleware.ts`                                 | `proxy.ts`                                   |
| Secrets in `NEXT_PUBLIC_` variables             | Server only env vars                         |
| Client side redirects for auth or moved pages   | `redirect()` server side or config redirects |
| styled-components/emotion                       | Tailwind and CSS Modules                     |
| `ignoreBuildErrors: true`                       | Fix the errors                               |
| Content rendered only after a mounted check     | Server render it                             |
| Infinite scroll without paginated URLs          | Paginated routes plus enhancement            |

---

## 21. Build Checklist for the Agent

1. Scaffold per Section 1; enable `cacheComponents`, React Compiler, image config with `remotePatterns` and `qualities`.
2. Build the root layout: `next/font`, `<html lang>`, skip link, header, footer, metadata defaults.
3. Implement simple routes flat by default; add route groups only for shared layouts; add `loading.tsx`, `error.tsx`, `not-found.tsx`.
4. Build all pages as Server Components; isolate interactivity into small client leaves.
5. Implement the blog per Section 13 with `generateStaticParams`, cached and tagged content loaders, RSS feed.
6. Build all forms with Server Actions, Zod validation, `useActionState`, accessible error handling.
7. Apply image rules: `preload` on the single LCP image per page, `sizes` everywhere responsive, blur placeholders on static imports.
8. Wire navigation with `<Link>`, active states via `usePathname`, anchor offsets for the sticky header.
9. Add SEO layer: metadata, canonicals, Open Graph images, sitemap, robots, JSON-LD.
10. Add `proxy.ts` only if redirects or gating are required.
11. Configure env validation, `.env.example`, `server-only` guards.
12. Run `next build`, ESLint, type check, Lighthouse, and axe; resolve everything before completion.
13. Deploy to Vercel: domains, env vars per environment, region, analytics, security headers.
14. Verify in production: View Source shows full content, CWV pass in Speed Insights, sitemap submitted in Search Console.
