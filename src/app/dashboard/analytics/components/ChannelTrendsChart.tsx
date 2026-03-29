'use client'

import { useQuery } from '@tanstack/react-query'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts'
import { Loader2 } from 'lucide-react'

interface FilterProps {
  filter: { timeRange: string; channel: string }
}

export function ChannelTrendsChart({ filter }: FilterProps) {
  const { data: trendData = [], isLoading } = useQuery({
    queryKey: ['channel-trends', filter.timeRange],
    queryFn: () => fetch(`/api/analytics/channel-trends?range=${filter.timeRange}`).then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-md dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
        <Loader2 className="animate-spin text-primary" />
        <p className="text-xs text-slate-500 mt-2">Loading trends...</p>
      </div>
    );
  }

  // Get keys from the first data point (except 'name') to dynamically generate lines
  const channelKeys = trendData.length > 0 
    ? Object.keys(trendData[0]).filter(k => k !== 'name') 
    : [];

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#22c55e', '#06b6d4'];

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-md dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 p-6 shadow-xl h-[400px] flex flex-col transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-900 dark:text-white font-black text-lg tracking-tight">
            Monthly Inquiry Trends
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Channel performance over time</p>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
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
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                backdropFilter: 'blur(8px)',
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                color: '#fff',
                fontSize: '12px'
              }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '20px' }}
            />
            
            {channelKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={3}
                dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
