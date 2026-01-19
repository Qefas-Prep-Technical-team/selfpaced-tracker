// components/analytics/DashboardControls.tsx
import { Calendar, Filter, Download } from 'lucide-react'
import { Button } from '../../channel/components/ui/Button'

export function DashboardControls() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-text-primary dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
          Global Analytics Overview
        </h1>
        <p className="text-text-secondary dark:text-slate-400 text-base font-normal">
          Tracking cross-channel performance and user engagement metrics.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" icon={Calendar} iconPosition="left">
          Last 30 Days
        </Button>
        <Button variant="outline" icon={Filter} iconPosition="left">
          Channel Type
        </Button>
        <Button variant="primary" icon={Download}>
          Export Report
        </Button>
      </div>
    </div>
  )
}