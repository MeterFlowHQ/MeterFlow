import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import LoginForm from "./login-form";

type FormState = { error: string; email?: string } | undefined;

async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  "use server";
  const email = String(formData.get("email") as string | null ?? "");
  const password = String(formData.get("password") as string | null ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const errorMessage = error.cause?.err?.message;
      
      if (errorMessage === "USER_NOT_FOUND") {
        return { error: "User doesn't exist.", email };
      }
      
      if (errorMessage === "INVALID_PASSWORD") {
        return { error: "Password is incorrect.", email };
      }
      
      return { error: "Invalid email or password.", email };
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard/admin");

  const params = await searchParams;
  const urlError = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-3 py-8 sm:px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-emerald-600/20 bg-emerald-950/30 p-6 text-white shadow-xl sm:p-8">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Meterflow</p>
          <h1 className="text-xl font-semibold sm:text-2xl">Sign in</h1>
          <p className="text-sm text-gray-300">Use the credentials provided by your administrator.</p>
        </div>
        {urlError && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {urlError === "CredentialsSignin"
              ? "Invalid email or password."
              : "Something went wrong. Please try again."}
          </div>
        )}
        <LoginForm login={login} />
      </div>
    </div>
  );
}
