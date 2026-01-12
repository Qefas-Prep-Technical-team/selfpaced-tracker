// components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search'
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', icon, ...props }, ref) => {
    const baseClasses = "h-10 bg-slate-50 dark:bg-[#233648] border-none rounded-lg text-sm placeholder:text-slate-400 dark:placeholder:text-[#92adc9] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92adc9]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            baseClasses,
            icon && 'pl-10',
            variant === 'search' && 'pr-4',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'