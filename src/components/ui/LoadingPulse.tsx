'use client'

interface LoadingPulseProps {
    count?: number
    className?: string
}

export default function LoadingPulse({ count = 1, className = '' }: LoadingPulseProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`animate-pulse bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800 ${className}`}
                    style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '1.5s'
                    }}
                />
            ))}
        </>
    )
}