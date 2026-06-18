# Asset Pipeline

Use this as the default image workflow for marketing sites built from this starter.

## Directory Conventions

```text
public/
  og-image.png
  images/
    brand/
    banners/
    team/
    logos/
```

Keep source exports and working files outside `public/` when they are not served by the site.

## Social Sharing Image

- Keep a static `public/og-image.png` unless the project explicitly needs generated per-page images.
- Use 1200x630 pixels.
- Prefer PNG or JPEG. PNG is the safest default for text-heavy designs.
- Keep text large and give CTA text enough width. Social previews shrink aggressively.
- Verify the deployed URL:

```bash
curl -I https://example.com/og-image.png
```

Dynamic `opengraph-image.tsx` routes are fine for blogs, products, or large content libraries, but
they must be checked in production. If the generated image route returns `500`, WhatsApp and other
scrapers will not fall back to the Twitter image.

## Web Images

- Convert high-resolution PNG or JPG photos to WebP or AVIF before committing.
- Keep PNG for logos, favicons, screenshots with sharp UI edges, and OG images when text clarity
  matters.
- Use `next/image` for page content images.
- Add `sizes` for every responsive image.
- Use `priority` only for the primary above-the-fold image.

## Banner Crops

For every hero/detail banner:

- Check desktop, tablet, and mobile widths.
- Adjust `object-position` so heads, faces, products, or key objects are not cut off.
- Avoid one global dark overlay for every page. Tune overlays by image and text placement.
- Keep text legible without making the image feel muddy.

## Suggested Conversion Commands

Use whichever tool is available on the project machine.

```bash
# macOS built-in resize only
sips -Z 2400 input.png --out output.png

# Sharp CLI or an image app can then export WebP/AVIF.
# Keep final hero/banner assets reasonably sized for the viewport they serve.
```

For bulk conversions, prefer a reviewed script that writes to `public/images/...` and preserves the
originals elsewhere.
