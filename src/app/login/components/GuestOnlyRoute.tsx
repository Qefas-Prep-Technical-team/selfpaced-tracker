"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingDashboard from "@/components/LoadingDashboard";

export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // If user is already logged in, send them to the dashboard
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    // While checking status, show the loader
    if (status === "loading") {
        return <LoadingDashboard message="Checking session..." />;
    }

    // If unauthenticated, show the login/register form
    if (status === "unauthenticated") {
        return <>{children}</>;
    }

    // Fallback while redirecting
    return null;
}