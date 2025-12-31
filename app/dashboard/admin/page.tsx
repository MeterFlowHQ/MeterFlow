import { auth } from "@/auth";

export default async function AdminHomePage() {
  const session = await auth();
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-600">Welcome</p>
          <h1 className="text-2xl font-semibold text-gray-900">Admin overview</h1>
        </div>
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
          {session?.user.role}
        </span>
      </div>
      <p className="text-gray-600">
        Manage users, meters, readings, analytics, and exports from the navigation. Server actions and RBAC will enforce permissions.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Next steps</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-900">
            <li>Implement user CRUD with temporary passwords.</li>
            <li>Assign meters to readers and enforce access.</li>
            <li>Aggregate analytics and Excel export.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Data health</h2>
          <p className="text-sm text-gray-900">
            Add validation to prevent negative readings, capture timestamps, and compute deltas server-side.
          </p>
        </div>
      </div>
    </section>
  );
}
