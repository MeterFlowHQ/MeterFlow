import { notFound } from "next/navigation";
import Link from "next/link";
import { getMeterAnalytics } from "@/lib/analytics";
import { ReadingLineChart, ConsumptionBarChart } from "@/components/charts";

interface MeterDetailPageProps {
  params: Promise<{ meterId: string }>;
}

export default async function MeterDetailPage({ params }: MeterDetailPageProps) {
  const { meterId } = await params;
  const analytics = await getMeterAnalytics(meterId);

  if (!analytics) {
    notFound();
  }

  const { meter, readings, stats } = analytics;

  return (
    <section className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/admin/meters"
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Meters
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{meter.meterCode}</h1>
          <p className="mt-1 text-sm text-gray-600">{meter.location}</p>
          {meter.assignedUser && (
            <p className="mt-2 text-sm text-gray-600">
              Assigned to: <span className="font-medium text-gray-900">{meter.assignedUser.name}</span>
            </p>
          )}
        </div>
        <a
          href={`/api/export?meterId=${meterId}`}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Export Meter Data
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Total Readings</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalReadings}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Latest Reading</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.latestReading ? Number(stats.latestReading).toFixed(2) : "—"}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Total Consumption</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalConsumption.toFixed(2)}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Avg Daily Usage</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.avgDailyConsumption.toFixed(2)}</p>
        </div>
      </div>

      {/* Reading Trend Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Reading History</h2>
        <ReadingLineChart
          data={readings.map((r) => ({
            date: r.recordedAt,
            value: r.value,
          }))}
        />
      </div>

      {/* Consumption Chart */}
      {readings.length > 1 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Consumption Analysis</h2>
          <ConsumptionBarChart
            data={readings.map((r) => ({
              date: r.recordedAt,
              delta: r.delta,
            }))}
          />
        </div>
      )}

      {/* Recent Readings Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Readings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-gray-600">
              <tr>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Reading Value</th>
                <th className="pb-3 pr-4">Delta</th>
                <th className="pb-3 pr-4">Daily Avg</th>
                <th className="pb-3 pr-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {readings.slice(-10).reverse().map((reading) => (
                <tr key={reading.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 text-gray-900">
                    {reading.recordedAt.toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 font-medium text-gray-900">{reading.value.toFixed(2)}</td>
                  <td className={`py-3 pr-4 font-medium ${reading.delta > 0 ? "text-green-600" : "text-gray-400"}`}>
                    {reading.delta > 0 ? `+${reading.delta.toFixed(2)}` : "—"}
                  </td>
                  <td className="py-3 pr-4 text-gray-600">
                    {reading.dailyAverage > 0 ? reading.dailyAverage.toFixed(2) : "—"}
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{reading.recordedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
