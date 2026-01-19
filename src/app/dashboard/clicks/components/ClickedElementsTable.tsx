// components/analytics/ClickedElementsTable.tsx
'use client'

import { MousePointer, Download, CreditCard, PlayCircle } from 'lucide-react'

interface ClickedElement {
  id: number
  name: string
  icon: React.ElementType
  location: string
  clicks: number
  ctr: number
}

const elements: ClickedElement[] = [
  {
    id: 1,
    name: 'Get Started',
    icon: MousePointer,
    location: 'Hero Section',
    clicks: 12400,
    ctr: 8.2
  },
  {
    id: 2,
    name: 'Download Brochure',
    icon: Download,
    location: 'Footer',
    clicks: 1200,
    ctr: 1.1
  },
  {
    id: 3,
    name: 'Pricing Plan - Pro',
    icon: CreditCard,
    location: 'Pricing Grid',
    clicks: 4500,
    ctr: 4.5
  },
  {
    id: 4,
    name: 'Watch Demo Video',
    icon: PlayCircle,
    location: 'Middle CTA',
    clicks: 8900,
    ctr: 6.8
  }
]

export function ClickedElementsTable() {
  const getLocationBadge = (location: string) => {
    const isPrimary = ['Hero Section', 'Pricing Grid', 'Middle CTA'].includes(location)
    
    return (
      <span className={`
        px-3 py-1 rounded-full text-xs font-bold
        ${isPrimary
          ? 'bg-surface-light dark:bg-primary/20 text-primary'
          : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
        }
      `}>
        {location}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-text-primary dark:text-white text-xl font-bold">
          Top Clicked Elements
        </h2>
        <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
          View all <span>→</span>
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-xl border border-surface-dark dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5">
              <th className="px-6 py-4 text-text-primary dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                Element Name
              </th>
              <th className="px-6 py-4 text-text-primary dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-text-primary dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-4 text-text-primary dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                CTR (%)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-dark dark:divide-white/10">
            {elements.map((element) => (
              <tr 
                key={element.id}
                className="hover:bg-primary/5 transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <element.icon className="text-primary" size={20} />
                    <span className="text-text-primary dark:text-white text-sm font-semibold">
                      {element.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {getLocationBadge(element.location)}
                </td>
                <td className="px-6 py-5 text-text-secondary dark:text-gray-400 text-sm font-medium">
                  {element.clicks.toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full max-w-[80px]">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${element.ctr * 10}%` }}
                      />
                    </div>
                    <span className="text-text-primary dark:text-white text-sm font-bold">
                      {element.ctr}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}