"use client";

import { useActionState } from "react";
import { assignMeter } from "../actions";

interface AssignMeterFormProps {
  userId: string;
  unassignedMeters: Array<{ id: string; meterCode: string; location: string }>;
}

export function AssignMeterForm({ userId, unassignedMeters }: AssignMeterFormProps) {
  const [state, action, isPending] = useActionState(assignMeter, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />

      <div>
        <label htmlFor="meterId" className="block text-sm font-medium text-gray-700">
          Select Meter
        </label>
        <select
          id="meterId"
          name="meterId"
          required
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        >
          <option value="">Choose a meter...</option>
          {unassignedMeters.map((meter) => (
            <option key={meter.id} value={meter.id}>
              {meter.meterCode} - {meter.location}
            </option>
          ))}
        </select>
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Meter assigned successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          "Assign Meter"
        )}
      </button>
    </form>
  );
}
