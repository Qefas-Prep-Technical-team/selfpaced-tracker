export default function ActivityFeedSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2, 3, 4].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5].map((cell) => (
                  <td key={cell} className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}