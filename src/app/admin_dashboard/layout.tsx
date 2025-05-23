import React from "react";
import AdminNavbar from "./components/AdminNavbar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 w-full z-[999]">
        <AdminNavbar />
      </header>
      <main className="flex flex-grow w-full">{children}</main>
    </div>
  );
};

export default AdminLayout;
