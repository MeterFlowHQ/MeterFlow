"use client";

import { useActionState } from "react";
import { submitReading } from "@/app/reader/meters/actions";

type ReadingType = "INCREASING" | "NORMAL";

interface ReadingFormProps {
  meterId: string;
  meterCode: string;
  readingType: ReadingType;
  lastReading?: number;
}

export function ReadingForm({ meterId, meterCode, readingType, lastReading }: ReadingFormProps) {
  const [state, action, isPending] = useActionState(submitReading, undefined);

  // Format current date/time for datetime-local input (YYYY-MM-DDTHH:MM)
  const now = new Date();
  const defaultDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const isIncreasing = readingType === "INCREASING";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="meterId" value={meterId} />

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-sm font-medium text-emerald-900">
          Submitting reading for: <span className="font-bold">{meterCode}</span>
        </p>
        {lastReading !== undefined && (
          <p className="mt-1 text-xs text-emerald-700">
            Last reading: {lastReading.toFixed(2)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="readingValue" className="block text-sm font-medium text-gray-700">
          Reading Value
        </label>
        <input
          type="number"
          id="readingValue"
          name="readingValue"
          step="0.01"
          min={isIncreasing && lastReading ? lastReading : 0}
          required
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          placeholder={
            isIncreasing && lastReading 
              ? `Must be ≥ ${lastReading.toFixed(2)}` 
              : "Enter reading value"
          }
        />
        <p className="mt-1 text-xs text-gray-600">
          {isIncreasing && lastReading 
            ? `Must be greater than or equal to ${lastReading.toFixed(2)}` 
            : "Enter any positive value"}
        </p>
      </div>

      <div>
        <label htmlFor="recordedAt" className="block text-sm font-medium text-gray-700">
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="recordedAt"
          name="recordedAt"
          defaultValue={defaultDateTime}
          required
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Reading submitted successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-1.5">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Reading"
        )}
      </button>
    </form>
  );
}
