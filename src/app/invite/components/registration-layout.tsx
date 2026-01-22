import * as React from "react";
import { cn } from "@/lib/utils";
import { HeroSection } from "./hero-section";
import { RegistrationCard } from "./registration-card";

interface RegistrationLayoutProps {
  email: string;
  onSubmit?: (data: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  isLoading?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  className?: string;
}

const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
  email,
  onSubmit,
  isLoading,
  heroTitle,
  heroSubtitle,
  className,
}) => {
  return (
    <div className={cn("flex min-h-screen w-full bg-white dark:bg-background-dark overflow-hidden", className)}>
      <HeroSection title={heroTitle} subtitle={heroSubtitle} />
      <RegistrationCard
        email={email}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export { RegistrationLayout };