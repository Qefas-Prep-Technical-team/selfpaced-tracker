// components/ui/StatCard.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  progress?: number
  progressColor?: string
  icon?: ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  progress,
  progressColor = 'bg-slate-400',
  icon,
  className
}: StatCardProps) {
  const changeColors = {
    positive: 'text-emerald-500',
    negative: 'text-red-500',
    neutral: 'text-slate-500'
  }

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group",
      className
    )}>
      {icon && (
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      )}
      
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      
      <div className="flex items-baseline gap-2 mt-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        {change && (
          <span className={cn(
            "text-xs font-bold",
            changeColors[changeType]
          )}>
            {change}
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
          <div 
            className={cn("h-full rounded-full", progressColor)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}