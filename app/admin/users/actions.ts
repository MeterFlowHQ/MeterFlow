"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "READER"]),
  contactNumber: z.string().optional(),
  temporaryPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function createUser(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== ROLES.ADMIN) {
    return { error: "Unauthorized" };
  }

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
    contactNumber: formData.get("contactNumber") as string,
    temporaryPassword: formData.get("temporaryPassword") as string,
  };

  const validation = createUserSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return { error: "User with this email already exists" };
  }

  // Hash the temporary password
  const passwordHash = await bcrypt.hash(data.temporaryPassword, 10);

  // Create the user
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role as "ADMIN" | "READER",
      passwordHash,
      contactNumber: data.contactNumber || null,
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["ADMIN", "READER"]),
});

export async function updateUserRole(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== ROLES.ADMIN) {
    return { error: "Unauthorized" };
  }

  const data = {
    userId: formData.get("userId") as string,
    role: formData.get("role") as string,
  };

  const validation = updateUserRoleSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Prevent admin from changing their own role
  if (data.userId === session.user.id) {
    return { error: "You cannot change your own role" };
  }

  await prisma.user.update({
    where: { id: data.userId },
    data: { role: data.role as "ADMIN" | "READER" },
  });

  // Get user name for the success message
  const updatedUser = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { name: true },
  });

  revalidatePath("/admin/users");
  return { 
    success: true, 
    userName: updatedUser?.name, 
    newRole: data.role 
  };
  return { success: true };
}

const assignMeterSchema = z.object({
  meterId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function assignMeter(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== ROLES.ADMIN) {
    return { error: "Unauthorized" };
  }

  const data = {
    meterId: formData.get("meterId") as string,
    userId: formData.get("userId") as string,
  };

  const validation = assignMeterSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  await prisma.meter.update({
    where: { id: data.meterId },
    data: { assignedUserId: data.userId },
  });

  // Get user and meter details for success message
  const [user, meter] = await Promise.all([
    prisma.user.findUnique({
      where: { id: data.userId },
      select: { name: true },
    }),
    prisma.meter.findUnique({
      where: { id: data.meterId },
      select: { meterCode: true },
    }),
  ]);

  revalidatePath("/admin/meters");
  revalidatePath("/admin/users");
  return { 
    success: true, 
    userName: user?.name, 
    meterCode: meter?.meterCode 
  };
}

export async function unassignMeter(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== ROLES.ADMIN) {
    return { error: "Unauthorized" };
  }

  const meterId = formData.get("meterId") as string;

  if (!meterId) {
    return { error: "Meter ID is required" };
  }

  await prisma.meter.update({
    where: { id: meterId },
    data: { assignedUserId: null },
  });

  revalidatePath("/admin/meters");
  revalidatePath("/admin/users");
  return { success: true };
}
