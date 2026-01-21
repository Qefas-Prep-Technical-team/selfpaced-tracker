/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useQuery } from '@tanstack/react-query'
import { Activity, MapPin, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function LiveActivityFeed() {
  const { data, isLoading } = useQuery({
    queryKey: ['live-clicks'],
    queryFn: () => fetch('/api/inquiries/track-click/live').then(res => res.json()),
    refetchInterval: 10000, // Refresh every 10 seconds for a "live" feel
  });

  const clicks = data?.data || [];

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </div>
          <h3 className="font-bold text-sm dark:text-white uppercase tracking-wider">Live Activity</h3>
        </div>
        <Activity size={16} className="text-slate-400" />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />)
        ) : clicks.length > 0 ? (
          clicks.map((click: any) => (
            <div key={click._id} className="group relative pl-4 border-l-2 border-slate-100 dark:border-white/10 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold dark:text-white truncate max-w-[120px]">
                  {click.label || 'Unknown Click'}
                </p>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} />
                  {formatDistanceToNow(new Date(click.clickedAt))} ago
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <MapPin size={10} />
                <span>{click.city}, {click.country}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-center text-slate-500 py-4">Waiting for activity...</p>
        )}
      </div>

      <button className="w-full mt-4 py-2 text-[10px] font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
        VIEW ALL LOGS
      </button>
    </div>
  )
}