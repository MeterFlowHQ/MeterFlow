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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Readings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Showing latest 100 of {totalReadings} total readings
          </p>
        </div>
        <a
          href="/api/export"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Export All
        </a>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
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
    </section>
  );
}

