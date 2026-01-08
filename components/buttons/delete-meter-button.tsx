"use client";

import { useActionState } from "react";
import { deleteMeter } from "@/app/admin/meters/actions";

interface DeleteMeterButtonProps {
  meterId: string;
  meterCode: string;
  hasReadings: boolean;
}

export function DeleteMeterButton({ meterId, meterCode, hasReadings }: DeleteMeterButtonProps) {
  const [state, action, isPending] = useActionState(deleteMeter, undefined);

  if (hasReadings) {
    return (
      <span className="text-xs text-gray-400" title="Cannot delete meter with readings">
        Delete
      </span>
    );
  }

  return (
    <form action={action} className="inline">
      <input type="hidden" name="meterId" value={meterId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!confirm(`Are you sure you want to delete meter ${meterCode}? This action cannot be undone.`)) {
            e.preventDefault();
          }
        }}
        className="text-sm text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Deleting
          </span>
        ) : (
          "Delete"
        )}
      </button>
      {state?.error && <span className="ml-2 text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
