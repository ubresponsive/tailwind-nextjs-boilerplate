"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./actions";

const initialState: ContactState = { status: "idle" };

const fieldClasses =
  "mt-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-card ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-red-600">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-card bg-primary-50 text-primary-900 p-6"
      >
        <p className="font-semibold">Message sent</p>
        <p className="mt-1 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-900"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={!!state.errors?.name}
          aria-describedby={state.errors?.name ? "name-error" : undefined}
          className={fieldClasses}
        />
        <FieldError id="name-error" message={state.errors?.name} />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={!!state.errors?.email}
          aria-describedby={state.errors?.email ? "email-error" : undefined}
          className={fieldClasses}
        />
        <FieldError id="email-error" message={state.errors?.email} />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-900"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          className={fieldClasses}
        />
        <FieldError id="message-error" message={state.errors?.message} />
      </div>

      {/* Honeypot: hidden from users, visible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary-600 hover:bg-primary-700 focus-visible:outline-primary-600 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 sm:w-auto"
      >
        {isPending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
