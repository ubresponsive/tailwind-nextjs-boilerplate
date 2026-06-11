import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";

/** Map MDX elements to project components/styles (internal links use next/link). */
const components = {
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href.startsWith("/")) {
      return <Link href={href} {...props} />;
    }
    return <a href={href} rel="noopener" {...props} />;
  },
};

export async function MdxContent({ source }: { source: string }) {
  // Compile inside a cache boundary: MDX compilation reads the clock, which is
  // disallowed during static prerender unless encapsulated in a Cache Component.
  "use cache";
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            // Build-time syntax highlighting (no client-side highlighter).
            [rehypeShiki, { theme: "github-dark" }],
          ],
        },
      }}
    />
  );
}
