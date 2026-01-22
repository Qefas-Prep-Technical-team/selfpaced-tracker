/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface UseProtectedRouteProps {
  redirectTo: string;
  requireAuth: boolean;
  userTypes: string[];
}

export function useProtectedRoute({
  redirectTo,
  requireAuth,
  userTypes,
}: UseProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isChecking = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  useEffect(() => {
    if (isChecking) return;

    // 1. If auth is required but user is not logged in
    if (requireAuth && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. If user is logged in but doesn't have the required role
    if (
      isAuthenticated &&
      userTypes.length > 0 &&
      !userTypes.includes((user as any).role?.toUpperCase())
    ) {
      router.push("/dashboard?error=unauthorized");
    }
  }, [
    isChecking,
    isAuthenticated,
    user,
    userTypes,
    redirectTo,
    router,
    pathname,
  ]);

  return { isChecking, user, isAuthenticated };
}
