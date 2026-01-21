// app/analytics/page.tsx
'use client'

import { useState } from 'react'
import { 
  EthernetPort as Hub, MousePointer, MessageCircle, 
  Users, Headphones 
} from 'lucide-react'
import { DashboardControls } from './components/DashboardControls'
import StatCard from '../components/StatCard'
import { ChannelPerformanceChart } from './components/ChannelPerformanceChart'
import { InquiryFunnel } from './components/InquiryFunnel'
import { SubscriberGrowthChart } from './components/SubscriberGrowthChart'
import { BotHumanPieChart } from './components/BotHumanPieChart'


export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    {
      title: 'Total Channels',
      value: '12',
      change: '+2.4%',
      changeType: 'positive' as const,
      icon: Hub,
      sparkline: 'bar' as const,
    },
    {
      title: 'Total Clicks',
      value: '12.5k',
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: MousePointer,
      sparkline: 'bar' as const,
    },
    {
      title: 'Total Inquiries',
      value: '842',
      change: '-5.1%',
      changeType: 'negative' as const,
      icon: Headphones,
      sparkline: 'line' as const,
      iconBg: 'text-red-500',
    },
    {
      title: 'Active Conversations',
      value: '156',
      change: '+8.7%',
      changeType: 'positive' as const,
      icon: MessageCircle,
      sparkline: 'pulse' as const,
    },
    {
      title: 'Subscribers',
      value: '3,240',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: Users,
      sparkline: 'line' as const,
      iconBg: 'text-green-500',
    },
  ]

  return (
      <main className="flex-1 flex justify-center py-8">
        <div className="w-full max-w-[1280px] px-6">
          <DashboardControls />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ChannelPerformanceChart />
            <InquiryFunnel />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SubscriberGrowthChart />
            <BotHumanPieChart />
          </div>
        </div>
      </main>

    
  )
}