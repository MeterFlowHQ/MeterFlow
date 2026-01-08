"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
// Conditional import helper for upload functionality
import type { saveLocalFile as SaveLocalFileType } from "@/lib/uploads/local";

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

export async function uploadProfileImage(
  prevState: { error?: string; success?: boolean; imagePath?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("image") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File too large. Maximum size is 5MB." };
  }

  try {
    // Check if we're in production (Vercel) - file uploads not supported yet
    if (process.env.VERCEL) {
      return { error: "File uploads are not yet configured for production. Please set up cloud storage (Vercel Blob, S3, etc.)" };
    }

    // Import dynamically to avoid build issues
    const { saveLocalFile } = await import("@/lib/uploads/local");
    const imagePath = await saveLocalFile(file);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { profileImageUrl: imagePath },
    });

    revalidatePath("/profile");
    return { success: true, imagePath };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }
}
