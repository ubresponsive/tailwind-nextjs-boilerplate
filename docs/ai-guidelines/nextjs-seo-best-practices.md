# Next.js SEO Best Practices

Implementation guide for an AI agent working on a Next.js (App Router, v14+) site. Apply every rule below unless a project constraint explicitly prevents it. Each section contains directives, code patterns, and pitfalls that damage ranking. Current as at June 2026.

---

## 1. Google Algorithm Context (2025 to 2026)

Recent updates shape what to optimise for:

| Update                                    | Focus                                                             | Implication                                                                           |
| ----------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| March 2026 core update                    | Major reranking, heavy volatility                                 | Content quality and demonstrated expertise outrank keyword targeting                  |
| May 2026 core update                      | Tighter content quality, AI text and Core Web Vitals evaluation   | Scaled, generic AI content is penalised; CWV thresholds matter more                   |
| Spam updates (2025 to 2026)               | Scaled content abuse, expired domain abuse, site reputation abuse | Never publish bulk generated pages or host third party content for ranking            |
| Helpful Content system (merged into core) | People first content, E-E-A-T                                     | Every page must serve a real user need with firsthand value                           |
| AI Overviews and AI Mode                  | Answers synthesised above organic results                         | Structure content so it can be cited: clear headings, direct answers, structured data |

Core principles the agent must apply to all work:

- Write for users first. Google's systems now detect content produced without genuine topic knowledge.
- E-E-A-T (Experience, Expertise, Authoritativeness, Trust) is decisive for ranking. Attribute content to credentialed authors, include firsthand detail, keep statistics current.
- Core Web Vitals are confirmed ranking signals: LCP under 2.5s, INP under 200ms, CLS under 0.1.
- Mobile first indexing is universal. Google ranks based on the mobile render of the page.

---

## 2. Rendering Strategy (SSR, SSG, ISR)

Googlebot can execute JavaScript, but rendering is deferred and unreliable for ranking critical content. Serve complete HTML on first response.

| Strategy          | Use for                                          | Next.js mechanism                                 |
| ----------------- | ------------------------------------------------ | ------------------------------------------------- |
| Static (SSG)      | Marketing pages, blogs, docs                     | Default for App Router pages with no dynamic data |
| ISR               | Product pages, listings that change periodically | `export const revalidate = 3600`                  |
| SSR               | Personalised or per request content              | `export const dynamic = 'force-dynamic'`          |
| Client only (CSR) | Never for indexable content                      | Dashboards behind login only                      |

Rules:

- All indexable text, headings, links, and metadata must exist in the server rendered HTML. Verify with `curl` or View Source, not DevTools.
- Use Server Components by default. Add `'use client'` only to leaf components needing interactivity.
- Never fetch primary page content with `useEffect`. Fetch in Server Components or route handlers.
- Use `<Link>` from `next/link` for all internal navigation so crawlers discover URLs through real `<a href>` elements. Never use `onClick` with `router.push` for primary navigation.
- Avoid blocking indexable routes behind middleware redirects or geo gates that bots cannot pass.

---

## 3. Page Titles and Meta Descriptions

Use the Metadata API. Never hand roll `<head>` tags in App Router.

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: "%s | Brand Name",
    default: "Brand Name | Primary Value Proposition",
  },
  description: "Default description, 150 to 160 characters.",
  metadataBase: new URL("https://www.example.com"),
};

// app/blog/[slug]/page.tsx (dynamic pages)
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title, // template appends '| Brand Name'
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}
```

| Element     | Rules                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Title       | 50 to 60 characters. Unique per page. Primary keyword near the front. Written for click through, not stuffing                                |
| Description | 150 to 160 characters. Unique per page. Includes keyword naturally and a reason to click. Google may rewrite it, but a good one improves CTR |
| Canonical   | Set on every page via `alternates.canonical`. Self referencing on unique pages, pointing to the original on duplicates                       |

Pitfalls:

- Duplicate titles or descriptions across pages dilute relevance and trigger Google rewrites.
- The `keywords` meta tag is ignored by Google. Do not rely on it.
- Missing `metadataBase` breaks Open Graph image URLs in production.

---

## 4. Heading Hierarchy (h1, h2, h3)

- Exactly one `<h1>` per page, containing the primary topic or keyword. It should closely relate to the title tag but need not be identical.
- Use `<h2>` for major sections, `<h3>` for subsections. Never skip levels (h1 to h3) and never choose a heading tag for its font size; style with CSS instead.
- Headings must describe the content that follows. Question style h2s ("How much does X cost?") perform well for AI Overviews and featured snippets when followed by a direct answer in the first sentence.
- Do not place headings inside carousels, accordions, or components that render client side only.
- Do not use headings for decorative text, taglines, or navigation labels.

---

## 5. Images and Alt Tags

Always use `next/image`. It provides responsive sizing, modern formats (AVIF, WebP), lazy loading, and prevents layout shift.

```tsx
import Image from "next/image";

<Image
  src="/hero-banner.webp"
  alt="Tradesperson scanning timber stock with a mobile inventory app"
  width={2880}
  height={1152}
  priority // ONLY for the above the fold LCP image
  sizes="100vw"
/>;
```

| Rule            | Detail                                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alt text        | Describe the image content and function in plain language. Include a keyword only when it genuinely describes the image. Empty `alt=""` for purely decorative images |
| Dimensions      | Always supply `width` and `height` (or `fill` with a sized container) to prevent CLS                                                                                 |
| LCP image       | Add `priority` so it is preloaded. Never lazy load the hero image                                                                                                    |
| Below the fold  | Default lazy loading is correct. Do not add `priority` everywhere; it defeats preloading                                                                             |
| File names      | Descriptive, lowercase, words separated by dashes in the filename (`timber-stock-app.webp`), not `IMG_4022.png`                                                      |
| Format and size | Serve WebP or AVIF. Keep hero images under 200KB where possible                                                                                                      |

Pitfalls:

- Missing or keyword stuffed alt text harms both accessibility and image search ranking.
- Text baked into images is invisible to crawlers and screen readers. Render text as HTML over the image.
- Unoptimised hero images are the most common cause of LCP failures, which the May 2026 update evaluates more strictly.

---

## 6. Banners and Carousels

Banners and carousels are frequent SEO and accessibility liabilities. Apply these constraints:

- Prefer a single static hero banner over a carousel. Slides after the first receive minimal engagement and their content carries little weight.
- If a carousel is required:
  - Render all slide content (headings, text, links) in the server HTML, not injected client side.
  - Do not put the page `<h1>` inside a slide. Keep the h1 in static markup.
  - Disable auto rotation, or pause on hover and focus, and always provide visible pause controls (WCAG 2.2.2).
  - Make controls keyboard accessible with `aria-label`s ("Next slide", "Slide 2 of 4") and use `aria-roledescription="carousel"`.
  - Preload only the first slide image with `priority`; lazy load the rest.
- Reserve explicit height for any banner so late loading content never shifts the layout (CLS).
- Never use banners as intrusive interstitials or full screen popups that cover content on entry. Google explicitly demotes pages with intrusive interstitials on mobile. Cookie consent and legally required notices are exempt but should be compact.

---

## 7. Forms

- Content needed for ranking must never sit behind a form, login, or paywall gate unless using Google's paywalled content structured data.
- Every input requires a programmatically associated `<label htmlFor>`. Placeholder text is not a label.
- Use correct `type` attributes (`email`, `tel`) and `autocomplete` attributes; these feed into UX signals and accessibility audits.
- Mark up forms with semantic HTML (`<form>`, `<fieldset>`, `<legend>`, `<button type="submit">`). Avoid div and onClick constructions.
- Show inline validation errors with `aria-describedby` and `aria-invalid`, not colour alone.
- Keep lead forms short. High friction forms increase pogo sticking back to results, a negative engagement signal.
- Do not let third party form scripts block rendering; load them with `next/script` and `strategy="lazyOnload"`.

---

## 8. Accessibility (Direct and Indirect Ranking Impact)

Accessibility overlaps heavily with how Google parses pages. Apply WCAG 2.2 AA:

- Semantic landmarks: `<header>`, `<nav>`, `<main>` (one per page), `<article>`, `<aside>`, `<footer>`.
- Colour contrast minimum 4.5:1 for body text, 3:1 for large text and UI components.
- Full keyboard operability with visible focus states. Include a skip to content link as the first focusable element.
- Set `<html lang="en-AU">` (or correct locale) in the root layout.
- Descriptive link text. Never "click here" or "read more" alone; crawlers use anchor text to understand the target page.
- Respect `prefers-reduced-motion` for animated banners and carousels.
- Run Lighthouse and axe audits in CI; treat accessibility regressions as build failures.

---

## 9. Sitemap and Robots

Use the file conventions in App Router:

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return [
    {
      url: "https://www.example.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((p) => ({
      url: `https://www.example.com/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/cart"] },
    ],
    sitemap: "https://www.example.com/sitemap.xml",
  };
}
```

- Include only canonical, indexable, 200 status URLs in the sitemap. No redirects, no noindexed pages, no parameter variants.
- Keep `lastModified` truthful. Faking freshness is a known negative signal.
- Submit the sitemap in Google Search Console and monitor Index Coverage.
- Never `disallow` CSS or JS paths in robots; Google must render the page fully.
- Use `noindex` (via `robots: { index: false }` in metadata) for thin utility pages: search results, filtered listings, cart, thank you pages.

---

## 10. Keywords and Content Strategy

- Target search intent, not strings. Map each page to one primary intent (informational, commercial, transactional) and one primary keyword plus natural variants.
- One page per intent. Multiple pages targeting the same keyword cannibalise each other.
- Place the primary keyword in: title tag, h1, first 100 words, one h2, image alt where genuine, and the URL slug.
- Keyword density targets are obsolete. Stuffing is an explicit spam signal. Write naturally and cover the topic completely, including related entities and questions.
- Structure for AI Overviews: answer the core question directly in the first one or two sentences under a matching heading, then expand.
- URL slugs: short, lowercase, hyphen separated, keyword bearing (`/blog/timber-stock-control-guide`), no dates or IDs where avoidable. Never change slugs without a 301 redirect.

---

## 11. Blogs and E-E-A-T

- Every post needs a named author with a linked bio page stating credentials and experience. Anonymous content underperforms post 2026 core updates.
- Show visible published and updated dates that match `dateModified` in structured data.
- Demonstrate firsthand experience: original screenshots, real data, worked examples, opinions grounded in practice. Content reproducible by anyone without topic knowledge is exactly what recent updates demote.
- Build topic clusters: a pillar page targeting the broad term, supporting posts targeting subtopics, all interlinked with descriptive anchor text.
- Internal links: every post links to 2 to 5 related pages; every important page is reachable within 3 clicks of the home page; no orphan pages.
- Refresh decaying posts (update statistics, dates, sections) rather than publishing near duplicates.
- If AI assists drafting, a knowledgeable human must add genuine expertise, verify claims, and take authorship. Publishing scaled unedited AI content at volume risks a sitewide spam classification.

Article structured data:

```tsx
// In the page component (Server Component)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  image: post.ogImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: { '@type': 'Person', name: post.author.name, url: post.author.profileUrl },
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Also implement where relevant: `Organization` (site wide), `BreadcrumbList`, `Product`, `FAQPage`, `LocalBusiness`. Validate with Google's Rich Results Test. Structured data must always match visible page content; mismatches are a spam policy violation.

---

## 12. Open Graph and Social Media

Open Graph and Twitter card tags control how pages appear when shared. Social signals are indirect (traffic, links, brand searches) but sharing performance compounds.

```tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Page Title",
    description: "Share description.",
    url: "https://www.example.com/page",
    siteName: "Brand Name",
    images: [
      {
        url: "/og/page.png",
        width: 1200,
        height: 630,
        alt: "Description of image",
      },
    ],
    locale: "en_AU",
    type: "article", // 'website' for non articles
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Title",
    description: "Share description.",
    images: ["/og/page.png"],
  },
};
```

- OG images: 1200 x 630px, under 1MB, legible text, brand consistent. Use a static
  `public/og-image.png` as the site default. Generate dynamic images with `opengraph-image.tsx` and
  `next/og` only for blogs/products that need per-page images, and verify the generated image URL
  returns `200` in production.
- Set `og:type` correctly: `article` for posts, `website` otherwise.
- Test with social debuggers (LinkedIn Post Inspector, Facebook Sharing Debugger) after deploys.
- Add profile links in `Organization` structured data (`sameAs`) to connect social accounts to the brand entity.

---

## 13. Core Web Vitals and Performance

Targets at the 75th percentile of real users (CrUX data, monitored in Search Console):

| Metric | Target  | Common Next.js fixes                                                                             |
| ------ | ------- | ------------------------------------------------------------------------------------------------ |
| LCP    | < 2.5s  | `priority` on hero image, server render above the fold content, CDN, ISR over SSR where possible |
| INP    | < 200ms | Reduce client JS, dynamic imports, Server Components, defer third party scripts                  |
| CLS    | < 0.1   | Image dimensions, `next/font`, reserved space for ads, banners and embeds                        |

Mandatory techniques:

- `next/font` for all fonts (self hosted, zero layout shift, no render blocking Google Fonts requests).
- `next/script` with `strategy="afterInteractive"` or `lazyOnload` for analytics, chat widgets, tag managers. Never raw `<script>` tags in the body.
- Dynamic import heavy client components: `dynamic(() => import('./Chart'), { ssr: false })` only for genuinely non indexable widgets.
- Audit bundle size with `@next/bundle-analyzer`; keep first load JS per route lean.
- Enable HTTP caching and serve via CDN. Use `revalidate` rather than `force-dynamic` wherever content allows.

---

## 14. Negative Ranking Factors (Do Not Do)

| Category  | Violation                                                       | Consequence                                             |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| Content   | Scaled AI or thin content with no original value                | Demotion or sitewide spam action (March/May 2026 focus) |
| Content   | Keyword stuffing, hidden text, doorway pages                    | Spam policy violation                                   |
| Content   | Duplicate pages without canonicals                              | Diluted ranking, wasted crawl budget                    |
| Technical | Critical content rendered client side only                      | Content unseen or delayed in indexing                   |
| Technical | Blocking JS/CSS in robots.txt                                   | Broken rendering, ranking loss                          |
| Technical | Slow LCP, poor INP, layout shift from banners                   | CWV ranking penalty                                     |
| Technical | Broken internal links, soft 404s, redirect chains               | Crawl waste, poor quality signal                        |
| Technical | Missing or wrong canonical, http/https or www duplicates        | Split signals                                           |
| UX        | Intrusive interstitials and popups on mobile entry              | Explicit demotion                                       |
| UX        | Auto rotating carousels without controls                        | Accessibility failure, engagement loss                  |
| Links     | Buying links, link exchanges, spammy guest posts                | Link spam penalty (SpamBrain neutralises or demotes)    |
| Links     | Site reputation abuse (hosting third party content for ranking) | Manual action                                           |
| Trust     | No HTTPS, mixed content                                         | Ranking and browser trust loss                          |
| Trust     | Fake authors, fabricated reviews, mismatched structured data    | E-E-A-T and spam violations                             |
| Structure | Multiple h1s, skipped heading levels, non semantic markup       | Weakened topical signals                                |
| Sitemap   | Noindexed, redirected or 404 URLs in sitemap                    | Crawl inefficiency, trust erosion                       |

---

## 15. Implementation Checklist for the Agent

Work through in order. Verify each item before marking complete.

1. Audit rendering: confirm all indexable content appears in server HTML (`curl` each route template).
2. Implement root `metadata` with title template, default description, `metadataBase`.
3. Add `generateMetadata` with unique title, description, canonical for every dynamic route.
4. Add Open Graph and Twitter metadata; generate OG images per content type.
5. Enforce one h1 per page and correct h2/h3 nesting across all templates.
6. Replace all `<img>` with `next/image`; write descriptive alt text; set `priority` on LCP images only.
7. Refactor banners/carousels: static h1, server rendered slides, pause controls, reserved heights.
8. Audit forms: labels, autocomplete, semantic markup, no gated indexable content.
9. Create `app/sitemap.ts` and `app/robots.ts`; noindex utility pages; submit sitemap in Search Console.
10. Add JSON-LD: Organization site wide, Article on posts, BreadcrumbList, plus Product/FAQ where relevant; validate with Rich Results Test.
11. Apply `next/font`, `next/script` strategies, dynamic imports; run Lighthouse, target 90+ on Performance, Accessibility, SEO.
12. Fix all items in the Negative Ranking Factors table found during audit (duplicates, redirects, broken links, interstitials).
13. Set `<html lang>`, skip link, landmarks, contrast, keyboard navigation; run axe audit.
14. Confirm Core Web Vitals pass in PageSpeed Insights (field data where available) for top templates.
15. Document changes and set up ongoing monitoring: Search Console (coverage, CWV, enhancements) reviewed after each Google update rollout completes.
