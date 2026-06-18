# Form Validation

The goal is simple: users should see helpful guidance, never raw schema-library messages.

## Server Action Pattern

When parsing `FormData`, remember that unchecked boxes, unselected dropdowns, or omitted fields may be
`undefined`. Preprocess required strings before applying `.min()` so the intended message appears.

```ts
import { z } from "zod";

const requiredText = (message: string, max: number, maxMessage: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, message).max(max, maxMessage),
  );

const contactSchema = z.object({
  name: requiredText(
    "Please enter your name",
    100,
    "Please keep your name under 100 characters",
  ),
  email: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z
      .string()
      .trim()
      .min(1, "Please enter your email address")
      .max(254, "Please keep your email address under 254 characters")
      .pipe(z.email("Please enter a valid email address")),
  ),
  enquiryType: requiredText(
    "Please choose how we can help",
    120,
    "Please choose a shorter enquiry type",
  ),
  privacyAccepted: z.enum(["on"], {
    error: "Please confirm you agree to the Privacy Policy",
  }),
});
```

## UI Pattern

- Use `noValidate` when server-side validation owns the messages.
- Set `aria-invalid` and `aria-describedby` for every field with an error.
- Render field errors with `role="alert"`.
- Do not rely on browser-native required validation when the form uses `noValidate`.

```tsx
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-red-600">
      {message}
    </p>
  );
}
```

## Dropdowns and Checkboxes

- Required `<select>` controls should have an empty disabled first option.
- Server validation should treat an empty selection as a missing value.
- Checkboxes need a `name` and explicit server validation if they are required.

## Success States

Prefer inline success for lead forms and callback requests:

- It confirms the action happened.
- It avoids losing context.
- It lets urgent users still call or navigate from the same page.

Redirect after submit only when the next step is a real destination, such as checkout or account
onboarding.
