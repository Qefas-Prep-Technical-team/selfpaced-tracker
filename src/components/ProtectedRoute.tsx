"use client";

import { ReactNode } from "react";

import LoadingDashboard from "./LoadingDashboard";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";

export interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
    userTypes?: string[];
    fallback?: ReactNode;
}

export default function ProtectedRoute({
    children,
    redirectTo = "/login",
    requireAuth = true,
    userTypes = [],
    fallback,
}: ProtectedRouteProps) {
    const { isChecking } = useProtectedRoute({
        redirectTo,
        requireAuth,
        userTypes,
    });

    if (isChecking) {
        return fallback || <LoadingDashboard message="Verifying access..." />;
    }

    return <>{children}</>;
}