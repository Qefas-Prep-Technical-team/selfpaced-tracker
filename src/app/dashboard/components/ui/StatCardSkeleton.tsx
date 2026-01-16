export default function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 flex flex-col gap-4 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="size-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      
      <div className="flex items-center gap-2 mt-2">
        <div className="size-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
  )
}