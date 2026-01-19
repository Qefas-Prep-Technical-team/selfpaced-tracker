// components/subscriptions/SubscriberTable.tsx
'use client'

import { Copy, UserX, Search, Calendar, Download } from 'lucide-react'

import { formatDistanceToNow } from 'date-fns'
import { Button } from '../../inquiries/components/ui/Button'
import { Input } from './ui/Input'

interface Subscriber {
  id: number
  email: string
  status: 'active' | 'processing' | 'inactive'
  joined: Date
}

interface SubscriberTableProps {
  subscribers: Subscriber[]
  onCopyEmail: (email: string) => void
  onUnsubscribe: (id: number) => void
  onExport: () => void
}

export function SubscriberTable({ 
  subscribers, 
  onCopyEmail, 
  onUnsubscribe,
  onExport 
}: SubscriberTableProps) {
  const getStatusBadge = (status: Subscriber['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      processing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
    
    const labels = {
      active: 'Active',
      processing: 'Processing',
      inactive: 'Inactive'
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-surface-light dark:border-white/10 shadow-sm overflow-hidden">
      {/* Filters & Search */}
      <div className="p-4 border-b border-surface-light dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[300px]">
          <Input
            variant="search"
            placeholder="Search by email address..."
            icon={<Search size={20} />}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Calendar} iconPosition="left">
            Last 30 Days
          </Button>
          <Button variant="primary" icon={Download} onClick={onExport}>
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-white/5 text-[#734c9a] uppercase text-[11px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Subscriber</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-light dark:divide-white/10">
            {subscribers.map((subscriber) => (
              <tr 
                key={subscriber.id}
                className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 font-medium">
                  {subscriber.email}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(subscriber.status)}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDistanceToNow(subscriber.joined, { addSuffix: true })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopyEmail(subscriber.email)}
                      title="Copy Email"
                      className="text-gray-400 hover:text-primary"
                    >
                      <Copy size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUnsubscribe(subscriber.id)}
                      title="Unsubscribe"
                      className="text-gray-400 hover:text-red-500"
                    >
                      <UserX size={20} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-surface-light dark:border-white/10 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Showing 1 to {subscribers.length} of 12,450 results
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}