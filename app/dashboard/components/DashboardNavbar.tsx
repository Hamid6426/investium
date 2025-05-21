import React from "react";
import { MdNotifications, MdPerson } from "react-icons/md";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

const DashboardNavbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-2 h-14 bg-card text-paragraph z-999">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        INVESTIUM
      </Link>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <MdNotifications className="text-2xl cursor-pointer" />
        <Link href="/dashboard/profile">
          <MdPerson className="text-2xl cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
