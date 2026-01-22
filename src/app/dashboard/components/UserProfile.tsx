/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingDashboard from "@/components/LoadingDashboard";
import { toast } from "react-toastify";

export default function UserProfile() {
  // FIXED (Rename it to be safe)
  const { data: session, status: sessionStatus } = useSession();
  if (sessionStatus === "loading") return <LoadingDashboard />
  if (!session) return null; // Or show login button

  const email = session.user?.email || "guest@corp.com";
  const role = (session.user as any)?.role || "Viewer";

  // Create a simple initial for the avatar if no image exists
  const initial = email.charAt(0).toUpperCase();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
    toast.success("logged out successfully ✔️")
  };

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-4">
        {/* User Info Section */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full size-10 border border-primary/20">
            {session?.user?.image ? (
              <div
                className="w-full h-full rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${session.user.image})` }}
              />
            ) : (
              initial
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
              {email.split('@')[0]} {/* Simple display name from email */}
            </p>
            <div className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-primary" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-primary italic">
                {role}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium cursor-pointer",
            "text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10",
            "hover:text-red-600 dark:hover:text-red-400 transition-colors group"
          )}
        >
          <LogOut className="size-4 group-hover:translate-x-1 transition-transform" />
          Log out
        </button>
      </div>
    </div>
  );
}