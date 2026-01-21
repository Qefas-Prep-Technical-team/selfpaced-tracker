// components/ui/Input.tsx - Updated for search variant
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search' | 'ghost'
  icon?: React.ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', icon, error, ...props }, ref) => {
    const variants = {
      default: "bg-white dark:bg-white/5 border border-surface-light dark:border-white/10",
      search: "bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary",
      ghost: "bg-transparent border-none focus:ring-0"
    }

    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none",
            variants[variant],
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'