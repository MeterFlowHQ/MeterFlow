"use client";

import { useActionState } from "react";
import { updatePassword } from "./actions";

export function PasswordForm() {
  const [state, action, isPending] = useActionState(updatePassword, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          required
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Password updated successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
