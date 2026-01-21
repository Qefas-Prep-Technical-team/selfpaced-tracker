// components/analytics/DashboardControls.tsx
import { Calendar } from 'lucide-react'
import { Button } from '../../inquiries/components/ui/Button'


export function DashboardControls() {
  return (
    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-text-primary dark:text-white text-3xl font-black leading-tight tracking-tight">
          Click & Interaction Analytics
        </h1>
        <p className="text-text-secondary dark:text-gray-400 text-base font-normal">
          Real-time engagement tracking for your SaaS landing page.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" icon={Calendar} iconPosition="left">
          Last 30 Days
        </Button>
      </div>
    </div>
  )
}