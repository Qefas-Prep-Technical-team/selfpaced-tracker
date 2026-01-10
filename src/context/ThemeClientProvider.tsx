'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { getMuiTheme } from '@/lib/theme';
import { useMemo, useEffect, useState } from 'react';

export function ThemeClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <MuiWrapper>{children}</MuiWrapper>
        </NextThemesProvider>
    );
}

function MuiWrapper({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme(); // 'light' | 'dark' | undefined
    console.log(resolvedTheme)
    const [mounted, setMounted] = useState(false);

    // prevent hydration mismatch
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    const muiTheme = useMemo(
        () => getMuiTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
        [resolvedTheme]
    );

    if (!mounted) return null;

    return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}
