"use client";

import { useActionState, useState } from "react";
import { assignMeter } from "@/app/admin/users/actions";
import { Toast } from "@/components/ui/toast";

interface QuickAssignFormProps {
  meterId: string;
  readers: Array<{ id: string; name: string; email: string }>;
}

export function QuickAssignForm({ meterId, readers }: QuickAssignFormProps) {
  const [state, action, isPending] = useActionState(assignMeter, undefined);
  const [showToast, setShowToast] = useState(false);

  // Show toast when state changes to success
  if (state?.success && !showToast) {
    setShowToast(true);
  }

  return (
    <>
      <form action={action} className="flex items-center gap-2">
        <input type="hidden" name="meterId" value={meterId} />
        <select
          name="userId"
          className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-none"
          required
        >
          <option value="">Assign to...</option>
          {readers.map((reader) => (
            <option key={reader.id} value={reader.id}>
              {reader.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Assigning
            </span>
          ) : (
            "Assign"
          )}
        </button>
      </form>

      <Toast
        show={showToast && !!state?.success}
        title="Meter Assigned Successfully"
        message={`${state?.meterCode || ''} assigned to ${state?.userName || ''}`}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
