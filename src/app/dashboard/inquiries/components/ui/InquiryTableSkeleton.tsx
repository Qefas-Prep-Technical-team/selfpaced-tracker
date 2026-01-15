import { Skeleton } from "@/components/ui/Skeleton"

export function InquiryTableSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between gap-4 p-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-7 gap-4 px-6 py-4 items-center"
          >
            {/* Name */}
            <div className="flex items-center gap-3 col-span-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* WhatsApp */}
            <Skeleton className="h-4 w-28 col-span-1" />

            {/* Class */}
            <Skeleton className="h-4 w-20 col-span-1" />

            {/* Channel */}
            <Skeleton className="h-6 w-24 rounded-full col-span-1" />

            {/* Status */}
            <Skeleton className="h-6 w-20 rounded-full col-span-1" />

            {/* Date */}
            <Skeleton className="h-4 w-24 col-span-1" />

            {/* Actions */}
            <Skeleton className="h-8 w-8 rounded-md col-span-1 justify-self-end" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}
