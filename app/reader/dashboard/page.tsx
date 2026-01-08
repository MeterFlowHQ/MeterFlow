import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ReaderHomePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const assignedMetersCount = await prisma.meter.count({
    where: { assignedUserId: session.user.id },
  });

  const totalReadings = await prisma.meterReading.count({
    where: { userId: session.user.id },
  });

  const recentReadings = await prisma.meterReading.findMany({
    where: { userId: session.user.id },
    orderBy: { recordedAt: "desc" },
    take: 5,
    include: {
      meter: {
        select: { meterCode: true, location: true },
      },
    },
  });

  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Reader Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-gray-600">Assigned Meters</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600 sm:text-3xl">{assignedMetersCount}</p>
          <Link
            href="/reader/meters"
            className="mt-2 inline-block text-sm text-emerald-600 hover:text-emerald-700"
          >
            View my meters →
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-gray-600">Total Readings Submitted</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">{totalReadings}</p>
          <Link
            href="/reader/readings"
            className="mt-2 inline-block text-sm text-emerald-600 hover:text-emerald-700"
          >
            View history →
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {recentReadings.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">Recent Submissions</h2>
          <div className="space-y-3">
            {recentReadings.map((reading) => (
              <div
                key={reading.id}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{reading.meter.meterCode}</p>
                  <p className="text-sm text-gray-600 truncate">{reading.meter.location}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
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
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:p-6">
        <h3 className="font-semibold text-emerald-900">Quick Start</h3>
        <p className="mt-2 text-sm text-emerald-700">
          Submit readings for your assigned meters and track your submission history.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/reader/meters"
            className="text-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Submit Reading
          </Link>
          <Link
            href="/reader/readings"
            className="text-center rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
          >
            View History
          </Link>
        </div>
      </div>
    </section>
  );
}

