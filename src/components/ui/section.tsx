import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  /** Background band. Alternate these down a page to create scannable bands. */
  tone?: "default" | "muted" | "brand" | "dark";
} & ComponentPropsWithoutRef<"section">;

const tones = {
  default: "bg-white text-gray-900",
  muted: "bg-gray-50 text-gray-900",
  brand: "bg-primary-50 text-gray-900",
  dark: "bg-gray-950 text-gray-300",
} as const;

/** Consistent vertical rhythm for page sections. */
export function Section({
  tone = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-16 sm:py-24", tones[tone], className)}
      {...props}
    >
      {children}
    </section>
  );
}
