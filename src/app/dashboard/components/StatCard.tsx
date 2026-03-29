// components/dashboard/StatCard.tsx
import { LucideIcon } from 'lucide-react'
import { ElementType } from 'react';

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon?: ElementType; // Change from LucideIcon to ElementType
  label?: string;
  progress?: number;
  progressColor?: string;
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
  const isPositive = changeType === 'positive';

  return (
    <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md dark:bg-slate-900/70 flex flex-col gap-3 rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200 dark:border-white/10 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl">
      {/* Decorative gradient blur */}
      <div className="absolute -right-4 -top-4 size-24 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start relative z-10">
        <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{title}</p>
        
        {Icon && (
          <div className="p-2 sm:p-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Icon className="size-4 sm:size-5" strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
        
        <div className="flex items-center gap-1.5 mt-2">
            <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                isPositive 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
            }`}>
                {isPositive ? '↑' : '↓'} {change}
            </div>
            <span className="text-slate-400 text-[10px] font-medium tracking-tight">{label}</span>
        </div>
      </div>

      {/* Render Progress Bar if progress exists */}
      {progress !== undefined && (
        <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full mt-1 overflow-hidden relative z-10">
          <div
            className={`h-full transition-all duration-1000 ${progressColor} shadow-[0_0_12px_rgba(0,0,0,0.1)]`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}