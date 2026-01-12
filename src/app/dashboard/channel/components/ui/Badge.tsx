// components/ui/Badge.tsx
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  icon?: LucideIcon
  children: React.ReactNode
}

export function Badge({ variant = 'default', icon: Icon, children }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-slate-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide',
      variants[variant]
    )}>
      {Icon && <Icon size={12} />}
      {children}
    </div>
  )
}