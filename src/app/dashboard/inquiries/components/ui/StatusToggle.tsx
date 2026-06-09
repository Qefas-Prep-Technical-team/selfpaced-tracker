// components/ui/StatusToggle.tsx
'use client'

import { cn } from '@/lib/utils'

interface StatusToggleProps {
  value: string
  onChange: (value: string) => void
  options: Array<{
    value: string
    label: string
    color?: string
    bgColor?: string
  }>
  className?: string
}

export function StatusToggle({ 
  value, 
  onChange, 
  options, 
  className 
}: StatusToggleProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex p-1 bg-slate-100 dark:bg-slate-950/40 rounded-xl">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 py-2 text-[9px] sm:text-[10px] uppercase tracking-tight sm:tracking-wider font-extrabold rounded-lg transition-all cursor-pointer whitespace-nowrap min-w-0 px-1.5",
              value === option.value
                ? option.bgColor || "bg-indigo-150 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-2 italic font-medium">
        * Clicking updates status in real-time
      </p>
    </div>
  )
}