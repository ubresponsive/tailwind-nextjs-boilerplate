import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="flex min-h-[40vh] items-center justify-center py-24">
      <div
        role="status"
        aria-label="Loading"
        className="border-t-primary-600 size-8 animate-spin rounded-full border-2 border-gray-200"
      />
    </Container>
  );
}
