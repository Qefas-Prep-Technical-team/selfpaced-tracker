/* eslint-disable @typescript-eslint/no-explicit-any */
// components/analytics/DashboardControls.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, Filter, Download, Loader2, BarChart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../channel/components/ui/Button'

interface DashboardControlsProps {
  timeRange: string;
  setTimeRange: (val: string) => void;
  channel: string;
  setChannel: (val: string) => void;
  onExport: () => void;
}

export function DashboardControls({ timeRange, setTimeRange, channel, setChannel, onExport }: DashboardControlsProps) {
  
  const { data: channels = [], isLoading: isLoadingChannels } = useQuery({
    queryKey: ['channel-list'],
    queryFn: async () => {
      const res = await fetch('/api/channels/list');
      const json = await res.json();
      return json.data || []; 
    }
  });

  return (
    <div className="flex flex-col gap-6 mb-10 overflow-visible">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 mb-1">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Live Analytics</span>
          </div>
          <h1 className="text-slate-900 dark:text-white text-2xl sm:text-4xl font-black leading-none tracking-tight text-center md:text-left">
            Performance <span className="text-primary italic">Insights</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium max-w-md text-center md:text-left mx-auto md:mx-0">
            Monitoring <span className="text-slate-900 dark:text-slate-200 font-bold">{channels.length} channels</span> with real-time data aggregation.
          </p>
        </div>

        <Link href="/dashboard/analytics/channels" className="w-full md:w-auto">
          <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 md:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group w-full md:w-auto justify-center md:justify-start">
            <BarChart size={16} className="group-hover:rotate-12 transition-transform" />
            Analyse Channels
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2.5 bg-white/50 backdrop-blur-sm dark:bg-white/5 p-2 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-sm">
        {/* Time Range Selector */}
        <div className="group relative w-full lg:w-auto">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={14} />
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full lg:w-auto pl-9 pr-8 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:border-primary/50 transition-all outline-none"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="6m">6 Months</option>
          </select>
        </div>

        {/* Dynamic Channel Filter */}
        <div className="group relative w-full lg:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={14} />
          <select 
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full lg:w-auto pl-9 pr-8 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer disabled:opacity-50 hover:border-primary/50 transition-all outline-none"
            disabled={isLoadingChannels}
          >
            <option value="all">Global (All Channels)</option>
            {channels?.map((ch: any) => (
              <option key={ch._id} value={ch.name}>
                {ch.name}
              </option>
            ))}
          </select>
          {isLoadingChannels && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-primary" size={12} />
          )}
        </div>

        <div className="w-full lg:w-auto sm:col-span-2 lg:col-span-1">
            <Button 
                variant="primary" 
                icon={Download} 
                onClick={onExport}
                className="w-full lg:w-auto rounded-xl h-10 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all text-[11px] font-black uppercase tracking-wider"
            >
            Export
            </Button>
        </div>
      </div>
    </div>
  )
}