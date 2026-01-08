"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { updateUserRole } from "@/app/admin/users/actions";
import { Toast } from "@/components/ui/toast";
import { ROLES } from "@/lib/constants";

interface RoleUpdateFormProps {
  userId: string;
  currentRole: string;
}

export function RoleUpdateForm({ userId, currentRole }: RoleUpdateFormProps) {
  const [state, action, isPending] = useActionState(updateUserRole, undefined);
  const [showToast, setShowToast] = useState(false);
  const lastSuccessRef = useRef<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      const successKey = `${state.userName}-${state.newRole}`;
      if (lastSuccessRef.current !== successKey) {
        lastSuccessRef.current = successKey;
        // Reset toast first, then show with new data (schedule asynchronously)
        setTimeout(() => {
          setShowToast(false);
          setTimeout(() => setShowToast(true), 50);
        }, 0);
      }
    }
  }, [state]);

  return (
    <>
      <form action={action} className="flex items-center gap-2">
        <input type="hidden" name="userId" value={userId} />
        <select
          key={currentRole}
          name="role"
          defaultValue={currentRole}
          disabled={isPending}
          className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value={ROLES.READER}>Reader</option>
          <option value={ROLES.ADMIN}>Admin</option>
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
              Updating
            </span>
          ) : (
            "Update"
          )}
        </button>
        {state?.error && (
          <span className="text-xs text-red-600">{state.error}</span>
        )}
      </form>

      <Toast
        show={showToast && !!state?.success}
        title="Role Updated Successfully"
        message={`${state?.userName || ''} updated to ${state?.newRole === 'ADMIN' ? 'Admin' : 'Reader'}`}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
