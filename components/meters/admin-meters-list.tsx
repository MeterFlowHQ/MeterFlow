"use client";

import { useState } from "react";
import Link from "next/link";
import { QuickAssignForm } from "@/components/forms/quick-assign-form";
import { StatCard } from "@/components/cards/stat-card";
import { UnassignMeterButton } from "@/components/buttons/unassign-meter-button";
import { MeterActionsDropdown } from "@/components/buttons/meter-actions-dropdown";

type MeterFilter = "all" | "assigned" | "unassigned";
type MeterStatus = "ENABLED" | "DISABLED" | "NOT_WORKING";

interface Meter {
  id: string;
  meterCode: string;
  location: string;
  status: MeterStatus;
  assignedUserId: string | null;
  assignedUser: {
    name: string;
    email: string;
  } | null;
  _count: {
    readings: number;
  };
}

interface Reader {
  id: string;
  name: string;
  email: string;
}

interface AdminMetersListProps {
  meters: Meter[];
  readers: Reader[];
}

export function AdminMetersList({ meters, readers }: AdminMetersListProps) {
  const [filter, setFilter] = useState<MeterFilter>("all");

  const totalMeters = meters.length;
  const assignedMeters = meters.filter((m) => m.assignedUserId).length;
  const unassignedMeters = totalMeters - assignedMeters;

  // Filter meters based on selected filter
  const filteredMeters = meters.filter((meter) => {
    if (filter === "assigned") return meter.assignedUserId !== null;
    if (filter === "unassigned") return meter.assignedUserId === null;
    return true; // "all"
  });

  return (
    <>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => setFilter("all")}
          className="text-left transition hover:scale-105"
        >
          <StatCard
            label="Total Meters"
            value={totalMeters}
            isActive={filter === "all"}
          />
        </button>
        <button
          onClick={() => setFilter("assigned")}
          className="text-left transition hover:scale-105"
        >
          <StatCard
            label="Assigned"
            value={assignedMeters}
            valueClassName="text-emerald-600"
            isActive={filter === "assigned"}
          />
        </button>
        <button
          onClick={() => setFilter("unassigned")}
          className="text-left transition hover:scale-105"
        >
          <StatCard
            label="Unassigned"
            value={unassignedMeters}
            valueClassName="text-gray-600"
            isActive={filter === "unassigned"}
          />
        </button>
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
              {filteredMeters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No meters found
                  </td>
                </tr>
              ) : (
                filteredMeters.map((meter) => (
                  <tr key={meter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{meter.meterCode}</span>
                        {meter.status === "DISABLED" && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            Disabled
                          </span>
                        )}
                        {meter.status === "NOT_WORKING" && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            Not Working
                          </span>
                        )}
                      </div>
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
                      ) : meter.status === "ENABLED" ? (
                        <QuickAssignForm meterId={meter.id} readers={readers} />
                      ) : (
                        <span className="text-sm text-gray-400">Not available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{meter._count.readings}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MeterActionsDropdown meter={meter} />
                        <Link
                          href={`/meters/${meter.id}`}
                          className="inline-flex items-center rounded-md border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
