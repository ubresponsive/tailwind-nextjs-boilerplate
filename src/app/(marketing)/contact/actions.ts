"use server";

import { Resend } from "resend";
import { z } from "zod";
import { getEnv } from "@/lib/env";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail")
    .max(5000),
  // Honeypot field: real users leave this empty; bots tend to fill it.
  company: z.string().max(0).optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
};

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: {
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
      },
    };
  }

  // Honeypot tripped — silently succeed so bots get no signal.
  if (parsed.data.company) {
    return {
      status: "success",
      message: "Thanks — we'll be in touch shortly.",
    };
  }

  try {
    const env = getEnv();
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: env.CONTACT_TO_EMAIL,
      replyTo: parsed.data.email,
      subject: `New enquiry from ${parsed.data.name}`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
    });

    if (error) {
      // Log server-side detail; return a generic message to the client.
      console.error("Resend error:", error);
      return {
        status: "error",
        message: "Something went wrong sending your message. Please try again.",
      };
    }

    return {
      status: "success",
      message: "Thanks — we'll be in touch shortly.",
    };
  } catch (err) {
    console.error("Contact form error:", err);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again.",
    };
  }
}
