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
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Readings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Your recent meter readings (last 50)
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {readings.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>No readings submitted yet.</p>
            <Link
              href="/dashboard/reader/meters"
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
    </section>
  );
}

