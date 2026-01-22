// app/analytics/page.tsx
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { EthernetPort as Hub, MousePointer, MessageCircle, Users, Headphones } from 'lucide-react'
import { DashboardControls } from './components/DashboardControls'
import StatCard from '../components/StatCard'
import { ChannelPerformanceChart } from './components/ChannelPerformanceChart'
import { InquiryFunnel } from './components/InquiryFunnel'
import { SubscriberGrowthChart } from './components/SubscriberGrowthChart'
import { BotHumanPieChart } from './components/BotHumanPieChart'
import { TopLocationsChart } from './components/TopLocationsChart'
// ... import charts ...

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [channel, setChannel] = useState('all')

  // Fetch stats dynamically based on filters
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['global-stats', timeRange, channel],
    queryFn: () => fetch(`/api/analytics/global-stats?range=${timeRange}&channel=${channel}`).then(res => res.json())
  })

  // Export handler
  const handleExport = () => {
    window.print(); // Or call your CSV export API
  }

 // Inside AnalyticsDashboard component
const stats = [
  {
    title: 'Total Channels',
    value: statsData?.channels?.toString() || '0',
    change: 'Live',
    changeType: 'positive' as const,
    icon: Hub,
  },
  {
    title: 'Total Clicks',
    value: statsData?.clicks?.value || '0',
    change: statsData?.clicks?.change || '0%',
    changeType: statsData?.clicks?.type || 'positive',
    icon: MousePointer,
  },
  {
    title: 'Total Inquiries',
    value: statsData?.inquiries?.value || '0',
    change: statsData?.inquiries?.change || '0%',
    changeType: statsData?.inquiries?.type || 'positive',
    icon: Headphones,
  },
  {
    title: 'Active Conversations',
    value: statsData?.conversations || '0',
    change: 'New/Unread',
    changeType: 'positive' as const,
    icon: MessageCircle,
  },
  {
    title: 'Subscribers',
    value: statsData?.subscribers || '0',
    change: 'Total list',
    changeType: 'positive' as const,
    icon: Users,
  },
];

  return (
    <main className="flex-1 flex justify-center py-8">
      <div className="w-full max-w-[1280px] px-6">
        <DashboardControls 
          timeRange={timeRange} 
          setTimeRange={setTimeRange}
          channel={channel}
          setChannel={setChannel}
          onExport={handleExport}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {isLoading 
            ? [1,2,3,4,5].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl border border-slate-200 dark:border-white/10" />)
            : stats.map((stat, index) => <StatCard key={index} {...stat} />)
          }
        </div>

        {/* Charts - Make sure to pass timeRange/channel to these components too */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChannelPerformanceChart filter={{ timeRange, channel }} />
          <InquiryFunnel filter={{ timeRange, channel }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <SubscriberGrowthChart filter={{ timeRange, channel }} />
          <BotHumanPieChart filter={{ timeRange, channel }} /> 
          <TopLocationsChart filter={{ timeRange, channel }} />
        </div>
      </div>
    </main>
  )
}