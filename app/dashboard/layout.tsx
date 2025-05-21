import React from "react";
import DashboardNavbar from "./components/DashboardNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardNavbar />
      <div>{children}</div>
    </div>
  );
}
