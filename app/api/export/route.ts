import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { generateReadingsExport, generateMeterExport } from "@/lib/export";
import { ROLES } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== ROLES.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const meterId = searchParams.get("meterId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const userId = searchParams.get("userId");

  try {
    let buffer: Buffer;
    let filename: string;

    if (meterId) {
      buffer = await generateMeterExport(meterId);
      filename = `meter-${meterId}-${new Date().toISOString().split("T")[0]}.xlsx`;
    } else {
      buffer = await generateReadingsExport({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        userId: userId || undefined,
      });
      filename = `readings-export-${new Date().toISOString().split("T")[0]}.xlsx`;
    }

    return new Response(buffer as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
