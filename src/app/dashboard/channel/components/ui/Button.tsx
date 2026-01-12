// components/ui/Button.tsx
import { LucideIcon } from 'lucide-react'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110',
    secondary: 'bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-white',
    outline: 'border border-slate-200 dark:border-[#233648] bg-transparent',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-[#233648]',
  }

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-sm',
  }

  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg font-semibold transition-all',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </button>
  )
}