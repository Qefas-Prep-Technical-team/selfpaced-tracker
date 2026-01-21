// app/subscribers/page.tsx
'use client'

import { useState } from 'react'
import { SubscriptionFlow } from './components/SubscriptionFlow'
import { SubscriberTable } from './components/SubscriberTable'
import { Toast } from '../inquiries/components/ui/Toast'
import StatCard from '../components/StatCard'
import { stats, subscribers } from './components/subscribers'

export default function SubscribersPage() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setToastMessage(`Copied ${email} to clipboard`)
    setShowToast(true)
  }

  const handleUnsubscribe = (id: number) => {
    // Here you would typically make an API call
    const subscriber = subscribers.find(s => s.id === id)
    if (subscriber) {
      setToastMessage(`Unsubscribed ${subscriber.email}`)
      setShowToast(true)
    }
  }

  const handleExport = () => {
    // Here you would typically generate and download a CSV
    setToastMessage('Export started. You will receive an email shortly.')
    setShowToast(true)
  }

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

          {/* KPI Stats */}
         {/* KPI Stats */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {stats.map((stat) => (
    <StatCard
      key={stat.id}
      title={stat.title}
      value={stat.value}
      change={stat.change}
      changeType={stat.changeType} // Pass the changeType
      icon={stat.icon}             // Pass the icon
    />
  ))}
</div>

          {/* Subscribers Table */}
          <SubscriberTable
            subscribers={subscribers}
            onCopyEmail={handleCopyEmail}
            onUnsubscribe={handleUnsubscribe}
            onExport={handleExport}
          />
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