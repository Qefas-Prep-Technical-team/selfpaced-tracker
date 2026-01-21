// components/dashboard/StatCard.tsx
import { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon?: LucideIcon;                 // Made optional with "?"
  label?: string
  progress?: number;                 // Added to support ClickAnalytics data
  progressColor?: string;            // Added to support ClickAnalytics data
  sparkline?: 'bar' | 'line' | 'pulse'
}

export default function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  label = "vs last month",
  progress,
  progressColor = "bg-primary"
}: StatCardProps) {
  const isPositive = changeType === 'positive'
  
  return (
    <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-[#4c739a] text-sm font-medium">{title}</p>
        {/* Only render Icon if it exists */}
        {Icon && (
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
             <Icon size={18} className="text-primary" />
          </div>
        )}
      </div>
      
      <p className="text-2xl font-bold">{value}</p>
      
      {/* Render Progress Bar if progress exists */}
      {progress !== undefined && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${progressColor}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
      
      <div className="flex items-center gap-1 mt-1">
        <span className={`material-symbols-outlined text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? 'trending_up' : 'trending_down'}
        </span>
        
        <p className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {change}
        </p>
        
        <span className="text-[#4c739a] text-xs">{label}</span>
      </div>
    </div>
  )
}