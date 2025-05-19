"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // assuming it returns { user, loading }
import { MdClose, MdMenu } from "react-icons/md";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Paths where navbar should be hidden
  const excludedBasePaths = ["/dashboard", "/admin", "/superadmin"];
  const shouldHideNavbar = excludedBasePaths.some((basePath) =>
    pathname.startsWith(basePath)
  );
  if (shouldHideNavbar) return null;

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact" },
    { label: "DASHBOARD", path: "/dashboard" },
  ];

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "admin":
      case "superadmin":
      case "user":
        return `/${role}`;
      default:
        return "/dashboard"; // fallback
    }
  };

  return (
    <header className="bg-card shadow-soft fixed top-0 w-full">
      <nav className="hidden h-16 px-3 lg:px-6 lg:flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-2xl text-primary hover:text-accent"
        >
          INVESTIUM
        </Link>

        <div className="flex gap-6 items-center text-sm font-semibold">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`${
                pathname === path
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <ThemeToggle />
          {!loading && user ? (
            <div>
              <Link
                href={getDashboardRoute(user.role)}
                className="bg-primary text-white hover:bg-accent text-sm px-4 py-2 rounded-md transition"
              >
                DASHBOARD
              </Link>
              <button
                onClick={logout}
                className="text-sm ml-4 bg-error text-white hover:bg-red-600 px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="bg-primary text-white hover:bg-accent text-sm px-4 py-2 font-semibold rounded-md transition"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden h-16 w-full px-3 lg:px-6 bg-card flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-2xl text-primary hover:text-accent"
        >
          INVESTIUM
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="cursor-pointer"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <MdClose className="text-3xl mt-1 text-primary" />
          ) : (
            <MdMenu className="text-3xl mt-1 text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Navbar */}
      {isMobileMenuOpen && (
        <nav className="absolute top-20 z-50 right-4 flex flex-col gap-3 w-48 lg:hidden px-3 py-4 bg-card rounded-lg shadow-md text-sm font-bold text-primary">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className="w-full bg-primary text-white hover:bg-accent text-sm px-4 py-2 rounded-md transition"
              onClick={() => setIsMobileMenuOpen(false)} // close menu on click
            >
              {label}
            </Link>
          ))}

          {!loading && user ? (
            <div>
              <Link
                href={getDashboardRoute(user.role)}
                className="w-full bg-primary text-white hover:bg-accent text-sm px-4 py-2 rounded-md transition"
                onClick={() => setIsMobileMenuOpen(false)} // close menu on click
              >
                DASHBOARD
              </Link>
              <button
                onClick={logout}
                className="mt-3 w-full bg-error text-white hover:text-red-600 text-sm px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="w-full bg-primary text-white hover:bg-accent text-sm px-4 py-2 rounded-md transition"
              onClick={() => setIsMobileMenuOpen(false)} // close menu on click
            >
              SIGN IN
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
