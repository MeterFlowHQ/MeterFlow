import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PasswordForm } from "./password-form";
import { ContactForm } from "./contact-form";
import { ImageUploadForm } from "./image-upload-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      contactNumber: true,
      profileImageUrl: true,
    },
  });

  if (!user) return null;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>

      {/* Profile Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-900">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Image Upload */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile Picture</h2>
        <ImageUploadForm currentImage={user.profileImageUrl} />
      </div>

      {/* Contact Number */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Contact Information</h2>
        <ContactForm currentContact={user.contactNumber || ""} />
      </div>

      {/* Password Change */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Change Password</h2>
        <PasswordForm />
      </div>
    </section>
  );
}
