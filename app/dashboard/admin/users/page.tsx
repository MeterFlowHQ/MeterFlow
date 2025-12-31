import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { RoleUpdateForm } from "@/components/forms/role-update-form";
import { StatCard } from "@/components/cards/stat-card";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      assignedMeters: {
        where: {
          status: "ENABLED",
        },
        select: {
          id: true,
          meterCode: true,
          location: true,
        },
      },
      _count: {
        select: {
          readings: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const readerCount = users.filter((u) => u.role === "READER").length;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create users, assign roles, and manage meter assignments
          </p>
        </div>
        {/* Create User Form */}
        <CreateUserForm />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Admins" value={adminCount} valueClassName="text-emerald-600" />
        <StatCard label="Readers" value={readerCount} valueClassName="text-gray-600" />
      </div>

     

      {/* Users List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Assigned Meters</th>
                <th className="px-6 py-3">Readings</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <RoleUpdateForm
                      userId={user.id}
                      currentRole={user.role}
                      userName={user.name}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.contactNumber || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {user.assignedMeters.length > 0 ? (
                      <div className="space-y-1">
                        {user.assignedMeters.map((meter) => (
                          <div key={meter.id} className="text-xs">
                            <Link
                              href={`/meters/${meter.id}`}
                              className="font-medium text-emerald-600 hover:text-emerald-700"
                            >
                              {meter.meterCode}
                            </Link>
                            <span className="text-gray-500"> - {meter.location}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{user._count.readings}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/admin/users/${user.id}`}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      Manage
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

