"use client";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "@/app/components/ui/Button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // Spacer
    }

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full cursor-pointer text-text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/10" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <div className="relative flex items-center justify-center">
                <FaSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <FaMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}