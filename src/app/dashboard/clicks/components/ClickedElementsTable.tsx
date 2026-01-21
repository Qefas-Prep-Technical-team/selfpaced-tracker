/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useQuery } from '@tanstack/react-query'
import { MousePointer, Layout, Link as LinkIcon, Type, Terminal } from 'lucide-react'

// Helper to assign icons dynamically based on category or name
const getIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'button': return MousePointer;
    case 'link': return LinkIcon;
    case 'nav': return Layout;
    case 'input': return Type;
    default: return Terminal;
  }
}

export function ClickedElementsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['top-elements'],
    queryFn: () => fetch('/api/inquiries/track-click/elements').then(res => res.json())
  });

  const elements = data?.data || [];

  const getLocationBadge = (location: string) => {
    // Map paths to friendly names if needed
    const friendlyLocation = location === '/' ? 'Home Page' : location;
    const isPrimary = location === '/' || location.includes('pricing');
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        isPrimary 
          ? 'bg-blue-50 dark:bg-primary/20 text-primary' 
          : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
      }`}>
        {friendlyLocation}
      </span>
    );
  }

  if (isLoading) return <div className="h-64 w-full bg-slate-50 animate-pulse rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-text-primary dark:text-white text-xl font-bold">Top Clicked Elements</h2>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Element Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Location (Path)</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Clicks</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">CTR (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {elements.map((element: any, index: number) => {
              const Icon = getIcon(element.category);
              return (
                <tr key={index} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Icon className="text-primary" size={18} />
                      <span className="text-sm font-semibold">{element.name || 'Unnamed Element'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">{getLocationBadge(element.location)}</td>
                  <td className="px-6 py-5 text-sm">{element.clicks.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full min-w-[60px]">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${Math.min(element.ctr * 5, 100)}%` }} // Scaled for visibility
                        />
                      </div>
                      <span className="text-sm font-bold">{element.ctr.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}