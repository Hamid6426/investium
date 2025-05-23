"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { MdDashboard, MdLogout } from "react-icons/md";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuth();

  const excludedBasePaths = ["/dashboard", "/admin", "/superadmin"];
  const shouldHideNavbar = excludedBasePaths.some((basePath) =>
    pathname.startsWith(basePath)
  );
  if (shouldHideNavbar) return null;

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsLoggedIn(false);
    router.push("/login");
  };

  const getDashboardRoute = (role: string | undefined) => {
    switch (role) {
      case "admin":
      case "superadmin":
      case "user":
        return `/${role}_dashboard`;
      default:
        return "/error/404"; // fallback for unknown roles
    }
  };

  return (
    <header className="bg-card shadow-soft fixed top-0 w-full z-50 border-b border-accent">
      <nav className="h-16 px-3 lg:px-6 flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-xl sm:text-2xl text-primary hover:text-accent"
        >
          INVESTIUM
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          {isLoggedIn && user ? (
            <div className="flex items-center gap-4">
              <Link
                href={getDashboardRoute(user.role)}
                className="hidden sm:block bg-primary text-white hover:bg-accent text-sm px-4 py-2 rounded-md transition"
              >
                Dashboard
              </Link>
              <Link
                href={getDashboardRoute(user.role)}
                className="flex items-center sm:hidden"
              >
                <MdDashboard size={24} />
              </Link>

              <button
                onClick={logout}
                className="hidden sm:block text-sm bg-error text-white hover:bg-red-600 px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
              <button onClick={logout} className="text-error hover:bg-red-600 cursor-pointer flex items-center sm:hidden">
                <MdLogout size={24} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-white hover:bg-accent text-sm px-4 py-2 font-semibold rounded-md transition"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
