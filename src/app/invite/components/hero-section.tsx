import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Enterprise Grade Tracking",
  subtitle = "Precision analytics for professional marketing teams. Secured by exclusive invite-only access.",
  className,
}) => {
  return (
    <div
      className={cn(
        "hidden lg:flex lg:w-1/2 slate-gradient items-center justify-center p-12 relative overflow-hidden",
        className
      )}
    >
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      {/* Floating Animation Container */}
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative aspect-[16/10] bg-slate-800 rounded-2xl shadow-2xl p-2 border-[6px] border-slate-700 shadow-primary/20"
        >
          {/* Mock Dashboard UI */}
          <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden flex flex-col">
            {/* Window Controls */}
            <div className="h-8 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
              <div className="size-2 rounded-full bg-red-400/50" />
              <div className="size-2 rounded-full bg-amber-400/50" />
              <div className="size-2 rounded-full bg-emerald-400/50" />
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 flex flex-col gap-4">
              <div className="h-8 w-1/3 bg-white/10 rounded-md" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-primary/20 rounded-xl border border-primary/20" />
                <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
              </div>
              <div className="flex-1 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end px-4 pb-4 gap-2">
                  {[50, 66, 33, 75, 50, 80].map((height, index) => (
                    <div
                      key={index}
                      className="w-full bg-primary/40 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shadow Effect */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[110%] h-4 bg-black/20 blur-xl rounded-full" />
        </motion.div>

        {/* Branding Section */}
        <div className="mt-16">
          <div className="flex items-center gap-3 text-primary mb-4">
            <Logo className="size-10" />
            <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
              QEFAS
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

const Logo = ({ className }: { className?: string }) => (
  <svg
    fill="none"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
      fill="currentColor"
    />
  </svg>
);

export { HeroSection, Logo };