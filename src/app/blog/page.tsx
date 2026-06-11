import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Insights and writing from the ${siteConfig.name} team.`,
  alternates: { canonical: "/blog" },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Section tone="muted" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Blog"
            title="Insights"
            intro="Practical writing on building fast, accessible websites."
          />
        </Container>
      </Section>

      <Section>
        <Container>
          {posts.length === 0 ? (
            <p className="text-gray-600">
              No posts yet. Add an <code>.mdx</code> file under{" "}
              <code>src/content/posts/</code> to get started.
            </p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.slug} className="flex flex-col">
                  <div className="rounded-card aspect-video bg-gray-100" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary-50 text-primary-700 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-display mt-3 text-xl font-semibold text-gray-900">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary-700"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-2 text-gray-600">
                    {post.description}
                  </p>
                  <p className="mt-4 text-sm text-gray-500">
                    {post.author.name} ·{" "}
                    <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
                    {post.readingTimeMinutes} min read
                  </p>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
