import * as React from "react";
import { cn } from "@/lib/utils";
import { LoginHero } from "./login-hero";
import { LoginCard } from "./login-card";

interface LoginLayoutProps {
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({
  onSubmit,
  isLoading,
  className,
}) => {
  return (
    <div className={cn("flex min-h-screen w-full overflow-hidden", className)}>
      <LoginHero />
      <LoginCard onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export { LoginLayout };