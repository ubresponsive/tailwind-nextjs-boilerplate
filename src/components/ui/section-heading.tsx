import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: ReactNode;
  /** One- to two-sentence intro under the title. */
  intro?: ReactNode;
  /** Heading level for correct document outline (default h2). */
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-primary-600 text-sm font-semibold tracking-wide uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="font-display mt-2 text-3xl font-bold tracking-tight text-balance text-gray-900 sm:text-4xl">
        {title}
      </Heading>
      {intro ? (
        <p className="mt-4 text-lg leading-relaxed text-gray-600">{intro}</p>
      ) : null}
    </div>
  );
}
