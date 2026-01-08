"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function updatePassword(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const data = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validation = passwordSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!isValid) {
    return { error: "Current password is incorrect" };
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newPasswordHash },
  });

  revalidatePath("/profile");
  return { success: true };
}

const contactSchema = z.object({
  contactNumber: z.string().min(10).max(20),
});

export async function updateContact(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const data = {
    contactNumber: formData.get("contactNumber") as string,
  };

  const validation = contactSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { contactNumber: data.contactNumber },
  });

  revalidatePath("/profile");
  return { success: true };
}
