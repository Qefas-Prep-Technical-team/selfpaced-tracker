export interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  label: string
}

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  label,
}: StatCardProps) {
  const isPositive = trend === 'up'
  
  return (
    <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-[#4c739a] text-sm font-medium">{title}</p>
        {/* <span className="material-symbols-outlined text-primary">
          {icon}
        </span> */}
      </div>
      
      <p className="text-2xl font-bold">{value}</p>
      
      <div className="flex items-center gap-1 mt-1">
        <span
          className={`material-symbols-outlined text-sm ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? 'trending_up' : 'trending_down'}
        </span>
        
        <p
          className={`text-xs font-semibold ${
            isPositive
              ? 'text-green-600 dark:text-green-500'
              : 'text-red-600 dark:text-red-500'
          }`}
        >
          {change}
        </p>
        
        <span className="text-[#4c739a] text-xs">{label}</span>
      </div>
    </div>
  )
}