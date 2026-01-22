/* eslint-disable @typescript-eslint/no-explicit-any */
// components/analytics/DashboardControls.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, Filter, Download, Loader2 } from 'lucide-react'
import { Button } from '../../channel/components/ui/Button'

interface DashboardControlsProps {
  timeRange: string;
  setTimeRange: (val: string) => void;
  channel: string;
  setChannel: (val: string) => void;
  onExport: () => void;
}

export function DashboardControls({ timeRange, setTimeRange, channel, setChannel, onExport }: DashboardControlsProps) {
  
  // Fetch real channels from your DB
  const { data: channels = [], isLoading: isLoadingChannels } = useQuery({
    queryKey: ['channel-list'],
    queryFn: () => fetch('/api/channels/list').then(res => res.json())
  });

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-text-primary dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
          Global Analytics Overview
        </h1>
        <p className="text-text-secondary dark:text-slate-400 text-base font-normal">
          Real-time performance across {channels.length} active channels.
        </p>
      </div>

      <div className="flex gap-3">
        {/* Time Range Selector */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="pl-10 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option value="1d">Last 1Days</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        {/* Dynamic Channel Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          <select 
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="pl-10 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer disabled:opacity-50"
            disabled={isLoadingChannels}
          >
            <option value="all">All Channels</option>
            {channels.map((ch: any) => (
              <option key={ch._id} value={ch._id}>
                {ch.name}
              </option>
            ))}
          </select>
          {isLoadingChannels && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-slate-400" size={12} />
          )}
        </div>

        <Button variant="primary" icon={Download} onClick={onExport}>
          Export
        </Button>
      </div>
    </div>
  )
}