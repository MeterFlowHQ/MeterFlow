import { Suspense } from "react";
import { getReadingsAnalytics } from "@/lib/analytics";
import { ReadingLineChart } from "@/components/charts";
import { AnalyticsFilters } from "@/components/forms/analytics-filters";

interface PageProps {
  searchParams: Promise<{
    dateRange?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dateRange = (params.dateRange as "today" | "week" | "month" | "custom") || "month";
  const startDate = params.startDate ? new Date(params.startDate) : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  const analytics = await getReadingsAnalytics({ 
    dateRange, 
    startDate, 
    endDate 
  });

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Analytics Dashboard</h1>
        <a
          href="/api/export"
          className="w-full sm:w-auto text-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Export to Excel
        </a>
      </div>

      {/* Filters */}
      <AnalyticsFilters />

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-gray-600">Total Readings</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">{analytics.totalReadings}</p>
          <p className="mt-1 text-xs text-gray-600">
            {analytics.dateRange.from.toLocaleDateString()} - {analytics.dateRange.to.toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-gray-600">Active Meters</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">{analytics.readingsByMeter.length}</p>
          <p className="mt-1 text-xs text-gray-600">With readings this period</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-gray-600">Active Readers</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">{analytics.readerPerformance.length}</p>
          <p className="mt-1 text-xs text-gray-600">Submitted readings</p>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">Readings Over Time</h2>
        <Suspense fallback={<div className="h-[300px] animate-pulse bg-gray-50" />}>
          <ReadingLineChart
            data={analytics.readingsByDay.map((d) => ({
              date: d.date,
              value: d.count,
            }))}
          />
        </Suspense>
      </div>

      {/* Meter Performance */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">Readings by Meter</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-gray-600">
              <tr>
                <th className="pb-3 pr-4 pl-4 sm:pl-0">Meter Code</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Readings</th>
                <th className="pb-3 pr-4">Avg Reading</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.readingsByMeter.map((meter) => (
                <tr key={meter.meterId} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 pl-4 sm:pl-0 font-medium text-gray-900">{meter.meterCode}</td>
                  <td className="py-3 pr-4 text-gray-600">{meter.location}</td>
                  <td className="py-3 pr-4 text-gray-900">{meter.count}</td>
                  <td className="py-3 pr-4 text-gray-900">
                    {meter.avgReading ? Number(meter.avgReading).toFixed(2) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reader Performance */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">Reader Performance</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-gray-600">
              <tr>
                <th className="pb-3 pr-4 pl-4 sm:pl-0">Reader Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Readings Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.readerPerformance.map((reader) => (
                <tr key={reader.userId} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 pl-4 sm:pl-0 font-medium text-gray-900">{reader.userName}</td>
                  <td className="py-3 pr-4 text-gray-600">{reader.userEmail}</td>
                  <td className="py-3 pr-4 text-gray-900">{reader.readingsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
