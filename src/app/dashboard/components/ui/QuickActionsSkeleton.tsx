export default function QuickActionsSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}