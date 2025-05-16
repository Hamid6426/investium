import Link from "next/link";
import React from "react";
import AdminNavbar from "./components/AdminNavbar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-dvh flex flex-col place-items-center bg-background">
      <header className="sticky top-0 w-full">
        <AdminNavbar />
      </header>
      <main className="flex justify-center items-center flex-grow">{children}</main>
    </div>
  );
};

export default AdminLayout;
