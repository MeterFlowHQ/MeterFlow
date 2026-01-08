"use client";

import { useActionState, useState, useEffect } from "react";
import { createUser } from "@/app/dashboard/admin/users/actions";
import { ROLES } from "@/lib/constants";

export function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUser, undefined);
  const [showForm, setShowForm] = useState(false);

  // Close form on successful submission
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setShowForm(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        + Create New User
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Create New User</h3>
      </div>

      <form action={action} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value={ROLES.READER}>Reader</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
              Contact Number (Optional)
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="temporaryPassword" className="block text-sm font-medium text-gray-700">
              Temporary Password
            </label>
            <input
              type="password"
              id="temporaryPassword"
              name="temporaryPassword"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <p className="mt-1 text-xs text-gray-600">Minimum 8 characters</p>
          </div>
        </div>

        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
        )}

        {state?.success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            User created successfully! They can now log in with their credentials.
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create User"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
