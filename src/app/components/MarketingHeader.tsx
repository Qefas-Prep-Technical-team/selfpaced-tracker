"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from './ui/Button';
import Logo from './Logo';

export function MarketingHeader() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const navItems = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Docs', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light  px-6 lg:px-40 py-4">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Logo size={32} />
          <h2 className="text-text-primary dark:text-white text-xl font-black leading-tight tracking-tight">
            QEFAS
          </h2>
        </Link>

        {/* Navigation & Auth */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-9">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-text-primary dark:text-white/80 text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              // Logged In State
              <Link href="/dashboard">
                <Button variant="default" size="lg" className="cursor-pointer">
                  Open Dashboard
                </Button>
              </Link>
            ) : (
              // Logged Out State
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="lg" className="cursor-pointer">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="default" size="lg" className="cursor-pointer" disabled={isLoading}>
                    {isLoading ? "..." : "Get Started"}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}