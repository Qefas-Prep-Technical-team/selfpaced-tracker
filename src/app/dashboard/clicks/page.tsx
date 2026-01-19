// app/analytics/click/page.tsx
'use client'

import StatCard from "../components/StatCard"
import { ClickedElementsTable } from "./components/ClickedElementsTable"
import { DashboardControls } from "./components/DashboardControls"
import { DeviceBreakdownChart } from "./components/DeviceBreakdownChart"
import { HeatmapTeaser } from "./components/HeatmapTeaser"


export default function ClickAnalyticsPage() {
  const stats = [
    {
      title: 'Total Clicks',
      value: '45,201',
      change: '+12.5%',
      changeType: 'positive' as const,
      progress: 75,
      progressColor: 'bg-primary'
    },
    {
      title: 'Unique Visitors',
      value: '12,840',
      change: '+5.2%',
      changeType: 'positive' as const,
      progress: 60,
      progressColor: 'bg-blue-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.4%',
      changeType: 'negative' as const,
      progress: 32,
      progressColor: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-8">
        <DashboardControls />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table Section */}
          <div className="lg:col-span-2">
            <ClickedElementsTable />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DeviceBreakdownChart />
            <HeatmapTeaser />
          </div>
        </div>
      </main>
    </div>
  )
}