// components/ui/Skeleton.tsx
import { cn } from "@/lib/utils"

export const SkeletonText = ({ width = 'full', height = '4', className = '' }: { width?: string, height?: string, className?: string }) => (
  <div 
    className={cn("bg-gray-200 dark:bg-gray-700 rounded animate-pulse", className)}
    style={{ 
      width: width.startsWith('w-') ? undefined : width, // Supports Tailwind w-32 or 100px
      height: height === '4' ? '1rem' : height === '5' ? '1.25rem' : height === '6' ? '1.5rem' : height
    }}
  />
)

export const SkeletonBadge = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
    <SkeletonText width="w-16" height="4" className="w-16" />
  </div>
)

export const SkeletonProgressBar = () => (
  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
)

export const SkeletonIcon = ({ size = '9' }: { size?: string }) => (
  <div 
    className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
    style={{ 
      width: size === '9' ? '2.25rem' : '1.5rem', 
      height: size === '9' ? '2.25rem' : '1.5rem' 
    }}
  />
)

export const SkeletonButton = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
  <div 
    className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
    style={{ 
      width: size === 'sm' ? '6rem' : '8rem', 
      height: size === 'sm' ? '2rem' : '3rem' 
    }}
  />
)

export const SkeletonDropdown = () => (
  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-8 h-8 animate-pulse" />
)