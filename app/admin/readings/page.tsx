import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminReadingsPage() {
  const readings = await prisma.meterReading.findMany({
    orderBy: { recordedAt: "desc" },
    take: 100,
    include: {
      meter: {
        select: { meterCode: true, location: true },
      },
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const totalReadings = await prisma.meterReading.count();

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">All Readings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Showing latest 100 of {totalReadings} total readings
          </p>
        </div>
        <a
          href="/api/export"
          className="w-full sm:w-auto text-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Export All
        </a>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">Date & Time</th>
                <th className="px-6 py-3">Meter Code</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Reading Value</th>
                <th className="px-6 py-3">Recorded By</th>
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
                  <td className="px-6 py-4 text-gray-600">
                    <div>{reading.user.name}</div>
                    <div className="text-xs text-gray-500">{reading.user.email}</div>
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
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
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
              
              <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-3">
                <div>
                  <p className="text-xs text-gray-500">Recorded By</p>
                  <p className="font-medium text-gray-900">{reading.user.name}</p>
                  <p className="text-xs text-gray-500">{reading.user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(reading.recordedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(reading.recordedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <Link
                href={`/meters/${reading.meterId}`}
                className="block text-center rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
              >
                View Meter
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

