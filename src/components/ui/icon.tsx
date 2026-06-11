import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: LucideIcon;
  className?: string;
  label?: string; // supply only when the icon conveys meaning on its own
}

/**
 * Wrapper for Lucide icons. Heroicons is the primary set; Lucide fills gaps only.
 * All Lucide icons render through here so they draw at stroke 1.5 (matching
 * Heroicons outline, which Lucide does not default to) with sensible a11y
 * defaults. Never render a Lucide icon directly in JSX — always pass it here.
 */
export function Icon({ icon: I, className, label }: IconProps) {
  return (
    <I
      strokeWidth={1.5}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn("size-6 shrink-0", className)}
    />
  );
}
