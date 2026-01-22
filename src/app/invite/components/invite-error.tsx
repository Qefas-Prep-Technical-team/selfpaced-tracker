import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Shield, Lock, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface InviteErrorProps {
  title?: string;
  message?: string;
  contactEmail?: string;
  loginUrl?: string;
  className?: string;
}

const InviteError: React.FC<InviteErrorProps> = ({
  title = "This platform is invite-only",
  message = "The invitation link you're using is missing, expired, or has already been used. Please contact an administrator to request access to the platform.",
  contactEmail = "admin@qefas.io",
  loginUrl = "/login",
  className,
}) => {
  return (
    <div className={cn("flex-1 flex flex-col items-center justify-center p-6 text-center mt-20", className)}>
      {/* Shield Icon */}
      <div className="mb-10">
        <div className="relative inline-flex items-center justify-center">
          {/* Shield Glow Effect */}
          <div className="absolute inset-0 w-[140%] h-[140%] bg-radial from-primary/8 to-transparent rounded-full -z-10" />
          
          {/* Shield Container */}
          <div className="relative flex items-center justify-center size-32 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-primary/5">
            <Shield className="size-16 text-primary/40 dark:text-primary/60" />
            <Lock className="absolute size-7 text-primary fill-primary" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          {title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
          {message}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
          
            size="lg"
            className="px-8 py-3 rounded-xl shadow-lg shadow-primary/20"
            leftIcon={<Mail className="size-5" />}
          >
            <a href={`mailto:${contactEmail}`}>
              Contact Administrator
            </a>
          </Button>
          
          <Button
        
            variant="outline"
            size="lg"
            className="px-8 py-3 rounded-xl"
            leftIcon={<ArrowLeft className="size-5" />}
          >
            <Link href={loginUrl}>
              Return to Login
            </Link>
          </Button>
        </div>

        {/* Security Badge */}
        <div className="pt-8 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
          <ShieldCheck className="size-4" />
          <span>Enterprise-grade security protected by QEFAS Systems</span>
        </div>
      </div>
    </div>
  );
};

export { InviteError };