/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function LocationBreakdownChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['location-breakdown'],
    queryFn: () => fetch('/api/inquiries/track-click/locations').then(res => res.json())
  });

  const locations = data?.data || [];

  // Theme-aware colors
  const BAR_COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#939BF4', '#A5B4FC'];

  if (isLoading) return <div className="h-[350px] w-full bg-slate-50 animate-pulse rounded-xl" />;


   return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold">
          City Breakdown {/* Updated Title */}
        </h2>
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Top Cities</span>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={locations}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }} // Adjusted margins
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} // Slightly smaller font for cities
                width={100} // Increased width for city names
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: '#1e293b',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: any) => [`${Number(value || 0).toFixed(1)}%`, 'Traffic Share']}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
                {locations.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/10 pt-4">
          {locations.slice(0, 6).map((loc: any, index: number) => (
            <div key={loc.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ backgroundColor: BAR_COLORS[index % BAR_COLORS.length] }} />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[100px]">
                  {loc.name}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{loc.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}