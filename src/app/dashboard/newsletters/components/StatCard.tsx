// components/subscriptions/StatCard.tsx
import { LucideIcon, TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change: string
  icon?: LucideIcon
  className?: string
}

export function StatCard({ title, value, change, icon: Icon, className }: StatCardProps) {
  return (
    <div className={`
      bg-white dark:bg-white/5 p-6 rounded-xl border border-surface-light dark:border-white/10 shadow-sm
      flex flex-col gap-2 ${className}
    `}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-[#734c9a]">{title}</p>
        {/* <Icon className="text-[#734c9a] text-lg" /> */}
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <div className="flex items-center gap-1 text-[#078847] text-sm font-bold">
        <TrendingUp size={14} />
        <span>{change}</span>
      </div>
    </div>
  )
}