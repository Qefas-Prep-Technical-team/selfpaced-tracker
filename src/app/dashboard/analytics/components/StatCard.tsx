// components/analytics/StatCard.tsx
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: LucideIcon
  sparkline?: 'bar' | 'line' | 'pulse'
  iconBg?: string
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  sparkline = 'bar',
  iconBg = 'text-primary'
}: StatCardProps) {
  const renderSparkline = () => {
    switch (sparkline) {
      case 'bar':
        return (
          <div className="h-8 w-24 ml-auto flex items-end gap-1">
            {[4, 6, 5, 8].map((height, i) => (
              <div
                key={i}
                className={`
                  w-2 rounded-t-sm
                  ${i === 3 ? 'bg-primary' : 'bg-primary/30'}
                `}
                style={{ height: `${height * 4}%` }}
              />
            ))}
          </div>
        )
      case 'line':
        return (
          <div className="h-8 w-24 ml-auto">
            <svg className="w-full h-full text-green-500" viewBox="0 0 100 40">
              <path 
                d="M0 35 L20 30 L40 25 L60 15 L80 10 L100 5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              />
            </svg>
          </div>
        )
      case 'pulse':
        return (
          <div className="h-8 w-24 ml-auto flex items-end">
            <div className="w-full h-3/4 bg-primary/20 rounded-t-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/40 animate-pulse" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-border-light dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-text-secondary dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <Icon className={`${iconBg} text-xl`} />
      </div>
      <p className="text-text-primary dark:text-white text-2xl font-bold leading-tight">
        {value}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <span className={`
          px-1.5 py-0.5 rounded text-xs font-bold
          ${changeType === 'positive'
            ? 'text-[#078838] bg-[#078838]/10'
            : 'text-[#e73908] bg-[#e73908]/10'
          }
        `}>
          {change}
        </span>
        {renderSparkline()}
      </div>
    </div>
  )
}