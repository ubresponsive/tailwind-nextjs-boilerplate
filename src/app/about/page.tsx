import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/cta-band";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn how ${siteConfig.name} approaches building fast, accessible, well-ranked websites.`,
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Performance is a feature",
    body: "We ship server-rendered HTML, optimised images, and lean client bundles so pages feel instant and rank well.",
  },
  {
    title: "Accessible by default",
    body: "Semantic markup, keyboard support, visible focus, and AA contrast are part of the definition of done, not an afterthought.",
  },
  {
    title: "Built to maintain",
    body: "Centralised design tokens and shared primitives keep every page consistent as the site grows.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section tone="muted" className="py-16 sm:py-24">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-700">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-gray-700">About</span>
          </nav>
          <SectionHeading
            as="h1"
            eyebrow="About us"
            title="We build websites worth keeping"
            intro={`${siteConfig.name} is a starting point for marketing sites that load fast, read clearly, and convert — without the usual templated feel.`}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="prose prose-gray max-w-none">
              <p>
                This page is an example subpage. Replace this copy with a
                genuine account of who you are, the experience you bring, and
                the outcomes you deliver — the kind of firsthand detail that
                builds trust with both visitors and search engines.
              </p>
              <p>
                Keep paragraphs short, lead with specifics over adjectives, and
                link onward so no page is a dead end.
              </p>
            </div>
            <dl className="space-y-8">
              {values.map((value) => (
                <div key={value.title}>
                  <dt className="font-display text-lg font-semibold text-gray-900">
                    {value.title}
                  </dt>
                  <dd className="mt-2 leading-relaxed text-gray-600">
                    {value.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <CtaBand
        heading="Like the way we work?"
        ctaLabel="Start a conversation"
      />
    </>
  );
}
