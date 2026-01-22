"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, Shield } from "lucide-react";

interface LoginHeroProps {
  className?: string;
}

const LoginHero: React.FC<LoginHeroProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center bg-slate-900 overflow-hidden",
        className
      )}
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-40 bg-grid-pattern" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900 to-slate-900" />

      {/* Logo in Corner */}
      <div className="absolute top-10 left-10 flex items-center gap-2 text-white">
        <QefasLogo className="size-8 text-primary" />
        <span className="text-xl font-bold tracking-tight">QEFAS</span>
      </div>

      {/* Main Floating Illustration */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        {/* Floating Card */}
        <div className="w-80 h-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl flex flex-col p-4">
          {/* Window Dots */}
          <div className="flex gap-1.5 mb-4">
            <div className="size-2 rounded-full bg-red-400" />
            <div className="size-2 rounded-full bg-amber-400" />
            <div className="size-2 rounded-full bg-emerald-400" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="h-2 w-3/4 bg-white/20 rounded" />
            <div className="h-2 w-1/2 bg-white/20 rounded" />
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="h-16 bg-primary/40 rounded-lg" />
              <div className="h-16 bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Floating Badge - Clicks Tracked */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -top-10 -right-16 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 shadow-lg flex items-center gap-3"
        >
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Clicks Tracked
            </p>
            <p className="text-white font-bold">1.2M+</p>
          </div>
        </motion.div>

        {/* Floating Badge - Data Security */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-12 -left-20 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 shadow-lg flex items-center gap-3"
        >
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Data Security
            </p>
            <p className="text-white font-bold">AES-256</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <div className="mt-24 text-center px-12 z-10">
        <h2 className="text-3xl font-black text-white leading-tight mb-4">
          Advanced Marketing Analytics
        </h2>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          Micro-metric tracking with secure, real-time data visualization for elite enterprises.
        </p>
      </div>
    </div>
  );
};

const QefasLogo = ({ className }: { className?: string }) => (
  <svg
    fill="none"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
      fill="currentColor"
    />
    <path
      clipRule="evenodd"
      d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export { LoginHero };