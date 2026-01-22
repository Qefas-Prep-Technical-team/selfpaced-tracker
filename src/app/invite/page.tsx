/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { RegistrationLayout } from "./components/registration-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { InviteError } from "./components/invite-error";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

export default function RegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [isVerifying, setIsVerifying] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setError("An invitation token is required to access this page.");
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch(`/api/invites/verify?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Verification failed");
        } else {
          setVerifiedEmail(data.email);
        }
      } catch (err) {
        setError("Connection error. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    }
    verifyToken();
  }, [token]);

 const handleSubmit = async (data: any) => {
  setIsRegistering(true);
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...data, token }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Registration failed");
    
    // AUTO-LOGIN: Use the same credentials to sign in immediately
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/dashboard?welcome=true",
    });

  } catch (err) {
    alert("Error creating account.");
  } finally {
    setIsRegistering(false);
  }
};

  // 1. Loading State
  if (isVerifying) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-background-dark">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Verifying your invitation...</p>
      </div>
    );
  }

  // 2. Error State (Invalid Token)
  if (error) {
    return (
     <InviteError/>
    );
  }

  // 3. Success State (Render Form)
  return (
    <RegistrationLayout
      email={verifiedEmail}
      onSubmit={handleSubmit}
      isLoading={isRegistering}
      heroTitle="Enterprise Grade Tracking"
      heroSubtitle="Precision analytics for professional marketing teams. Secured by exclusive invite-only access."
    />
  );
}