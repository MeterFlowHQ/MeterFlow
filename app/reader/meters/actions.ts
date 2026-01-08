"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const readingSchema = z.object({
  meterId: z.string().uuid(),
  readingValue: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Reading value must be a positive number",
  }),
  recordedAt: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, {
    message: "Invalid date/time format",
  }),
});

export async function submitReading(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const data = {
    meterId: formData.get("meterId") as string,
    readingValue: formData.get("readingValue") as string,
    recordedAt: formData.get("recordedAt") as string,
  };

  const validation = readingSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Check if meter is assigned to this user
  const meter = await prisma.meter.findFirst({
    where: {
      id: data.meterId,
      assignedUserId: session.user.id,
    },
  });

  if (!meter) {
    return { error: "You are not assigned to this meter" };
  }

  // Get the last reading to validate (only for INCREASING type meters)
  const lastReading = await prisma.meterReading.findFirst({
    where: { meterId: data.meterId },
    orderBy: { recordedAt: "desc" },
  });

  const newValue = Number(data.readingValue);
  
  // Only validate increasing values for INCREASING type meters
  if (meter.readingType === "INCREASING" && lastReading && newValue < Number(lastReading.readingValue)) {
    return { error: "Reading value cannot be less than the previous reading" };
  }

  // Create the reading
  await prisma.meterReading.create({
    data: {
      meterId: data.meterId,
      userId: session.user.id,
      readingValue: newValue,
      recordedAt: new Date(data.recordedAt),
    },
  });

  revalidatePath("/reader/meters");
  revalidatePath("/reader/readings");
  return { success: true };
}
