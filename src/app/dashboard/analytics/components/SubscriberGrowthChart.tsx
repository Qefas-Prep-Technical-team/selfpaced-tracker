'use client'

import { useQuery } from '@tanstack/react-query'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts'
import { Loader2 } from 'lucide-react'

interface FilterProps {
  filter: { timeRange: string; channel: string }
}

export function SubscriberGrowthChart({ filter }: FilterProps) {
  const { data: growthData = [], isLoading } = useQuery({
    queryKey: ['subscriber-growth', filter.timeRange],
    queryFn: () => fetch(`/api/analytics/subscriber-growth?range=${filter.timeRange}`).then(res => res.json()),
  });

  if (isLoading) return (
    <div className="h-[400px] flex items-center justify-center bg-white/50 backdrop-blur-md dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-md dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 p-6 shadow-xl h-[400px] flex flex-col transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-900 dark:text-white font-black text-lg tracking-tight">Growth Velocity</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Newsletter subscriber acquisition</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
          Trending Up
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
              minTickGap={30}
              dy={10}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                backdropFilter: 'blur(8px)',
                border: 'none', 
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}