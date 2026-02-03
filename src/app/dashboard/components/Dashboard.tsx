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
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-300">
        {/* Animated loading header */}
        <div className="mb-6">
          <div className="h-8 w-48 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800 animate-pulse rounded-lg mb-2"></div>
          <div className="h-4 w-64 bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-slate-900 animate-pulse rounded-lg"></div>
        </div>

        {/* Stats grid loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
              </div>
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
              <div className="h-4 w-16 bg-slate-100 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Quick Actions loading */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
            ))}
          </div>
        </div>

        {/* Activity Feed loading */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="p-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-4 mb-4">
                <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" style={{ animationDelay: `${i * 0.1 + 0.1}s` }}></div>
                  <div className="h-3 w-32 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <svg className="size-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Error loading dashboard</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Unable to fetch dashboard statistics</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-in fade-in duration-500">
          <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="size-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No data available</h3>
          <p className="text-slate-600 dark:text-slate-400">Dashboard statistics are currently unavailable</p>
        </div>
      </div>
    )
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