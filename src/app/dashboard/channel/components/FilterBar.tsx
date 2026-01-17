// components/dashboard/FilterBar.tsx - Updated
'use client'

import { Search, ChevronDown, Filter } from 'lucide-react'
import { Input } from './ui/Input'

export function FilterBar() {
  return (
    <div className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648] rounded-xl p-2 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <Input
            variant="search"
            placeholder="Search channels by name, type or ID..."
            icon={<Search size={20} />}
            className="w-full"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 h-10 px-2 overflow-x-auto scrollbar-hide">
          <button className="flex items-center gap-2 h-8 px-3 rounded-lg bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-white text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-[#2a4057] transition-colors">
            <span>Type: All</span>
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 h-8 px-3 rounded-lg bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-white text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-[#2a4057] transition-colors">
            <span>Status: Active</span>
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 h-8 px-3 rounded-lg bg-slate-100 dark:bg-[#233648] text-slate-700 dark:text-white text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-[#2a4057] transition-colors">
            <span>Date: Last 30 Days</span>
            <ChevronDown size={16} />
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-[#233648] mx-1" />
          <button className="flex items-center gap-2 h-8 px-3 rounded-lg text-slate-500 dark:text-[#92adc9] text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#233648] transition-colors">
            <Filter size={16} />
            <span>More Filters</span>
          </button>
        </div>
      </div>
    </div>
  )
}