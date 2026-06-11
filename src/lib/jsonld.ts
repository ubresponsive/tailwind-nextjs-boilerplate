import { siteConfig } from "@/lib/site";
import type { Post } from "@/lib/posts";

/** Organization schema — render once site-wide (in the root layout). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: Object.values(siteConfig.social),
  };
}

/** Article schema for a blog post. Must match the visible page content. */
export function articleJsonLd(post: Post) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.cover ? `${siteConfig.url}${post.cover}` : undefined,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.profileUrl,
    },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

/** BreadcrumbList for a blog post. */
export function breadcrumbJsonLd(post: Post) {
  const items = [
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Small helper component props: stringify safely for a <script> tag. */
export function jsonLdScript(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data) };
}
