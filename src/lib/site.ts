/**
 * Central site configuration. Edit this once per project — name, description,
 * navigation, and footer all read from here so branding stays consistent.
 */

function getSiteUrl(): string {
  // NEXT_PUBLIC_SITE_URL is the canonical production URL.
  // On Vercel preview deployments, fall back to the per-deploy URL.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Acme",
  /** ~150–160 char default meta description. */
  description:
    "A production-ready Next.js and Tailwind CSS starter for fast, accessible, well-ranked marketing websites with a blog.",
  url: getSiteUrl(),
  locale: "en-AU",
  /** Top-level navigation (max 5–7 items, plain task nouns). */
  nav: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  /** Footer link columns. */
  footerNav: [
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
  /** Used in Organization JSON-LD `sameAs` and footer social icons. */
  social: {
    twitter: "https://twitter.com/acme",
    linkedin: "https://www.linkedin.com/company/acme",
  },
  contact: {
    email: "enquiries@example.com",
    phone: "+61 2 0000 0000",
    phoneHref: "tel:+61200000000",
    address: "Sydney, NSW, Australia",
  },
} as const;

export type SiteConfig = typeof siteConfig;
