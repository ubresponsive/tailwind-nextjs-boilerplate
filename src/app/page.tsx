import Link from "next/link";
import {
  BoltIcon,
  ShieldCheckIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/cta-band";
import { getAllPosts } from "@/lib/posts";

const features = [
  {
    name: "Fast by default",
    description:
      "Server Components, the Next.js Image and Font pipelines, and Turbopack keep Core Web Vitals green out of the box.",
    icon: BoltIcon,
  },
  {
    name: "Secure foundations",
    description:
      "Validated environment variables, security headers, and Zod input validation are wired in from the first commit.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Distinctive design",
    description:
      "Tailwind v4 design tokens and a 657-block component catalogue to compose a site that doesn't look templated.",
    icon: SparklesIcon,
  },
  {
    name: "Ship to Vercel",
    description:
      "Push to GitHub and every commit builds a preview; merge to main deploys to production automatically.",
    icon: RocketLaunchIcon,
  },
];

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Section className="pt-20 sm:pt-28">
        <Container className="flex flex-col items-center text-center">
          <p className="text-primary-600 text-sm font-semibold tracking-wide uppercase">
            Next.js + Tailwind starter
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl">
            Launch a fast, accessible website that ranks
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            A production-ready boilerplate with a marketing site, MDX blog,
            contact form, and SEO baked in — so you start every project from a
            strong, opinionated foundation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              Get in touch
            </Button>
            <Button href="/blog" variant="secondary" size="lg">
              Read the blog
            </Button>
          </div>
        </Container>
      </Section>

      {/* Value propositions */}
      <Section tone="muted">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Why this starter"
            title="Everything a new site needs, already wired"
            intro="Opinionated defaults that follow current Next.js, Tailwind, SEO, and accessibility best practices."
          />
          <dl className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="rounded-card shadow-card bg-white p-6"
              >
                <div className="bg-primary-50 flex size-12 items-center justify-center rounded-lg">
                  <feature.icon
                    className="text-primary-600 size-6"
                    aria-hidden="true"
                  />
                </div>
                <dt className="font-display mt-4 text-lg font-semibold text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Feature split */}
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Built for editing"
              title="Replace the placeholders, not the plumbing"
              intro="Brand tokens live in one CSS file, content lives in MDX, and shared primitives keep every page consistent. Swap the copy and colours and you have a real site."
            />
            <div className="mt-8">
              <Button href="/about" variant="ghost">
                Learn more about the approach →
              </Button>
            </div>
          </div>
          <div className="rounded-card from-primary-100 to-secondary-500/20 shadow-card aspect-video bg-linear-to-br" />
        </Container>
      </Section>

      {/* Proof / testimonial */}
      <Section tone="dark">
        <Container className="max-w-3xl text-center">
          <figure>
            <blockquote className="font-display text-2xl font-medium text-balance text-white sm:text-3xl">
              &ldquo;We cloned the template on Monday and had a polished
              marketing site in production by Friday.&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-gray-400">
              Jordan Lee — Founder, Example Co.
            </figcaption>
          </figure>
        </Container>
      </Section>

      {/* Latest posts */}
      {posts.length > 0 ? (
        <Section tone="muted">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="From the blog" title="Latest writing" />
              <Link
                href="/blog"
                className="text-primary-700 hover:text-primary-800 text-sm font-semibold"
              >
                View all →
              </Link>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-card shadow-card bg-white p-6"
                >
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary-50 text-primary-700 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display mt-3 text-lg font-semibold text-gray-900">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary-700"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {post.description}
                  </p>
                  <p className="mt-4 text-xs text-gray-500">
                    {post.author.name} · {post.readingTimeMinutes} min read
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaBand heading="Ready to start your next site?" />
    </>
  );
}
