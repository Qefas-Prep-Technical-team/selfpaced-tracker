// components/analytics/StatCard.tsx
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  progress: number
  progressColor: string
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType,
  progress,
  progressColor,
  className
}: StatCardProps) {
  return (
    <div className={`
      bg-white dark:bg-white/5 rounded-xl p-6 border border-surface-dark dark:border-white/10 shadow-sm
      ${className}
    `}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-text-secondary dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <span className={`
          px-2 py-1 rounded text-xs font-bold flex items-center gap-1
          ${changeType === 'positive'
            ? 'text-[#078847] bg-[#e6f3ec] dark:bg-green-500/10'
            : 'text-[#e74808] bg-[#fdf2ed] dark:bg-orange-500/10'
          }
        `}>
          {changeType === 'positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </span>
      </div>
      <p className="text-text-primary dark:text-white text-3xl font-black">
        {value}
      </p>
      <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}