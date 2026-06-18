# Production Checklist

Run these checks before handing a marketing site to a client or pushing a production deploy.

## Environment

- `NEXT_PUBLIC_SITE_URL` is set to the canonical production origin, with no trailing slash.
- `RESEND_API_KEY`, `RESEND_FROM`, and `CONTACT_TO_EMAIL` are set in the correct Vercel environment.
- Canonical domain choice is clear: either `www` or apex, with the other redirecting permanently.

## Build and Routes

- `npm run build` passes.
- Example routes are flat unless a route group is genuinely needed. Prefer `src/app/about` over
  `src/app/(marketing)/about` for simple marketing sites.
- Header and footer internal navigation uses `next/link`.
- Same-page anchor targets below sticky headers use `scroll-mt-*`.

## Metadata and Social Previews

- The homepage includes `og:title`, `og:description`, `og:url`, `og:image`, and
  `twitter:card`.
- `og:image` and `twitter:image` point to an absolute production URL after deploy.
- The image URL returns `200`, has a correct content type, and is not blocked by auth or middleware:

```bash
curl -I https://example.com/og-image.png
```

- `public/og-image.png` is 1200x630 and readable at small preview sizes.
- Test with a cache-busted URL because WhatsApp, Facebook, LinkedIn, and X cache previews:

```text
https://example.com/?v=preview-1
```

## Forms

- Required fields show friendly messages when empty.
- Select/dropdown fields do not show raw Zod messages such as
  `Invalid input: expected string, received undefined`.
- If a form uses `noValidate`, every required field is validated server-side.
- Honeypot fields silently succeed when filled.
- Success states are inline unless a redirect is a deliberate product decision.

## Assets and UI

- Large PNG/JPG hero and banner assets are converted to WebP or AVIF.
- First-viewport images use `next/image`, `priority` only where justified, and an accurate `sizes`
  value.
- Banner crops are checked at desktop and mobile widths so faces and key objects are not cut off.
- Dark overlays and section shadows are checked visually. Premium sites usually need subtle shadows
  and enough contrast without crushing the image.
- Long CTA labels are checked for wrapping in header, footer, cards, and OG images.
