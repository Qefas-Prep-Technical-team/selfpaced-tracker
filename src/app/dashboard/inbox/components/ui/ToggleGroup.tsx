'use client'

import { FC } from 'react'
import { cn } from '@/lib/utils'

interface ToggleOption {
  value: string
  label: string
  icon: string
}

interface ToggleGroupProps {
  options: ToggleOption[]
  value: string
  onChange: (value: string) => void
}

const ToggleGroup: FC<ToggleGroupProps> = ({ options, value, onChange }) => {
  return (
    <div className="bg-[#e7edf3] dark:bg-slate-800 p-1 rounded-lg flex items-center">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all',
            value === option.value
              ? 'bg-white dark:bg-slate-700 text-ai-purple shadow-sm'
              : 'text-[#4c739a] dark:text-slate-400 hover:text-primary'
          )}
        >
          <span className="material-symbols-outlined text-lg">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default ToggleGroup