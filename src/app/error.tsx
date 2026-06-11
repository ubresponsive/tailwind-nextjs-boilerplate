"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report to your error-tracking service here.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-gray-600">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8">
        <button
          type="button"
          onClick={reset}
          className="bg-primary-600 hover:bg-primary-700 focus-visible:outline-primary-600 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Try again
        </button>
      </div>
    </Container>
  );
}
