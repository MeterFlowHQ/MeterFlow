import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AssignMeterForm } from "./assign-meter-form";
import { UnassignMeterButton } from "./unassign-meter-button";

interface PageProps {
  params: { userId: string };
}

export default async function UserManagementPage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      assignedMeters: {
        include: {
          _count: {
            select: { readings: true },
          },
        },
      },
      readings: {
        take: 10,
        orderBy: { recordedAt: "desc" },
        include: {
          meter: {
            select: { meterCode: true, location: true },
          },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Get unassigned meters for the assignment form
  const unassignedMeters = await prisma.meter.findMany({
    where: { assignedUserId: null },
    orderBy: { meterCode: "asc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/users"
          className="text-sm text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">{user.name}</h1>
        <p className="mt-1 text-sm text-gray-600">{user.email}</p>
      </div>

      {/* User Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Role</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm ${
                user.role === "ADMIN"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {user.role}
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Assigned Meters</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {user.assignedMeters.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Total Readings</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{user.readings.length}</p>
        </div>
      </div>

      {/* Assign Meter Form */}
      {user.role === "READER" && unassignedMeters.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Assign Meter</h2>
          <AssignMeterForm userId={user.id} unassignedMeters={unassignedMeters} />
        </div>
      )}

      {/* Assigned Meters */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Assigned Meters</h2>
        </div>
        {user.assignedMeters.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-600">
            No meters assigned yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-6 py-3">Meter Code</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Readings</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {user.assignedMeters.map((meter) => (
                  <tr key={meter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {meter.meterCode}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{meter.location}</td>
                    <td className="px-6 py-4 text-gray-900">{meter._count.readings}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/meters/${meter.id}`}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          View
                        </Link>
                        <UnassignMeterButton meterId={meter.id} meterCode={meter.meterCode} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Readings */}
      {user.readings.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Readings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Meter</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {user.readings.map((reading) => (
                  <tr key={reading.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(reading.recordedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {reading.meter.meterCode}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{reading.meter.location}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {Number(reading.readingValue).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
