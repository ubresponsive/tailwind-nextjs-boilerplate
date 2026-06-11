import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/cta-band";
import { MdxContent } from "@/components/mdx-content";
import { getAllPosts, getPost } from "@/lib/posts";
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author.name],
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(articleJsonLd(post))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(post))}
      />

      <article className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-700">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link href="/blog" className="hover:text-primary-700">
              Blog
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-gray-700">{post.title}</span>
          </nav>

          <header>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary-50 text-primary-700 rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-balance text-gray-900">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-gray-500">
              {post.author.profileUrl ? (
                <Link
                  href={post.author.profileUrl}
                  className="hover:text-primary-700 font-medium text-gray-700"
                >
                  {post.author.name}
                </Link>
              ) : (
                <span className="font-medium text-gray-700">
                  {post.author.name}
                </span>
              )}{" "}
              · <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.updated ? (
                <>
                  {" "}
                  · Updated{" "}
                  <time dateTime={post.updated}>
                    {formatDate(post.updated)}
                  </time>
                </>
              ) : null}{" "}
              · {post.readingTimeMinutes} min read
            </p>
          </header>

          <div className="prose prose-gray prose-headings:font-display prose-a:text-primary-700 mt-10 max-w-none">
            <Suspense
              fallback={<p className="text-gray-500">Loading article…</p>}
            >
              <MdxContent source={post.content} />
            </Suspense>
          </div>
        </Container>
      </article>

      <CtaBand
        heading="Enjoyed this?"
        body="Get in touch to talk about your project."
      />
    </>
  );
}
