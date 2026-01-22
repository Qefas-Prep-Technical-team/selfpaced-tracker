"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginLayout } from "./components/login-layout";
import { signIn } from "next-auth/react";
import { GuestOnlyRoute } from "./components/GuestOnlyRoute";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,

      });

      if (result?.error) {
        toast.error("login failed")
        return
      }
      toast.success("Login successful! Redirecting to dashboard...")
      router.push("/dashboard");

    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestOnlyRoute>

      <LoginLayout
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </GuestOnlyRoute>
  );
}