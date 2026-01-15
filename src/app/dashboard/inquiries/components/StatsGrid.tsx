'use client'

import { Users, BellRing, CheckCircle, Clock } from 'lucide-react'
import { StatCard } from './ui/StatCard'
import { useInquiryStats } from './useInquiryStats'
import { StatsGridSkeleton } from './StatsGridSkeleton'

export function StatsGrid() {
  const { data, isLoading } = useInquiryStats()
  if (isLoading) return <StatsGridSkeleton />
  if (!data?.stats) return null

  const stats = data.stats

  // 1. Correctly access the nested percentageChange
  const totalChangeValue = stats?.monthly?.total?.percentageChange || 0
  const newChangeValue = stats?.monthly?.new?.percentageChange || 0
  const contactedChangeValue = stats?.monthly?.contacted?.percentageChange || 0
  const followupChangeValue = stats?.monthly?.followup?.percentageChange || 0

  // 2. Access the .current value for the main display
  const totalCount = stats.total.current || 0
  const newCount = stats.new.current || 0
  const contactedCount = stats.contacted.current || 0
  const followupCount = stats.followup.current || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Inquiries"
        value={totalCount} // Changed from stats.total
        change={`${totalChangeValue}%`}
        changeType={totalChangeValue >= 0 ? 'positive' : 'negative'}
        progress={100}
        progressColor="bg-slate-400"
        icon={<Users size={40} />}
      />

      <StatCard
        title="New"
        value={newCount} // Changed from stats.new
        change={`${newChangeValue}%`}
        changeType={newChangeValue >= 0 ? 'positive' : 'negative'}
        progress={(newCount / totalCount) * 100 || 0}
        progressColor="bg-primary"
        icon={<BellRing size={40} />}
      />

      {/* ... Repeat for Contacted and Follow-up using .current values ... */}
      <StatCard
        title="Contacted"
        value={contactedCount}
        change={`${contactedChangeValue}%`}
        changeType={contactedChangeValue >= 0 ? 'positive' : 'negative'}
        progress={totalCount > 0 ? (contactedCount / totalCount) * 100 : 0}
        progressColor="bg-emerald-500"
        icon={<CheckCircle size={40} />}
      />

      <StatCard
        title="Follow-up"
        value={followupCount}
        change={`${followupChangeValue}%`}
        changeType={followupChangeValue >= 0 ? 'positive' : 'negative'}
        progress={totalCount > 0 ? (followupCount / totalCount) * 100 : 0}
        progressColor="bg-orange-500"
        icon={<Clock size={40} />}
      />
    </div>
  )
}