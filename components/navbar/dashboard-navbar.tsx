"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { handleSignOut } from "./actions";
import { ROLES } from "@/lib/constants";

interface DashboardNavbarProps {
  user: {
    email?: string | null;
    role?: string;
  };
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href={user.role === ROLES.ADMIN ? "/dashboard/admin" : "/dashboard/reader"} className="flex items-center gap-2">
              <Image 
                src="/Meterflow-icon.png" 
                alt="Meterflow Logo" 
                width={32} 
                height={32}
                className="h-8 w-8"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-emerald-600">MeterFlow</span>
                <span className="hidden text-xs text-gray-600 sm:block">{user.email}</span>
              </div>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {user.role === ROLES.ADMIN && (
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
              {user.role === ROLES.READER && (
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
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/profile" 
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Profile
            </Link>
            <form action={handleSignOut}>
              <button 
                type="submit" 
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                Sign Out
              </button>
            </form>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 border-t border-gray-200 pt-4">
            <div className="mb-3 pb-3 border-b border-gray-200">
              <p className="text-sm text-gray-600 px-2">{user.email}</p>
            </div>
            <nav className="flex flex-col space-y-1">
              {user.role === ROLES.ADMIN && (
                <>
                  <Link 
                    href="/dashboard/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/admin/analytics" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Analytics
                  </Link>
                  <Link 
                    href="/dashboard/admin/meters" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Meters
                  </Link>
                  <Link 
                    href="/dashboard/admin/readings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Readings
                  </Link>
                  <Link 
                    href="/dashboard/admin/users" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Users
                  </Link>
                </>
              )}
              {user.role === ROLES.READER && (
                <>
                  <Link 
                    href="/dashboard/reader" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/reader/meters" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    My Meters
                  </Link>
                  <Link 
                    href="/dashboard/reader/readings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    My Readings
                  </Link>
                </>
              )}
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                <Link 
                  href="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Profile
                </Link>
                <form action={handleSignOut}>
                  <button 
                    type="submit" 
                    className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
