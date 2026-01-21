// components/dashboard/TableSkeleton.tsx
import { 
  SkeletonText, 
  SkeletonBadge, 
  SkeletonProgressBar, 
  SkeletonIcon, 
  SkeletonButton, 
  SkeletonDropdown 
} from "./ui/Skeleton"

export const SkeletonTableRow = ({ columns = 7 }: { columns?: number }) => (
  <tr className="border-b border-slate-100 dark:border-[#324d67]">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-5">
        <div className="space-y-2">
          {i === 0 ? (
            <div className="flex items-center gap-3">
              <SkeletonIcon size="9" />
              <div className="min-w-0 flex-1 space-y-2">
                <SkeletonText className="w-32" height="5" />
                <SkeletonText className="w-24" height="4" />
              </div>
            </div>
          ) : i === 1 || i === 2 ? (
            <SkeletonBadge />
          ) : i === 4 || i === 5 ? (
            <div className="flex items-center gap-3">
              <SkeletonProgressBar />
              <SkeletonText className="w-8" />
            </div>
          ) : i === 6 ? (
            <div className="flex justify-end">
              <SkeletonDropdown />
            </div>
          ) : (
            <SkeletonText className="w-24" />
          )}
        </div>
      </td>
    ))}
  </tr>
)

export const SkeletonTable = () => (
  <div className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648] rounded-xl overflow-hidden shadow-sm animate-pulse">
    {/* ... filter skeleton code from your original file ... */}
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-[#192633] border-b border-slate-200 dark:border-[#324d67]">
          <tr>
            {Array.from({ length: 7 }).map((_, i) => (
              <th key={i} className="px-6 py-4">
                <SkeletonText className="w-20" height="5" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <SkeletonTableRow key={rowIndex} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)