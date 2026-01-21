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
      <div className="flex p-1 bg-background-light dark:bg-surface-dark rounded-lg">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-md transition-colors",
              value === option.value
                ? cn(
                    option.bgColor || "bg-blue-100 text-blue-700 shadow-sm",
                    "dark:bg-blue-900/30 dark:text-blue-400"
                  )
                : "text-text-secondary hover:bg-surface-light dark:hover:bg-surface-dark/70"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-text-secondary mt-2 italic">
        * Clicking updates status in real-time
      </p>
    </div>
  )
}