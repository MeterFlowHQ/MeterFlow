"use client";

import { useActionState } from "react";
import { unassignMeter } from "@/app/admin/users/actions";

interface UnassignMeterButtonProps {
  meterId: string;
  meterCode: string;
}

export function UnassignMeterButton({ meterId, meterCode }: UnassignMeterButtonProps) {
  const [state, action, isPending] = useActionState(unassignMeter, undefined);

  return (
    <form action={action} className="inline">
      <input type="hidden" name="meterId" value={meterId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!confirm(`Unassign meter ${meterCode}?`)) {
            e.preventDefault();
          }
        }}
        className="text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? "..." : "Unassign"}
      </button>
      {state?.error && <span className="ml-2 text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
