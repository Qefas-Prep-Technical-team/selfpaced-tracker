import { cn } from "@/lib/utils"

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton(props: SkeletonProps) {
  return (
   <div
  className={cn(
    "motion-safe:animate-pulse rounded-md bg-slate-200 dark:bg-slate-800",
    props.className
  )}
  {...props}
/>

  )
}
