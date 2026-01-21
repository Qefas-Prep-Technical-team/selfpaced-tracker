'use client'

import { useEffect, useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { pusherClient } from '@/lib/pusher'
import { Button } from './ui/Button' // Assuming you have a reusable Button component

interface Activity {
  event: string
  user: string
  channel: { icon: string; name: string; color?: string }
  time: string
  status: 'success' | 'needs_action' | 'info'
}

const PAGE_SIZE = 6 // Set how many activities per page

const statusColors = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  needs_action: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  info: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
}

const eventIcons: Record<string, { icon: string; bg: string; text: string }> = {
  'New Subscription': { icon: 'verified_user', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600' },
  'AI Chat Handoff': { icon: 'handshake', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600' },
  'New Inquiry': { icon: 'person_add', bg: 'bg-primary/10', text: 'text-primary' },
  'Profile Updated': { icon: 'person', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500' },
}

export default function ActivityFeed() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/activities')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    }
  })

  // Real-time listener
  useEffect(() => {
    const channel = pusherClient.subscribe('dashboard-updates')
    
    channel.bind('new-activity', (newActivity: Activity) => {
      queryClient.setQueryData(['activities'], (old: Activity[] | undefined) => {
        const updated = old ? [newActivity, ...old] : [newActivity]
        // You might want to keep a larger buffer for pagination (e.g., 50)
        return updated.slice(0, 50) 
      })
    })

    return () => {
      pusherClient.unsubscribe('dashboard-updates')
    }
  }, [queryClient])

  // Pagination Logic
  const totalActivities = activities?.length || 0
  const totalPages = Math.ceil(totalActivities / PAGE_SIZE)
  
  const paginatedActivities = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return activities?.slice(start, start + PAGE_SIZE) || []
  }, [activities, page])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-lg">Recent Activity Feed</h3>
        <span className="text-xs font-medium text-slate-400">
            Total: {totalActivities}
        </span>
      </div>

      <div className="flex-1 overflow-x-auto min-h-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-[#4c739a] text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              [...Array(PAGE_SIZE)].map((_, i) => <ActivitySkeleton key={i} />)
            ) : (
              paginatedActivities.map((activity, index) => (
                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors animate-in fade-in slide-in-from-top-1 duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${eventIcons[activity.event]?.bg || 'bg-slate-100'} ${eventIcons[activity.event]?.text || 'text-slate-500'}`}>
                        <span className="material-symbols-outlined text-lg">{eventIcons[activity.event]?.icon || 'event_note'}</span>
                      </div>
                      <span className="text-sm font-medium truncate max-w-[150px]">{activity.event}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{activity.user}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#4c739a]">
                      <span className={`material-symbols-outlined text-base ${activity.channel.color || ''}`}>{activity.channel.icon}</span>
                      {activity.channel.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4c739a] whitespace-nowrap">{activity.time}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap ${statusColors[activity.status]}`}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
        <p className="text-xs text-slate-500">
          Page {page} of {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </td>
      <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded" /></td>
      <td className="px-6 py-4 text-right"><div className="ml-auto h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded" /></td>
    </tr>
  )
}