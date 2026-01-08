import { prisma } from "@/lib/prisma";
import { CreateMeterForm } from "@/components/forms/create-meter-form";
import { AdminMetersList } from "@/components/meters/admin-meters-list";

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

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Meters</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage meter assignments and view meter details
          </p>
        </div>
        <CreateMeterForm />
      </div>

      <AdminMetersList meters={meters} readers={readers} />
    </section>
  );
}


