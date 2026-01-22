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
    <div className="h-[400px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg flex items-center gap-2">
          <MapPin size={20} className="text-primary" />
          Top Locations
        </h3>
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
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="clicks" radius={[0, 4, 4, 0]} barSize={20}>
              {locationData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#734c9a' : '#734c9a80'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
          Based on {locationData.reduce((acc: number, curr: any) => acc + curr.clicks, 0).toLocaleString()} total clicks
        </p>
      </div>
    </div>
  )
}