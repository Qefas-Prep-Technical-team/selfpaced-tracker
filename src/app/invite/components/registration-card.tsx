import * as React from "react";
import { cn } from "@/lib/utils";
import { RegistrationForm } from "./registration-form";
import { MobileHeader } from "./mobile-header";

interface RegistrationCardProps {
  email: string;
  onSubmit?: (data: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({
  email,
  onSubmit,
  isLoading,
  className,
}) => {
  return (
    <div className={cn("w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-background-dark", className)}>
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <MobileHeader />

        <div className="bg-white dark:bg-slate-900/50 p-8 sm:p-10 rounded-2xl border border-slate-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
          <RegistrationForm
            defaultEmail={email}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export { RegistrationCard };