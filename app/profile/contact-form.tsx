"use client";

import { useActionState } from "react";
import { updateContact } from "./actions";

interface ContactFormProps {
  currentContact: string;
}

export function ContactForm({ currentContact }: ContactFormProps) {
  const [state, action, isPending] = useActionState(updateContact, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          defaultValue={currentContact}
          required
          placeholder="+1234567890"
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Contact number updated successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-1.5">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Updating...
          </span>
        ) : (
          "Update Contact"
        )}
      </button>
    </form>
  );
}
