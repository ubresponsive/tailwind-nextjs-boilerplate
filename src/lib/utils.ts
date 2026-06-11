import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes intelligently: clsx resolves conditionals, twMerge
 * dedupes conflicting utilities so caller overrides win. Use this whenever a
 * component accepts a `className` prop.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Legacy helper kept ONLY so pasted Tailwind Plus catalogue snippets compile
 * unchanged. New components should use `cn()` instead.
 */
export function classNames(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
