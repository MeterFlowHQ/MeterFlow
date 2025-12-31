import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Meterflow</span>
            <span className="text-xs text-gray-600">{session.user.email}</span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link href="/dashboard/admin" className="hover:text-emerald-600">
              Admin
            </Link>
            <Link href="/dashboard/reader" className="hover:text-emerald-600">
              Reader
            </Link>
            <Link href="/profile" className="hover:text-emerald-600">
              Profile
            </Link>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}>
              <button type="submit" className="hover:text-emerald-600">
                Sign Out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
