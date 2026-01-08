import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLES } from "@/lib/constants";
import { DashboardNavbar } from "@/components/navbar/dashboard-navbar";

export default async function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === ROLES.ADMIN) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DashboardNavbar user={session.user} />
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">{children}</main>
    </div>
  );
}
