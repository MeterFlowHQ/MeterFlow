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
        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? "..." : "Delete"}
      </button>
      {state?.error && <span className="ml-2 text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
