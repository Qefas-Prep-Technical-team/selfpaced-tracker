import * as React from "react";
import { cn } from "@/lib/utils";
import { LoginForm } from "./login-form";
import { Lock } from "lucide-react";

interface LoginCardProps {
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const LoginCard: React.FC<LoginCardProps> = ({
  onSubmit,
  isLoading,
  className,
}) => {
  return (
    <div className={cn("w-full lg:w-1/2 flex items-center justify-center p-8 bg-background-light dark:bg-background-dark", className)}>
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 px-4 py-1.5 mb-6 border border-slate-300 dark:border-slate-700">
            <Lock className="h-3 w-3" />
            <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wide">
              Invite-only platform
            </p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Secure access to your analytics dashboard
          </p>
        </div>

        {/* Login Form */}
        <LoginForm onSubmit={onSubmit} isLoading={isLoading} />

        {/* Footer Links */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Don`&apos;`t have access?{" "}
            <a
              href="#"
              className="text-slate-900 dark:text-white font-bold hover:text-primary transition-colors"
            >
              Contact system admin
            </a>
          </p>
        </div>

        {/* Bottom Links */}
        <div className="flex justify-center gap-6 text-slate-400 pt-2">
          <a
            href="#"
            className="text-[11px] uppercase font-bold tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-[11px] uppercase font-bold tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-[11px] uppercase font-bold tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Help Center
          </a>
        </div>
      </div>
    </div>
  );
};

export { LoginCard };