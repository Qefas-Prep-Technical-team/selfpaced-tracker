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
  const currentOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-slate-200/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-11 px-4 text-xs font-black uppercase tracking-wider appearance-none cursor-pointer transition-all shadow-sm pr-10 text-left",
            currentOption?.bgColor || "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
          )}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-2 font-bold uppercase tracking-wider text-xs"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-[10px] font-black">
          ▼
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-1 italic font-medium text-center">
        * Selection updates status in real-time
      </p>
    </div>
  )
}