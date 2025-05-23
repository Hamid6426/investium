// src/utils/PageGuardWrapper.tsx An HOC to protect user routes (for individual pages only not layout)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ReactElement, ComponentType } from "react";

export function UserPageGuardWrapper<P extends {}>(
  Component: ComponentType<P>
): ComponentType<P> {
  const Wrapper = (props: P): ReactElement | null => {
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn) {
        router.replace("/login");
      } else if (user && user.role !== "user") {
        router.replace("/error/401");
      }
    }, [isLoggedIn, user, router]);

    if (!isLoggedIn || (user && user.role !== "user")) return null;

    return <Component {...props} />;
  };

  Wrapper.displayName = `PageGuardWrapper(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapper;
}

/*
USAGE:

Write it at the end of component and use it like how context work

export default PageGuardWrapper(UserDashboardLayout);

 */
