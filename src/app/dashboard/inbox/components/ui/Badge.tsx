import { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  color: 'blue' | 'orange' | 'purple' | 'green' | 'red' | 'gray'
  className?: string
}

const Badge: FC<BadgeProps> = ({ children, color, className }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    gray: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  }

  return (
    <span
      className={cn(
        'px-2 py-1 text-[10px] font-bold rounded',
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge