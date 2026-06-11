import "server-only";
import { z } from "zod";

/**
 * Server-only environment validation. Call `getEnv()` from server code instead
 * of reading `process.env` directly — a missing/invalid var fails fast with a
 * clear message. `server-only` guarantees these secrets can never be bundled
 * into client code.
 *
 * Validation is lazy (on first call) so `next build` does not require runtime
 * secrets to be present in the build environment.
 */
const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  RESEND_FROM: z.string().min(1, "RESEND_FROM is required"),
  CONTACT_TO_EMAIL: z.email("CONTACT_TO_EMAIL must be a valid email"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  });
  if (!parsed.success) {
    // Don't print values — only which keys are wrong.
    const issues = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(
      `Invalid or missing environment variables: ${issues}. See .env.example.`,
    );
  }
  cached = parsed.data;
  return cached;
}
