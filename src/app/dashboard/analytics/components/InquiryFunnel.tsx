/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Loader2 } from 'lucide-react'

interface FilterProps {
  filter: { timeRange: string; channel: string }
}

export function InquiryFunnel({ filter }: FilterProps) {
  const { data: funnelData = [], isLoading } = useQuery({
    queryKey: ['inquiry-funnel', filter.timeRange, filter.channel],
    queryFn: () => fetch(`/api/analytics/funnel?range=${filter.timeRange}&channel=${filter.channel}`).then(res => res.json()),
  });

  if (isLoading) return (
    <div className="h-[400px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-[400px] flex flex-col">
      <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Inquiry Funnel</h3>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={funnelData}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={32}
          >
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis 
              dataKey="label" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 text-white p-2 rounded shadow-lg text-xs">
                      <p className="font-bold">{payload[0].payload.label}</p>
                      <p>Count: {payload[0].payload.value}</p>
                      <p>Rate: {payload[0].payload.percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Background Track */}
            <Bar dataKey="dummy" fill="#f1f5f9" radius={[4, 4, 4, 4]} />
            
            {/* Actual Funnel Bar */}
            <Bar dataKey="percentage" radius={[4, 4, 4, 4]}>
              {funnelData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#734c9a' : index === 1 ? '#8b5cf6' : '#a78bfa'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Manual Legend / Labels */}
      <div className="mt-4 space-y-2">
        {funnelData.map((step: any, i: number) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <span className="text-slate-500">{step.label}</span>
            <span className="font-mono font-bold">{step.value} ({step.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}