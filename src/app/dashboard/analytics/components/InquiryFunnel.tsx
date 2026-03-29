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
    <div className="h-[400px] flex items-center justify-center bg-white/50 backdrop-blur-md dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-md dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 p-6 shadow-xl h-[400px] flex flex-col transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-900 dark:text-white font-black text-lg tracking-tight">Conversion Funnel</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Visitor to lead transition rate</p>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={funnelData}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={24}
          >
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis 
              dataKey="label" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, textAnchor: 'end' }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800/90 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl text-[10px] border border-white/10">
                      <p className="font-black uppercase tracking-widest mb-1 text-primary">{payload[0].payload.label}</p>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Total Count:</span>
                        <span className="font-bold">{payload[0].payload.value}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Success Rate:</span>
                        <span className="font-bold">{payload[0].payload.percentage}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Bar dataKey="percentage" radius={[0, 12, 12, 0]} animationDuration={1500}>
              {funnelData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : '#ec4899'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {funnelData.map((step: any, i: number) => (
          <div key={i} className="flex flex-col gap-0.5 min-w-[100px]">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 dark:text-slate-400">{step.label}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-900 dark:text-white">{step.value}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 rounded">{step.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}