"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingDashboardProps {
    message?: string;
    className?: string;
}

export default function LoadingDashboard({
    message = "Loading your workspace...",
    className
}: LoadingDashboardProps) {
    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950",
                className
            )}
        >
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <div className="absolute h-10 w-10 animate-ping rounded-full border-2 border-primary/20" />
                </div>

                {/* Text */}
                <div className="space-y-1 text-center">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 animate-pulse">
                        {message}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Securing your connection...
                    </p>
                </div>
            </div>

            {/* Subtle Background Elements to match your Hero style */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>
        </div>
    );
}