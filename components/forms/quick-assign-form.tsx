"use client";

import { useActionState, useState } from "react";
import { assignMeter } from "@/app/dashboard/admin/users/actions";
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
          className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {isPending ? "..." : "Assign"}
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
