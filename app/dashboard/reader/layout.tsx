import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ROLES } from "@/lib/constants";

export default async function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === ROLES.ADMIN) redirect("/dashboard/admin");
  return <>{children}</>;
}
