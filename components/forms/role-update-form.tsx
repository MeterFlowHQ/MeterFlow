"use client";

import { useActionState } from "react";
import { updateUserRole } from "@/app/dashboard/admin/users/actions";

interface RoleUpdateFormProps {
  userId: string;
  currentRole: string;
  userName: string;
}

export function RoleUpdateForm({ userId, currentRole, userName }: RoleUpdateFormProps) {
  const [state, action, isPending] = useActionState(updateUserRole, undefined);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-emerald-600 focus:outline-none"
      >
        <option value="READER">Reader</option>
        <option value="ADMIN">Admin</option>
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending ? "..." : "Update"}
      </button>
      {state?.error && (
        <span className="text-xs text-red-600">{state.error}</span>
      )}
    </form>
  );
}
