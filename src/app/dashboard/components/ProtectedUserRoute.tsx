import ProtectedRoute from "@/components/ProtectedRoute";

/**
 * Use this for any route that just needs a logged-in user (Dashboard, Profile)
 */
export function ProtectedUserRoute({ children }: { children: React.ReactNode }) {
    return <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;
}

/**
 * Use this for Admin-only pages (Invite Generation, User Management)
 */
export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requireAuth={true} userTypes={["ADMIN"]}>
            {children}
        </ProtectedRoute>
    );
}