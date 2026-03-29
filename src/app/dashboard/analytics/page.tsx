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

import { ChannelTrendsChart } from './components/ChannelTrendsChart'

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [channel, setChannel] = useState('all')

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['global-stats', timeRange, channel],
    queryFn: () => fetch(`/api/analytics/global-stats?range=${timeRange}&channel=${channel}`).then(res => res.json())
  })

  const handleExport = () => {
    window.print();
  }

const stats = [
  {
    title: 'Total Inquiries',
    value: statsData?.inquiries?.value || '0',
    change: statsData?.inquiries?.change || '0%',
    changeType: statsData?.inquiries?.type || 'positive',
    icon: Headphones,
    progress: 75,
    progressColor: "bg-emerald-500"
  },
  {
    title: 'Total Clicks',
    value: statsData?.clicks?.value || '0',
    change: statsData?.clicks?.change || '0%',
    changeType: statsData?.clicks?.type || 'positive',
    icon: MousePointer,
    progress: 60,
    progressColor: "bg-blue-500"
  },
  {
    title: 'Active Leads',
    value: statsData?.conversations || '0',
    change: 'Live',
    changeType: 'positive' as const,
    icon: MessageCircle,
    progress: 45,
    progressColor: "bg-indigo-500"
  },
  {
    title: 'Subscribers',
    value: statsData?.subscribers || '0',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
    progress: 88,
    progressColor: "bg-purple-500"
  },
  {
    title: 'Conversion Rate',
    value: '4.2%',
    change: '+0.5%',
    changeType: 'positive' as const,
    icon: Hub,
    progress: 35,
    progressColor: "bg-pink-500"
  },
];

  return (
    <main className="flex-1 flex justify-center py-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
      <div className="w-full max-w-[1400px] px-6">
        <DashboardControls 
          timeRange={timeRange} 
          setTimeRange={setTimeRange}
          channel={channel}
          setChannel={setChannel}
          onExport={handleExport}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {isLoading 
            ? [1,2,3,4,5].map(i => <div key={i} className="h-40 bg-white/50 dark:bg-white/5 animate-pulse rounded-2xl border border-slate-200 dark:border-white/10" />)
            : stats.map((stat, index) => <StatCard key={index} {...stat} />)
          }
        </div>

        {/* Primary Insight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <ChannelTrendsChart filter={{ timeRange, channel }} />
          </div>
          <div className="lg:col-span-1">
            <BotHumanPieChart filter={{ timeRange, channel }} />
          </div>
        </div>

        {/* Secondary Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ChannelPerformanceChart filter={{ timeRange, channel }} />
          <InquiryFunnel filter={{ timeRange, channel }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <SubscriberGrowthChart filter={{ timeRange, channel }} />
          <TopLocationsChart filter={{ timeRange, channel }} />
        </div>
      </div>
    </main>
  )
}