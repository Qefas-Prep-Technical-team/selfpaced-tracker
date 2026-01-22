"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cpu, HardDrive, BarChart3, Shield, Zap } from "lucide-react";

interface FloatingLaptopProps {
  className?: string;
}

export default function FloatingLaptop({ className }: FloatingLaptopProps) {
  return (
    <div className={cn("relative w-full max-w-3xl mx-auto", className)}>
      {/* Floating Laptop with Framer Motion */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotateX: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-20 perspective-1000"
      >
        {/* Laptop Screen */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-2xl rounded-b-lg shadow-2xl overflow-hidden border-[14px] border-slate-800">
          {/* Screen Bezel */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"></div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-900 rounded-full"></div>
          
          {/* Screen Content */}
          <div className="pt-6 pb-8 px-8 h-full">
            {/* Screen Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500"></div>
                <div className="size-3 rounded-full bg-amber-500"></div>
                <div className="size-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="text-xs font-mono text-slate-400">QEFAS v2.4</div>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="size-3 rounded-full bg-blue-500/50"></div>
                <div className="size-3 rounded-full bg-purple-500/50"></div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Chart Widget */}
              <div className="col-span-2 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-slate-300">Performance</div>
                  <BarChart3 className="size-5 text-primary" />
                </div>
                <div className="flex items-end gap-1 h-24">
                  {[40, 65, 35, 80, 55, 90, 60].map((height, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Stats Widget */}
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="size-4 text-emerald-400" />
                    <div className="text-xs text-slate-400">CPU</div>
                  </div>
                  <div className="text-xl font-bold text-white">87%</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="size-4 text-blue-400" />
                    <div className="text-xs text-slate-400">Storage</div>
                  </div>
                  <div className="text-xl font-bold text-white">2.4TB</div>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <Shield className="size-5 text-primary" />
                <div>
                  <div className="text-xs text-slate-400">Security</div>
                  <div className="text-sm font-bold text-white">AES-256</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <Zap className="size-5 text-amber-400" />
                <div>
                  <div className="text-xs text-slate-400">Latency</div>
                  <div className="text-sm font-bold text-white">12ms</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="size-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="size-2 rounded-full bg-emerald-500"></div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Uptime</div>
                  <div className="text-sm font-bold text-white">99.9%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Screen Glare */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        </div>

        {/* Laptop Base/Keyboard */}
        <div className="relative h-8 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-2xl shadow-lg -mt-1 mx-8">
          {/* Keyboard Area */}
          <div className="absolute inset-x-4 top-2 h-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded"></div>
          
          {/* Trackpad */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-b from-slate-900 to-slate-800 rounded-full"></div>
          
          {/* Hinge */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-full"></div>
        </div>

        {/* Screen Reflection */}
        <div className="absolute inset-0 rounded-t-2xl rounded-b-lg bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
      </motion.div>

      {/* Floating Elements Around Laptop */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-6 -right-6 size-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full border border-primary/30 flex items-center justify-center"
      >
        <Cpu className="size-5 text-primary/60" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-4 -left-8 size-10 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center"
      >
        <Shield className="size-4 text-emerald-500/60" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
        className="absolute top-1/2 -right-12 size-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full border border-blue-500/30 flex items-center justify-center"
      >
        <Zap className="size-3 text-blue-500/60" />
      </motion.div>

      {/* Soft Shadow */}
      <motion.div
        animate={{
          scale: [1, 0.85, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-gradient-to-t from-black/30 to-transparent dark:from-white/15 dark:to-transparent rounded-[100%] blur-xl"
      />

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}