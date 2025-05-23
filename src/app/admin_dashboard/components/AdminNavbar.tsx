"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

// Navigation links as an array
const adminLinks = [
  // { href: "/admin_dashboard", label: "Dashboard" },
  { href: "/admin_dashboard/users", label: "Users" },
  { href: "/admin_dashboard/plans", label: "Plans" },
  { href: "/admin_dashboard/deposits", label: "Deposits" },
  { href: "/admin_dashboard/investments", label: "Investments" },
  { href: "/admin_dashboard/withdrawals", label: "Withdrawals" },
  // { href: "/admin_dashboard/settings", label: "Settings" },
];

export default function AdminNavbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="flex justify-between py-2 px-4 w-full bg-card shadow-lg border-r-2 border-border overflow-auto">
      <nav className="flex gap-3">
        <Link href="/" className="font-bold text-accent text-2xl">
          INVESTIUM
        </Link>
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="w-full py-2 px-3 text-sm text-heading font-semibold rounded transition duration-200 hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="py-2 cursor-pointer px-3 text-sm ml-4 bg-error hover:bg-red-600 text-white font-semibold rounded transition duration-200"
      >
        Logout
      </button>
    </aside>
  );
}
