// app/user_dashboard/layout.tsx
import DashboardNavbar from "./components/DashboardNavbar";
import UserLayoutGuardWrapper from "@/utils/UserLayoutGuardWrapper";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <UserLayoutGuardWrapper>
        <DashboardNavbar />
        <div>{children}</div>
      </UserLayoutGuardWrapper>
    </div>
  );
}
