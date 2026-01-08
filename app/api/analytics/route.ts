import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { ROLES } from "@/lib/constants";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== ROLES.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ status: "ok", message: "Analytics placeholder" });
}
