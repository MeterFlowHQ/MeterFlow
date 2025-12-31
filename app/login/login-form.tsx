"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

type FormState = { error: string; email?: string } | undefined;
type LoginAction = (prevState: FormState, formData: FormData) => Promise<FormState>;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Signing in..." : "Continue"}
    </button>
  );
}

export default function LoginForm({ login }: { login: LoginAction }) {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <>
      {state?.error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-100">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={state?.email || ""}
            className="w-full rounded-lg border border-emerald-600/30 bg-emerald-950/20 px-3 py-2 text-sm text-white outline-none ring-0 transition focus:border-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-100">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-emerald-600/30 bg-emerald-950/20 px-3 py-2 text-sm text-white outline-none ring-0 transition focus:border-emerald-500"
          />
        </div>
        <SubmitButton />
      </form>
    </>
  );
}
