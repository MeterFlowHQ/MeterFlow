import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard/admin",
  });
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-emerald-600/20 bg-emerald-950/30 p-8 text-white shadow-xl">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Meterflow</p>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-gray-300">Use the credentials provided by your administrator.</p>
        </div>
        <form action={login} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-100">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
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
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
