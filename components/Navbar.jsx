"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MdChat, MdClose, MdMenu } from "react-icons/md";
import ThemeToggle from "./ThemeToggle";
import ThemeSwitcher from "./ThemeSwicher";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isUserLoading } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const excludedBasePaths = ["/donor", "/receiver", "/admin", "/chats"];
  const shouldHideNavbar = excludedBasePaths.some((basePath) =>
    pathname.startsWith(basePath)
  );
  if (shouldHideNavbar) return null;

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact" },
    { label: "LISTING", path: "/listing" },
  ];

  return (
    <header className="bg-card shadow-soft">
      <nav className="hidden h-14 px-3 lg:px-6 lg:flex justify-between items-center">
        <Link href="/" className="text-primary text-2xl font-semibold">
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
          <ThemeSwitcher />
          {!isUserLoading && currentUser ? (
            <Link
              href={`/${currentUser.role}`}
              className="bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
            >
              DASHBOARD
            </Link>
          ) : (
            <Link
              href="/signin"
              className="bg-primary text-white hover:bg-accent px-4 py-2 font-semibold rounded-md transition"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden h-14 w-full px-3 lg:px-6 bg-background flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-primary">
          SHARE n CARE
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="cursor-pointer"
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
        <nav className="absolute top-14 z-50 right-4 flex flex-col gap-3 w-48 lg:hidden px-3 py-4 bg-card rounded-lg shadow-md text-sm font-bold text-primary">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
            >
              {label}
            </Link>
          ))}

          {!isUserLoading && currentUser ? (
            <>
              <Link
                href="/chats"
                className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
              >
                CHATS
              </Link>
              <Link
                href={`/${currentUser.role}`}
                className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
              >
                DASHBOARD
              </Link>
            </>
          ) : (
            <Link
              href="/signin"
              className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
            >
              SIGN IN
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
