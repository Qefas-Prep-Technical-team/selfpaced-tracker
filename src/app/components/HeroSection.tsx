"use client"; // Must be a client component to use session

import { useSession } from "next-auth/react";
import { Button } from './ui/Button';
import FloatingLaptop from './FloatingLaptop';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from "lucide-react";

export function HeroSection() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <section className="py-16 lg:py-24">
      <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-8 flex-1">
          <div className="flex flex-col gap-4">
            <h1 className="text-text-primary dark:text-white text-4xl sm:text-6xl font-black leading-tight tracking-[-0.033em] max-w-[600px]">
              Track Every Marketing Action. Understand Every Result.
            </h1>
            <p className="text-text-secondary dark:text-white/60 text-lg font-normal leading-relaxed max-w-[500px]">
              The all-in-one analytics engine for performance marketers. Gain absolute clarity on your conversion funnel in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Dynamic Auth Button */}
            {session ? (
              <Link href="/dashboard" passHref>
                <Button className='cursor-pointer gap-2' variant="default" size="xl">
                  <LayoutDashboard className="size-5" />
                  Open Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login" passHref>
                <Button
                  className='cursor-pointer gap-2'
                  variant="default"
                  size="xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Checking session..." : "Get Started Now"}
                  {!isLoading && <ArrowRight className="size-5" />}
                </Button>
              </Link>
            )}

            <Link className='cursor-pointer' href="/demo" passHref>
              <Button variant="outline" size="xl">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 relative flex flex-col items-center">
          <FloatingLaptop />
        </div>
      </div>
    </section>
  );
}