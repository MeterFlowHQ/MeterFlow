import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { QuickAssignForm } from "./quick-assign-form";
import { UnassignMeterButton } from "../users/[userId]/unassign-meter-button";

export default async function AdminMetersPage() {
  const meters = await prisma.meter.findMany({
    include: {
      assignedUser: {
        select: { name: true, email: true },
      },
      _count: {
        select: { readings: true },
      },
    },
    orderBy: { meterCode: "asc" },
  });

  // Get all readers for assignment dropdown
  const readers = await prisma.user.findMany({
    where: { role: "READER" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  const totalMeters = meters.length;
  const assignedMeters = meters.filter((m) => m.assignedUserId).length;
  const unassignedMeters = totalMeters - assignedMeters;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Meters</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage meter assignments and view meter details
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Total Meters</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{totalMeters}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Assigned</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{assignedMeters}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600">Unassigned</p>
          <p className="mt-2 text-2xl font-semibold text-gray-600">{unassignedMeters}</p>
        </div>
      </div>

      {/* Meters List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">Meter Code</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Readings</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {meters.map((meter) => (
                <tr key={meter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {meter.meterCode}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{meter.location}</td>
                  <td className="px-6 py-4">
                    {meter.assignedUser ? (
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium text-gray-900">
                            {meter.assignedUser.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {meter.assignedUser.email}
                          </div>
                        </div>
                        <UnassignMeterButton
                          meterId={meter.id}
                          meterCode={meter.meterCode}
                        />
                      </div>
                    ) : (
                      <QuickAssignForm meterId={meter.id} readers={readers} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{meter._count.readings}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/meters/${meter.id}`}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      View Details
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


