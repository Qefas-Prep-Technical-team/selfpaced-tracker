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
    <div className="bg-slate-100 dark:bg-slate-900 shadow-inner p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-800">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200',
            value === option.value
              ? 'bg-white dark:bg-slate-800 text-primary shadow-md ring-1 ring-slate-200 dark:ring-slate-700'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          )}
        >
          <span className="material-symbols-outlined text-[18px]">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default ToggleGroup