import { FC } from 'react'
import { cn } from '@/lib/utils'

interface ChipProps {
  label: string
  active?: boolean
  onClick?: () => void
}

const Chip: FC<ChipProps> = ({ label, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-7 shrink-0 items-center justify-center gap-x-1 rounded-full px-3 text-xs font-medium transition-colors',
        active
          ? 'bg-primary text-white'
          : 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      )}
    >
      {label}
    </button>
  )
}

export default Chip