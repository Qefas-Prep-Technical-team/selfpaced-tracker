'use client'

import { useQuery } from '@tanstack/react-query'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts'
import { Loader2 } from 'lucide-react'

interface FilterProps {
  filter: { timeRange: string; channel: string }
}

export function ChannelPerformanceChart({ filter }: FilterProps) {
  // Fetch dynamic data from the API we built
  const { data: channelData = [], isLoading } = useQuery({
    queryKey: ['channel-performance', filter.timeRange],
    queryFn: () => fetch(`/api/analytics/channels?range=${filter.timeRange}`).then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <Loader2 className="animate-spin text-primary" />
        <p className="text-xs text-slate-500 mt-2">Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">
          Channel Performance
        </h3>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-[#734c9a]" />
            <span className="text-slate-500">Leads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-[#cbd5e1] dark:bg-slate-700" />
            <span className="text-slate-500">Messages</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={channelData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#e2e8f0" 
              className="dark:stroke-slate-800" 
            />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
              itemStyle={{ padding: '0px' }}
            />
            
            {/* Leads Bar */}
            <Bar 
              dataKey="leads" 
              fill="#734c9a" 
              radius={[4, 4, 0, 0]} 
              barSize={24} 
            />
            
            {/* Messages Bar */}
            <Bar 
              dataKey="messages" 
              fill="#cbd5e1" 
              radius={[4, 4, 0, 0]} 
              barSize={24} 
              className="dark:fill-slate-700"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}