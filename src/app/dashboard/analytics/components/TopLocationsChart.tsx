/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Loader2, MapPin } from 'lucide-react'

interface FilterProps {
  filter: { timeRange: string; channel: string }
}

export function TopLocationsChart({ filter }: FilterProps) {
  const { data: locationData = [], isLoading } = useQuery({
    queryKey: ['top-locations', filter.timeRange],
    queryFn: () => fetch(`/api/analytics/locations?range=${filter.timeRange}`).then(res => res.json()),
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
          <h3 className="text-slate-900 dark:text-white font-black text-lg tracking-tight flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            Geographic Reach
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Top engagement by location</p>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={locationData}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, textAnchor: 'end' }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                backdropFilter: 'blur(8px)',
                border: 'none', 
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="clicks" radius={[0, 8, 8, 0]} barSize={20} animationDuration={1500}>
              {locationData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#6366f1' : '#6366f130'} 
                  className={index === 0 ? '' : 'dark:fill-slate-800'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
          Global Presence Analysis
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
            Visualizing {locationData.reduce((acc: number, curr: any) => acc + curr.clicks, 0).toLocaleString()} interactions
        </p>
      </div>
    </div>
  )
}