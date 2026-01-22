"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  className,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof LoginFormData, string>>>({});

  const {
    register,
    handleSubmit,
    control, // Add this
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const validateForm = (data: LoginFormData): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (data: LoginFormData) => {
    if (!validateForm(data)) return;
    await onSubmit?.(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn("space-y-6", className)}>
      {/* Email Field */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Email Address
        </label>
        <Input
          {...register("email")}
          type="email"
          placeholder="name@company.com"
          leftIcon={<Mail className="h-5 w-5" />}
          error={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <a
            href="#"
            className="text-sm font-semibold text-primary hover:underline transition-all"
          >
            Forgot password?
          </a>
        </div>
        <Input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={<Lock className="h-5 w-5" />}
          error={!!errors.password}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 cursor-pointer" />
              ) : (
                <Eye className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          }
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <Checkbox
          id="remember-me"
          type="checkbox" // Explicitly tell it it's a checkbox
          {...register("rememberMe")}
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none"
        >
          Remember this device for 30 days
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        isLoading={isLoading || isSubmitting}
        className="w-full py-3.5 shadow-sm cursor-pointer"
        size="lg"
      >
        Log in to Workspace
      </Button>
    </form>
  );
};

export { LoginForm };