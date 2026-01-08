import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PasswordForm } from "./password-form";
import { ContactForm } from "./contact-form";

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

  const dashboardUrl = session.user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/reader";

  return (
    <section className="space-y-6">
      <div className="mb-6">
        <Link
          href={dashboardUrl}
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-base text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Info Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-emerald-50"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-semibold text-emerald-700 ring-4 ring-emerald-50">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{user.email}</p>
              {user.contactNumber && (
                <p className="mt-1 text-sm text-gray-600">📞 {user.contactNumber}</p>
              )}
              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  {user.role === "ADMIN" ? "Administrator" : "Reader"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Number */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
        </div>
        <div className="p-6">
          <ContactForm currentContact={user.contactNumber || ""} />
        </div>
      </div>

      {/* Password Change */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          <p className="mt-1 text-sm text-gray-600">Update your password to keep your account secure</p>
        </div>
        <div className="p-6">
          <PasswordForm />
        </div>
      </div>
    </section>
  );
}
