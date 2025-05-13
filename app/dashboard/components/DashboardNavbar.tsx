import React from 'react';
import { MdNotifications, MdPerson } from 'react-icons/md';
import ThemeToggle from '@/components/ThemeToggle';

const DashboardNavbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
      {/* Logo */}
      <div className="text-xl font-bold">Logo</div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <MdNotifications className="text-2xl cursor-pointer" />
        <MdPerson className="text-2xl cursor-pointer" />
      </div>
    </nav>
  );
};

export default DashboardNavbar;