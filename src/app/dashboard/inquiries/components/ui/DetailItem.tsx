// components/ui/DetailItem.tsx
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface DetailItemProps {
  icon: LucideIcon
  label: string
  value: ReactNode
  className?: string
}

export function DetailItem({ icon: Icon, label, value, className }: DetailItemProps) {
  return (
    <div className={`grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] py-5 items-center border-b border-surface-light/50 dark:border-surface-dark/50 ${className}`}>
      <div className="flex items-center gap-3">
        <Icon className="text-text-secondary" size={20} />
        <p className="text-text-secondary text-sm font-medium">{label}</p>
      </div>
      <p className="text-text-primary dark:text-white text-base font-semibold">
        {value}
      </p>
    </div>
  )
}