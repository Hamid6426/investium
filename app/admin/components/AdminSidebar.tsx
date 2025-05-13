"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminSidebar() {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <aside className="flex flex-col justify-between p-4 h-dvh bg-card w-48 shadow-lg border-r-2 border-border">
      <div className="space-y-6">
        <div className="text-center font-bold text-2xl">INVESTEX</div>
        <nav className="flex flex-col gap-3">
          <Link
            href="/admin/dashboard"
            className="w-full py-2 px-3 text-sm bg-primary text-white font-semibold rounded transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="w-full py-2 px-3 text-sm bg-primary text-white font-semibold rounded transition duration-200"
          >
            Users
          </Link>
          <Link
            href="/admin/settings"
            className="w-full py-2 px-3 text-sm bg-primary text-white font-semibold rounded transition duration-200"
          >
            Settings
          </Link>
        </nav>
      </div>
      <button
        onClick={logout}
        className="w-full py-2 cursor-pointer px-3 text-sm bg-error hover:bg-red-600 text-white font-semibold rounded transition duration-200"
      >
        Logout
      </button>
    </aside>
  );
}
