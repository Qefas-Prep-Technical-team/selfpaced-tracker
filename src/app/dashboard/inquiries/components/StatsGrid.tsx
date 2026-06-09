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
  const totalChangeValue = stats?.total?.percentageChange || 0
  const newChangeValue = stats?.new?.percentageChange || 0
  const contactedChangeValue = stats?.contacted?.percentageChange || 0
  const followupChangeValue = stats?.followup?.percentageChange || 0

  // 2. Access the .current value for the main display
  const totalCount = stats.total.current || 0
  const newCount = stats.new.current || 0
  const contactedCount = stats.contacted.current || 0
  const followupCount = stats.followup.current || 0

  // Helper to compute remaining contacts and progress towards surpassing previous month
  const getGoalDetails = (current: number, previous: number) => {
    if (previous === 0) {
      return {
        progress: current > 0 ? 100 : 0,
        description: current > 0 ? "Surpassed last month!" : "No records yet"
      }
    }
    
    const progress = Math.min((current / previous) * 100, 100)
    
    if (current > previous) {
      const ahead = current - previous
      return {
        progress: 100,
        description: `${ahead} contact${ahead > 1 ? 's' : ''} ahead of last month`
      }
    } else {
      const left = (previous + 1) - current
      return {
        progress,
        description: `${left} contact${left > 1 ? 's' : ''} left to surpass last month`
      }
    }
  }

  const totalGoal = getGoalDetails(totalCount, stats.total.previous || 0)
  const newGoal = getGoalDetails(newCount, stats.new.previous || 0)
  const contactedGoal = getGoalDetails(contactedCount, stats.contacted.previous || 0)
  const followupGoal = getGoalDetails(followupCount, stats.followup.previous || 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <StatCard
        title="Total Inquiries"
        value={totalCount}
        change={`${totalChangeValue}%`}
        changeType={totalChangeValue >= 0 ? 'positive' : 'negative'}
        progress={totalGoal.progress}
        progressColor="bg-slate-400"
        description={totalGoal.description}
        icon={<Users size={40} />}
      />

      <StatCard
        title="New"
        value={newCount}
        change={`${newChangeValue}%`}
        changeType={newChangeValue >= 0 ? 'positive' : 'negative'}
        progress={newGoal.progress}
        progressColor="bg-primary"
        description={newGoal.description}
        icon={<BellRing size={40} />}
      />

      <StatCard
        title="Contacted"
        value={contactedCount}
        change={`${contactedChangeValue}%`}
        changeType={contactedChangeValue >= 0 ? 'positive' : 'negative'}
        progress={contactedGoal.progress}
        progressColor="bg-emerald-500"
        description={contactedGoal.description}
        icon={<CheckCircle size={40} />}
      />

      <StatCard
        title="Follow-up"
        value={followupCount}
        change={`${followupChangeValue}%`}
        changeType={followupChangeValue >= 0 ? 'positive' : 'negative'}
        progress={followupGoal.progress}
        progressColor="bg-orange-500"
        description={followupGoal.description}
        icon={<Clock size={40} />}
      />
    </div>
  )
}