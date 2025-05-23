"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

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
        return "/404"; // fallback for unknown roles
    }
  };

  return (
    <header className="bg-card shadow-soft fixed top-0 w-full z-50">
      <nav className="h-16 px-3 lg:px-6 flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-2xl text-primary hover:text-accent"
        >
          INVESTIUM
        </Link>
        <div className="flex gap-3 lg:gap-4 items-center">
          <ThemeToggle />
          {isLoggedIn && user ? (
            <div>
              <Link
                href={getDashboardRoute(user.role)}
                className="bg-primary text-white hover:bg-accent text-sm px-4 py-2 rounded-md transition"
              >
                Dashboard
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
