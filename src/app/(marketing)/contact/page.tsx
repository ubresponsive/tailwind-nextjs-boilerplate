import type { Metadata } from "next";
import Link from "next/link";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}. We respond within one business day.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section tone="muted" className="py-16 sm:py-24">
      <Container>
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-700">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-gray-700">Contact</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Contact"
              title="Tell us about your project"
              intro="Fill in the form and we'll get back to you within one business day."
            />
            <dl className="mt-10 space-y-6 text-sm">
              <div className="flex items-start gap-3">
                <EnvelopeIcon
                  className="text-primary-600 size-5"
                  aria-hidden="true"
                />
                <dd>
                  <a
                    className="hover:text-primary-700 text-gray-700"
                    href={`mailto:${siteConfig.contact.email}`}
                  >
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <PhoneIcon
                  className="text-primary-600 size-5"
                  aria-hidden="true"
                />
                <dd>
                  <a
                    className="hover:text-primary-700 text-gray-700"
                    href={`tel:${siteConfig.contact.phone}`}
                  >
                    {siteConfig.contact.phone}
                  </a>
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon
                  className="text-primary-600 size-5"
                  aria-hidden="true"
                />
                <dd className="text-gray-700">{siteConfig.contact.address}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-card shadow-card bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
