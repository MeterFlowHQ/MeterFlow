import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (session?.user) {
    redirect("/dashboard/reader");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="space-y-6">
          <span className="inline-flex w-fit items-center gap-3 rounded-full bg-emerald-600/20 px-4 py-2 text-base font-semibold uppercase tracking-wide text-emerald-300">
            <Image 
              src="/Meterflow-icon.png" 
              alt="Meterflow Logo" 
              width={28} 
              height={28}
              className="h-7 w-7"
            />
            Meterflow
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Meter Reading Management System for secure field operations
          </h1>
          <p className="max-w-3xl text-lg text-gray-300">
            Admins manage meters, assignments, analytics, and exports. Field readers submit accurate, validated readings from the meters they are assigned.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Log in to dashboard
            </Link>
            <Link
              href="/dashboard/admin/analytics"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-600/30 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500 hover:bg-emerald-600/10"
            >
              View analytics layout
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-600/20 bg-emerald-950/20 p-6 shadow-lg">
            <h2 className="text-lg font-semibold">RBAC-first security</h2>
            <p className="mt-2 text-sm text-gray-300">
              Auth.js v5 with bcrypt credential login, middleware-enforced roles, and server-side authorization on every API.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-600/20 bg-emerald-950/20 p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Operational analytics</h2>
            <p className="mt-2 text-sm text-gray-300">
              Meter-level trends, reader productivity, and exports to Excel built with server actions and Recharts.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-600/20 bg-emerald-950/20 p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Field-ready uploads</h2>
            <p className="mt-2 text-sm text-gray-300">
              Local-file upload abstraction ready for S3, profile images, and data validation for every reading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
