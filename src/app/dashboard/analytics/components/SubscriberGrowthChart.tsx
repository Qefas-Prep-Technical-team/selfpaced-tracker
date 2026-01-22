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
    <div className="h-[400px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Subscriber Growth</h3>
        <div className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
          Total List Growth
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#734c9a" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#734c9a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10 }} 
              minTickGap={30}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#734c9a" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}