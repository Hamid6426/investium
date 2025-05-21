"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import ThemeToggle from "./ThemeToggle";
import {jwtDecode} from "jwt-decode"; // add this dependency or implement your own decode

type User = {
  role: string;
  // add other user properties if needed
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const excludedBasePaths = ["/dashboard", "/admin", "/superadmin"];
  const shouldHideNavbar = excludedBasePaths.some((basePath) =>
    pathname.startsWith(basePath)
  );
  if (shouldHideNavbar) return null;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded?.role) {
        setUser({ role: decoded.role });
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    } catch {
      // Invalid token
      setUser(null);
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    router.push("/signin");
  };

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "admin":
      case "superadmin":
        return `/${role}`;
      default:
        return "/dashboard"; // fallback
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
          {!loading && user ? (
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
              href="/signin"
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
