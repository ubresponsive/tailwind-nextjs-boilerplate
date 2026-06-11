import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-primary-600 text-sm font-semibold tracking-wide uppercase">
        404
      </p>
      <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-gray-600">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <div className="mt-8">
        <Button href="/">Back home</Button>
      </div>
    </Container>
  );
}
