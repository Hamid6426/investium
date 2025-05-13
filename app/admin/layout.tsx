import Link from "next/link";
import React from "react";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-dvh flex place-items-center bg-background">
      <header className="sticky top-0 left-0">
        <AdminSidebar />
      </header>
      <main className="flex justify-center items-center flex-grow">{children}</main>
    </div>
  );
};

export default AdminLayout;
