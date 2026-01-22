"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // Now using our Input component
import { Alert } from "./ui/alert"; // Now using our Alert component
import { Lock, Key, UserCheck, Shield, ArrowRight, Eye, EyeOff } from "lucide-react";

interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  defaultEmail?: string;
  onSubmit?: (data: RegistrationFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  defaultEmail = "",
  onSubmit,
  isLoading = false,
  className,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof RegistrationFormData, string>>>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      email: defaultEmail,
      password: "",
      confirmPassword: "",
    },
  });

  const validateForm = (data: RegistrationFormData): boolean => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {};

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (data: RegistrationFormData) => {
    if (!validateForm(data)) return;
    await onSubmit?.(data);
  };

  return (
    <div className={cn("w-full max-w-[440px] mx-auto", className)}>
      {/* Success Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
        <UserCheck className="h-3 w-3" />
        Invite Verified
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Create your account
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Complete your secure registration to access the dashboard.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Email Field (Disabled) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <Input
            value={defaultEmail}
            disabled
            leftIcon={<Lock className="h-5 w-5" />}
            className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 ml-1">
            Linked to your invitation
          </p>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<Key className="h-5 w-5" />}
              error={!!errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<UserCheck className="h-5 w-5" />}
              error={!!errors.confirmPassword}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isLoading || isSubmitting}
          size="xl"
          className="w-full shadow-lg shadow-primary/25 mt-4 cursor-pointer"
          rightIcon={<ArrowRight className="h-5 w-5" />}
        >
          Create Account
        </Button>
      </form>

      {/* Security Notice */}
      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
        <Alert
          icon={<Shield className="h-5 w-5" />}
          variant="default"
          className="bg-blue-50/50 dark:bg-primary/5 border-primary/10"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            This invitation is secure and unique to your professional email.
            Access is granted only to the specific recipient of the original
            invite link.
          </p>
        </Alert>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-slate-400">
          © 2024 QEFAS Analytics Platform. All rights reserved.
          <br />
          <span className="inline-block mt-1">Secured by 256-bit encryption.</span>
        </p>
      </footer>
    </div>
  );
};

export { RegistrationForm };