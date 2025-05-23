// src/utils/LayoutGuardWrapper.tsx An HOC to protect user routes (for layouts to prevent it from client side)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function UserLayoutGuardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (isLoggedIn && user) {
      console.log(user.name);
    }

    if (!isLoggedIn) {
      router.replace("/login");
    } else if (user?.role !== "user") {
      router.replace("/error/401");
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || (user && user.role !== "user")) return null;

  return <>{children}</>;
}

/*
USAGE: import and wrap what need to be wrapped in the layout
    <UserGuardWrapper>
      <DashboardNavbar />
      <div>{children}</div>
    </UserGuardWrapper>
*/
