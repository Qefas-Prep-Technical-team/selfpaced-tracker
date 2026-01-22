"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
}) => {
  // Handle Body Scroll and Escape Key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay - Uses opacity transition */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col border-l border-gray-200 dark:border-slate-800 transition-transform duration-500 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full", // This handles the slide
          {
            "max-w-[380px]": maxWidth === "sm",
            "max-w-[480px]": maxWidth === "md",
            "max-w-[640px]": maxWidth === "lg",
            "max-w-[768px]": maxWidth === "xl",
            "w-full": true,
          }
        )}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
          {children}
        </div>

       
      </div>
    </>
  );
};

export { SlideOver };