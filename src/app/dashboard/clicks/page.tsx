/* eslint-disable @typescript-eslint/no-explicit-any */
// app/analytics/click/page.tsx
'use client'

import { useQuery } from "@tanstack/react-query"
import StatCard from "../components/StatCard"
import { ClickedElementsTable } from "./components/ClickedElementsTable"
import { DashboardControls } from "./components/DashboardControls"
import { LocationBreakdownChart } from "./components/LocationBreakdownChart"
import { LiveActivityFeed } from "./components/LiveActivityFeed"
import { MousePointer2, Users, Target } from 'lucide-react'




export default function ClickAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['click-stats'],
    queryFn: () => fetch('/api/inquiries/track-click/stats').then(res => res.json())
  });

  const s = data?.stats;

const statsConfig = [
  {
    title: 'Total Clicks',
    // 1. Add ? after clicks
    value: s?.clicks?.value?.toLocaleString() ?? '0', 
    // 2. Add ? after clicks and provide a fallback for the comparison
    change: `${(s?.clicks?.change ?? 0) >= 0 ? '+' : ''}${s?.clicks?.change ?? 0}%`,
    changeType: ((s?.clicks?.change ?? 0) >= 0 ? 'positive' : 'negative') as any,
    progress: 100,
    icon: MousePointer2
  },
  {
    title: 'Unique Visitors',
    value: s?.uniques?.value?.toLocaleString() ?? '0',
    change: `${(s?.uniques?.change ?? 0) >= 0 ? '+' : ''}${s?.uniques?.change ?? 0}%`,
    changeType: ((s?.uniques?.change ?? 0) >= 0 ? 'positive' : 'negative') as any,
    progress: 80,
    progressColor: 'bg-blue-500',
    icon: Users
  },
  {
    title: 'Conversion Rate',
    value: `${s?.conversion?.value ?? 0}%`,
    change: `${(s?.conversion?.change ?? 0) >= 0 ? '+' : ''}${s?.conversion?.change ?? 0}%`,
    changeType: ((s?.conversion?.change ?? 0) >= 0 ? 'positive' : 'negative') as any,
    progress: parseFloat(s?.conversion?.value ?? 0),
    progressColor: 'bg-orange-500',
    icon: Target
  }
];
  return (
      <main className="max-w-300 mx-auto px-6 md:px-10 py-8">
        <DashboardControls />

        {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {isLoading 
        ? [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />)
        : statsConfig.map((stat, index) => <StatCard key={index} {...stat} />)
      }
    </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table Section */}
          <div className="lg:col-span-2">
            <ClickedElementsTable />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LocationBreakdownChart />
            <LiveActivityFeed />
          </div>
        </div>
      </main>
   
  )
}