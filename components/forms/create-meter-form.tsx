"use client";

import { useActionState, useState, useEffect } from "react";
import { createMeter } from "@/app/admin/meters/actions";

export function CreateMeterForm() {
  const [state, action, isPending] = useActionState(createMeter, undefined);
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
        + Create New Meter
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Create New Meter</h3>
      </div>

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="meterCode" className="block text-sm font-medium text-gray-700">
            Meter Code
          </label>
          <input
            type="text"
            id="meterCode"
            name="meterCode"
            required
            maxLength={50}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            placeholder="e.g., MTR-001"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            maxLength={200}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            placeholder="e.g., Building A - Floor 1"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue="ENABLED"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="ENABLED">Enabled</option>
            <option value="DISABLED">Disabled</option>
            <option value="NOT_WORKING">Not Working</option>
          </select>
        </div>

        <div>
          <label htmlFor="readingType" className="block text-sm font-medium text-gray-700">
            Reading Type
          </label>
          <select
            id="readingType"
            name="readingType"
            defaultValue="INCREASING"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="INCREASING">Increasing (cumulative)</option>
            <option value="NORMAL">Normal (any value)</option>
          </select>
          <p className="mt-1 text-xs text-gray-600">
            Increasing: readings must be greater than or equal to the last reading. Normal: any value is accepted.
          </p>
        </div>

        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
        )}

        {state?.success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            Meter created successfully!
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Meter"}
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
