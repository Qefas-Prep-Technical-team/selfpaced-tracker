// components/analytics/SubscriberGrowthChart.tsx
'use client'

import { useState } from 'react'

export function SubscriberGrowthChart() {
  const [timeRange, setTimeRange] = useState('weekly')

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-border-light dark:border-slate-700 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-text-primary dark:text-white font-bold text-lg">
          Subscriber Growth
        </h3>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-transparent border-none text-text-secondary text-sm focus:ring-0 cursor-pointer font-medium"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="h-64 relative">
        {/* Area Chart */}
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
          <defs>
            <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(43, 157, 238, 0.2)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(43, 157, 238, 0)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path 
            d="M0,180 C100,160 200,170 300,120 C400,70 500,90 600,40 C700,20 800,10 800,10 L800,200 L0,200 Z" 
            fill="url(#grad1)" 
          />
          <path 
            d="M0,180 C100,160 200,170 300,120 C400,70 500,90 600,40 C700,20 800,10 800,10" 
            fill="none" 
            stroke="#2b9dee" 
            strokeWidth="3"
          />
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 w-full flex justify-between px-2 pt-4 text-[10px] text-text-secondary dark:text-slate-500 font-bold uppercase tracking-wider">
          {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}