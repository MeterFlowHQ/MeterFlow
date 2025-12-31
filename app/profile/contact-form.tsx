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
        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-600">
          Phone Number
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          defaultValue={currentContact}
          required
          placeholder="+1234567890"
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
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
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending ? "Updating..." : "Update Contact"}
      </button>
    </form>
  );
}
