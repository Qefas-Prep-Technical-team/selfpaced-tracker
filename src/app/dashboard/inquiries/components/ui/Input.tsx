// components/ui/Input.tsx - Updated
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search' | 'ghost'
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', icon, ...props }, ref) => {
    const variants = {
      default: "bg-white dark:bg-[#111a22] border border-slate-300 dark:border-[#324d67]",
      search: "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:ring-2 ring-primary/20",
      ghost: "bg-transparent border-none focus:ring-0",
    }

    return (
      <div className={cn(
        "relative flex items-center gap-2 rounded-lg",
        variants[variant],
        icon && "px-3"
      )}>
        {icon && (
          <div className="text-slate-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-10 bg-transparent border-none focus:outline-none text-sm placeholder:text-slate-400",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'