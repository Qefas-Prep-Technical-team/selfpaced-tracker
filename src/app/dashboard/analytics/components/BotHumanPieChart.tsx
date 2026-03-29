/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Loader2 } from 'lucide-react'

interface FilterProps {
  filter: { timeRange: string; channel: string }
}

export function BotHumanPieChart({ filter }: FilterProps) {
  const { data: distribution = [], isLoading } = useQuery({
    queryKey: ['handling-distribution', filter.timeRange],
    queryFn: () => fetch(`/api/analytics/distribution?range=${filter.timeRange}`).then(res => res.json()),
  });

  const botData = distribution.find((d: any) => d.type === 'bot') || { count: 0, percentage: 0 };
  const humanData = distribution.find((d: any) => d.type === 'human') || { count: 0, percentage: 0 };

  if (isLoading) return (
    <div className="h-[400px] flex items-center justify-center bg-white/50 backdrop-blur-md dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-md dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 p-6 shadow-xl h-[400px] flex flex-col transition-all hover:shadow-2xl">
      <h3 className="text-slate-900 dark:text-white font-black text-lg mb-6 tracking-tight">Handling Distribution</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="count"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              <Cell fill="#6366f1" /> {/* Bot - Indigo */}
              <Cell fill="#e2e8f0" className="dark:fill-slate-800" /> {/* Human - Slate */}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlap */}
        <div className="absolute top-[35%] flex flex-col items-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{botData.percentage}%</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Automated</span>
        </div>

        {/* Dynamic Legend */}
        <div className="mt-6 grid grid-cols-2 gap-4 w-full">
          {[
            { ...botData, color: 'bg-indigo-500', label: 'AI Managed' },
            { ...humanData, color: 'bg-slate-300 dark:bg-slate-700', label: 'Human Led' }
          ].map((item, idx) => (
            <div 
              key={item.type}
              className="flex flex-col items-center p-3 rounded-xl border bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`size-2 rounded-full ${item.color}`} />
                <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{item.label}</span>
              </div>
              <span className={`text-base font-black ${idx === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                {item.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}