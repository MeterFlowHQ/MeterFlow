import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";

interface DashboardNavbarProps {
  user: {
    email?: string | null;
    role?: string;
  };
}

export async function DashboardNavbar({ user }: DashboardNavbarProps) {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="/Meterflow-icon.png" 
                alt="Meterflow Logo" 
                width={32} 
                height={32}
                className="h-8 w-8"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-emerald-600">Meterflow</span>
                <span className="text-xs text-gray-600">{user.email}</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {user.role === "ADMIN" && (
                <>
                  <Link 
                    href="/dashboard/admin" 
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/admin/analytics" 
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Analytics
                  </Link>
                  <Link 
                    href="/dashboard/admin/meters" 
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Meters
                  </Link>
                  <Link 
                    href="/dashboard/admin/readings" 
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Readings
                  </Link>
                  <Link 
                    href="/dashboard/admin/users" 
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Users
                  </Link>
                </>
              )}
              {user.role === "READER" && (
                <>
                  <Link 
                    href="/dashboard/reader" 
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/reader/meters" 
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    My Meters
                  </Link>
                  <Link 
                    href="/dashboard/reader/readings" 
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    My Readings
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/profile" 
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Profile
            </Link>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
              <button 
                type="submit" 
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
