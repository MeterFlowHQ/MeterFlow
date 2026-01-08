import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";

type RecentReading = Prisma.MeterReadingGetPayload<{
  include: {
    meter: { select: { meterCode: true } };
    user: { select: { name: true } };
  };
}>;

export default async function AdminHomePage() {
  const session = await auth();

  const [totalMeters, totalReadings, totalUsers, recentReadings] = await Promise.all([
    prisma.meter.count(),
    prisma.meterReading.count(),
    prisma.user.count({ where: { role: "READER" } }),
    prisma.meterReading.findMany({
      orderBy: { recordedAt: "desc" },
      take: 5,
      include: {
        meter: { select: { meterCode: true } },
        user: { select: { name: true } },
      },
    }),
  ]);

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Welcome, {session?.user.name || session?.user.email}</p>
        </div>
        <span className="self-start rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 sm:self-auto">
          {session?.user.role}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <Link
          href="/dashboard/admin/meters"
          className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6"
        >
          <p className="text-sm font-medium text-gray-600">Total Meters</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">{totalMeters}</p>
          <p className="mt-2 text-sm text-emerald-600 group-hover:text-emerald-700">
            Manage meters →
          </p>
        </Link>

        <Link
          href="/dashboard/admin/readings"
          className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6"
        >
          <p className="text-sm font-medium text-gray-600">Total Readings</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">{totalReadings}</p>
          <p className="mt-2 text-sm text-emerald-600 group-hover:text-emerald-700">
            View all readings →
          </p>
        </Link>

        <Link
          href="/dashboard/admin/users"
          className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6"
        >
          <p className="text-sm font-medium text-gray-600">Active Readers</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">{totalUsers}</p>
          <p className="mt-2 text-sm text-emerald-600 group-hover:text-emerald-700">
            Manage users →
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">Recent Readings</h2>
          {recentReadings.length > 0 ? (
            <div className="space-y-3">
              {recentReadings.map((reading: RecentReading) => (
                <div
                  key={reading.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{reading.meter.meterCode}</p>
                    <p className="truncate text-sm text-gray-600">{reading.user.name}</p>
                  </div>
                  <div className="ml-4 text-right flex-shrink-0">
                    <p className="font-semibold text-emerald-600">
                      {Number(reading.readingValue).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(reading.recordedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No readings yet</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/admin/analytics"
              className="block rounded-lg border border-gray-200 p-3 transition hover:border-emerald-200 hover:bg-emerald-50 sm:p-4"
            >
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="mt-1 text-sm text-gray-600">Analyze readings and performance</p>
            </Link>
            <Link
              href="/api/export"
              className="block rounded-lg border border-gray-200 p-3 transition hover:border-emerald-200 hover:bg-emerald-50 sm:p-4"
            >
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="mt-1 text-sm text-gray-600">Download readings to Excel</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:p-6">
        <h3 className="font-semibold text-emerald-900">System Overview</h3>
        <p className="mt-2 text-sm text-emerald-700">
          Manage users, meters, readings, and view comprehensive analytics. All operations are secured with role-based access control.
        </p>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-emerald-700">
          <li>Assign meters to field readers for data collection</li>
          <li>Monitor reading submission patterns and trends</li>
          <li>Export filtered data for external analysis</li>
          <li>Track reader performance and productivity</li>
        </ul>
      </div>
    </section>
  );
}

