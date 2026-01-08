import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ReaderReadingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const readings = await prisma.meterReading.findMany({
    where: { userId: session.user.id },
    orderBy: { recordedAt: "desc" },
    take: 50,
    include: {
      meter: {
        select: { meterCode: true, location: true },
      },
    },
  });

  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">My Readings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Your recent meter readings (last 50)
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-lg border border-gray-200 bg-white shadow-sm">
        {readings.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>No readings submitted yet.</p>
            <Link
              href="/reader/meters"
              className="mt-2 inline-block text-sm text-emerald-600 hover:text-emerald-700"
            >
              Go to My Meters to submit readings →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Meter Code</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Reading Value</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {readings.map((reading) => (
                  <tr key={reading.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(reading.recordedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {reading.meter.meterCode}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {reading.meter.location}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {Number(reading.readingValue).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/meters/${reading.meterId}`}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        View Meter
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {readings.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600 sm:p-8">
            <p>No readings submitted yet.</p>
            <Link
              href="/reader/meters"
              className="mt-2 inline-block text-sm text-emerald-600 hover:text-emerald-700"
            >
              Go to My Meters to submit readings →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {readings.map((reading) => (
              <div key={reading.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{reading.meter.meterCode}</p>
                      <p className="text-sm text-gray-600 truncate">{reading.meter.location}</p>
                    </div>
                    <span className="ml-2 text-lg font-semibold text-emerald-600 flex-shrink-0">
                      {Number(reading.readingValue).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-xs text-gray-500">Recorded At</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(reading.recordedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(reading.recordedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Link
                      href={`/meters/${reading.meterId}`}
                      className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
                    >
                      View Meter
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

