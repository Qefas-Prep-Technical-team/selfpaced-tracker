'use client'
import { useEffect, useState } from 'react'
import StatCard from './StatCard'
import QuickActions from './QuickActions'
import ActivityFeed from './ActivityFeed'
import useDashboardStats from './hook'
import StatCardSkeleton from './ui/StatCardSkeleton'
import { DashboardStateHandler } from './ui/DashboardStates'
import { Users, UserPlus, MessageSquare, BrainCircuit } from 'lucide-react'

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardStats()


  if (isLoading) {
    return <StatCardSkeleton />
  }
  if (error) {
    return <div>Error loading dashboard stats.</div>
  }
  if (!data) {
    return <div>No data available.</div>
  }

  // Inside your Dashboard component
  const stats = [
    {
      title: 'Newsletter Subscribers',
      ...data.newsletter,
      icon: Users, // Pass the component, not a string
      label: 'vs last month',
    },
    {
      title: 'Contact Sign-ups',
      ...data.inquiries,
      icon: UserPlus,
      label: 'vs last month',
    },
    {
      title: 'Monthly Active Chats',
      ...data.activeChats,
      icon: MessageSquare,
      label: 'last 30 days',
    },
    {
      title: 'AI Success Rate',
      ...data.aiRate,
      icon: BrainCircuit,
      label: 'automation efficiency',
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStateHandler
          data={data}
          isLoading={isLoading}
          error={error}
          onRetry={() => { }}
        >


          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              {...stat}
              // This line solves the error
              trend={stat.trend as "up" | "down"}
            />
          ))}
        </DashboardStateHandler>
      </div>
      <QuickActions />
      <ActivityFeed />
    </div>
  )
}