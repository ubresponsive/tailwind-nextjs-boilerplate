import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type CtaBandProps = {
  heading: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/** High-contrast call-to-action band. Place once before the footer on every page. */
export function CtaBand({
  heading,
  body = "Tell us what you need and we'll get back to you within one business day.",
  ctaLabel = "Get in touch",
  ctaHref = "/contact",
}: CtaBandProps) {
  return (
    <section className="bg-primary-700">
      <Container className="py-16 text-center sm:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
          {heading}
        </h2>
        <p className="text-primary-50 mx-auto mt-4 max-w-xl text-lg">{body}</p>
        <div className="mt-8">
          <Button href={ctaHref} variant="secondary" size="lg">
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
