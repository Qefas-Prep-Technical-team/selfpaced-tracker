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

  const COLORS = ['#734c9a', '#cbd5e1']; // Primary purple for bot, slate for human

  if (isLoading) return (
    <div className="h-[400px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-[400px] flex flex-col">
      <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Bot vs. Human Handling</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
              stroke="none"
            >
              <Cell fill="#734c9a" /> {/* Bot */}
              <Cell fill="#cbd5e1" className="dark:fill-slate-700" /> {/* Human */}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlap */}
        <div className="absolute top-[40%] flex flex-col items-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{botData.percentage}%</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Automated</span>
        </div>

        {/* Dynamic Legend */}
        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
          {[botData, humanData].map((item, idx) => (
            <div 
              key={item.type}
              className={`flex flex-col items-center p-3 rounded-lg border bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`size-2 rounded-full ${idx === 0 ? 'bg-[#734c9a]' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{item.type}</span>
              </div>
              <span className={`text-sm font-black ${idx === 0 ? 'text-[#734c9a]' : 'text-slate-500'}`}>
                {item.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}