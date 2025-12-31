"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type MeterStatus = "ENABLED" | "DISABLED" | "NOT_WORKING";

const meterSchema = z.object({
  meterCode: z.string().min(1, "Meter code is required").max(50),
  location: z.string().min(1, "Location is required").max(200),
  status: z.enum(["ENABLED", "DISABLED", "NOT_WORKING"]).optional(),
});

export async function createMeter(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const data = {
    meterCode: formData.get("meterCode") as string,
    location: formData.get("location") as string,
    status: (formData.get("status") as MeterStatus) || "ENABLED" as MeterStatus,
  };

  const validation = meterSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Check if meter code already exists
  const existingMeter = await prisma.meter.findUnique({
    where: { meterCode: data.meterCode },
  });

  if (existingMeter) {
    return { error: "Meter code already exists" };
  }

  await prisma.meter.create({
    data: {
      meterCode: data.meterCode,
      location: data.location,
      status: data.status,
    },
  });

  revalidatePath("/dashboard/admin/meters");
  return { success: true };
}

export async function updateMeter(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const meterId = formData.get("meterId") as string;
  const data = {
    meterCode: formData.get("meterCode") as string,
    location: formData.get("location") as string,
    status: formData.get("status") as MeterStatus,
  };

  const validation = meterSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Check if updating meter code would conflict with another meter
  const existingMeter = await prisma.meter.findFirst({
    where: {
      meterCode: data.meterCode,
      NOT: { id: meterId },
    },
  });

  if (existingMeter) {
    return { error: "Meter code already exists" };
  }

  await prisma.meter.update({
    where: { id: meterId },
    data: {
      meterCode: data.meterCode,
      location: data.location,
      status: data.status,
    },
  });

  revalidatePath("/dashboard/admin/meters");
  return { success: true };
}

export async function deleteMeter(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const meterId = formData.get("meterId") as string;

  // Check if meter has readings
  const meterWithReadings = await prisma.meter.findUnique({
    where: { id: meterId },
    include: {
      _count: {
        select: { readings: true },
      },
    },
  });

  if (!meterWithReadings) {
    return { error: "Meter not found" };
  }

  if (meterWithReadings._count.readings > 0) {
    return { error: "Cannot delete meter with existing readings" };
  }

  await prisma.meter.delete({
    where: { id: meterId },
  });

  revalidatePath("/dashboard/admin/meters");
  return { success: true };
}
