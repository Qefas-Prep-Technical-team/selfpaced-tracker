import { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  color: 'blue' | 'orange' | 'purple' | 'green' | 'red' | 'gray'
  className?: string
}

const Badge: FC<BadgeProps> = ({ children, color, className }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800/50',
    orange: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800/50',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-800/50',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/50',
    red: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-800/50',
    gray: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  }

  return (
    <span
      className={cn(
        'px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider border shadow-sm',
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge