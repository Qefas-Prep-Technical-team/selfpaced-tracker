// components/ui/StatusBadge.tsx
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'new' | 'contacted' | 'followup' | 'completed'
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const statusStyles = {
    new: 'bg-primary/10 text-primary border border-primary/20',
    contacted: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
    followup: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
    completed: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
  }

  return (
    <span className={cn(
      'px-2.5 py-1 rounded-full text-xs font-semibold',
      statusStyles[status],
      className
    )}>
      {children}
    </span>
  )
}