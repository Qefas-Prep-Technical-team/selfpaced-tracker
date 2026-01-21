/* eslint-disable @typescript-eslint/no-explicit-any */
// app/subscribers/page.tsx
'use client'

import { useState } from 'react'
import { SubscriptionFlow } from './components/SubscriptionFlow'
import { SubscriberTable } from './components/SubscriberTable'
import { Toast } from '../inquiries/components/ui/Toast'
import StatCard from '../components/StatCard'
import { Users, UserPlus, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export default function SubscribersPage() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['newsletter-stats'],
    queryFn: () => fetch('/api/newsletter/stats').then(res => res.json())
  });

  const statsConfig = [
    {
      id: 1,
      title: 'Total Subscribers',
      value: statsData?.total?.value || '0',
      change: statsData?.total?.change || '0%',
      changeType: statsData?.total?.type || 'positive',
      icon: Users,
    },
    {
      id: 2,
      title: 'New This Month',
      value: statsData?.newThisMonth?.value || '0',
      change: 'Recent joins',
      changeType: 'positive',
      icon: UserPlus,
      progress: statsData?.newThisMonth?.percentage || 0,
      progressColor: 'bg-indigo-500'
    },
    {
      id: 3,
      title: 'Avg. Growth Rate',
      value: `${statsData?.total?.change || '0%'}`,
      change: 'Overall momentum',
      changeType: statsData?.total?.type || 'positive',
      icon: TrendingUp,
    }
  ];

 
  return (
    
      <    >
      
      <main className="flex-1  p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black tracking-tight">
              Newsletter Subscribers
            </h2>
            <p className="text-[#734c9a] dark:text-[#a686c7]">
              Manage and track your subscriber growth and pipeline efficiency.
            </p>
          </div>

          {/* Subscription Flow */}
          <SubscriptionFlow />

          {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading 
            ? [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />)
            : statsConfig.map((stat) => (
                <StatCard
                  key={stat.id}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType as any}
                  icon={stat.icon}
                  progress={stat.progress}
                  progressColor={stat.progressColor}
                />
              ))
          }
        </div>
          {/* Subscribers Table */}
          <SubscriberTable/>
        </div>
      </main>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          title="Success"
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
</>
  )
}