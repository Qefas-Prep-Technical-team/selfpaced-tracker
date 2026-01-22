"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginLayout } from "./components/login-layout";
import { signIn } from "next-auth/react";

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
  alert(result.error);
} else {
  router.push("/dashboard");
}
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Login data:", data);
      
      // In a real app, you would:
      // 1. Send login request to your API
      // 2. Handle authentication
      // 3. Store tokens (considering rememberMe)
      // 4. Redirect to dashboard
      
      // For demo, just redirect
      alert("Login successful! Redirecting to dashboard...");
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}