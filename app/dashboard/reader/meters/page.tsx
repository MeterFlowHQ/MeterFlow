import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ReadingForm } from "@/components/forms/reading-form";

export default async function ReaderMetersPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const assignedMeters = await prisma.meter.findMany({
    where: { assignedUserId: session.user.id },
    include: {
      readings: {
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
  });

  if (assignedMeters.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">My Meters</h1>
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">No meters assigned to you yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Contact your administrator to get meters assigned.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Meters</h1>
        <p className="mt-1 text-sm text-gray-600">
          {assignedMeters.length} meter{assignedMeters.length !== 1 ? "s" : ""} assigned to you
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignedMeters.map((meter) => {
          const lastReading = meter.readings[0];
          return (
            <div
              key={meter.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{meter.meterCode}</h3>
                  <p className="mt-1 text-sm text-gray-600">{meter.location}</p>
                </div>
                <Link
                  href={`/meters/${meter.id}`}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View Details →
                </Link>
              </div>

              <ReadingForm
                meterId={meter.id}
                meterCode={meter.meterCode}
                lastReading={lastReading ? Number(lastReading.readingValue) : undefined}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

