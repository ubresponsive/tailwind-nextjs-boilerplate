"use client";

/**
 * Renders the current year. Kept as a Client Component because reading the
 * clock in a Server Component would opt the whole tree out of static rendering
 * under Cache Components. Falls back to a sensible static year before hydration.
 */
export function CurrentYear({ fallback = 2026 }: { fallback?: number }) {
  const year =
    typeof window === "undefined" ? fallback : new Date().getFullYear();
  return <>{year}</>;
}
