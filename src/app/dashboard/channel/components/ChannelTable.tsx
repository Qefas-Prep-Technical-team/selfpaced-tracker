/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/ChannelTable.tsx
'use client'

import { MoreVertical } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { DataTable } from './ui/DataTable'

import { getChannelIcon, getTypeIcon, getTypeLabel } from '@/utils/channel-icons'
import { ChannelList } from './hook'
import { Channel } from '../../types'
  
export function ChannelTable() {
  const { data: channels = [], isLoading, error } = ChannelList()
  console.log(channels)

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648] rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-[#233648] rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-slate-200 dark:bg-[#233648] rounded"></div>
            <div className="h-10 bg-slate-200 dark:bg-[#233648] rounded"></div>
            <div className="h-10 bg-slate-200 dark:bg-[#233648] rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648] rounded-xl p-6">
        <p className="text-red-500">Error loading channels: {error.message}</p>
      </div>
    )
  }

  const columns = [
    {
      header: 'Channel Name',
      accessor: (row: Channel)=> {
        const { Icon, color } = getChannelIcon(row)
        
        return (
          <div className="flex items-center gap-3">
            <div className={`size-9 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-900 dark:text-white block truncate">
                {row.name}
              </span>
              {row.description && (
                <span className="text-xs text-slate-500 dark:text-[#92adc9] block truncate">
                  {row.description}
                </span>
              )}
            </div>
          </div>
        )
      },
      className: 'w-1/4',
    },
    {
      header: 'Type',
      accessor: (row: Channel) => {
        const TypeIcon:any = getTypeIcon(row.type)
        return (
          <Badge icon={TypeIcon}>
            {getTypeLabel(row.type)}
          </Badge>
        )
      },
    },
    {
      header: 'Status',
      accessor: (row: Channel) => {
        const variant = row.status === 'active' ? 'success' : 
                       row.status === 'paused' ? 'warning' : 'default'
        
        return (
          <Badge variant={variant}>
            {row.status === 'active' ? (
              <>
                <div className="size-1.5 rounded-full bg-green-500" />
                Active
              </>
            ) : row.status === 'paused' ? (
              <>
                <div className="size-1.5 rounded-full bg-yellow-500" />
                Paused
              </>
            ) : (
              <>
                <div className="size-1.5 rounded-full bg-slate-400" />
                Archived
              </>
            )}
          </Badge>
        )
      },
    },
    {
      header: 'Date Created',
      accessor: 'dateCreated',
    },
    {
      header: 'Leads (Total)',
      accessor: (row: Channel) => (
        <div className="flex items-center gap-3">
          <div className="w-20 h-2 bg-slate-100 dark:bg-[#324d67] rounded-full overflow-hidden relative">
            <div 
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              style={{ width: `${Math.min((row.leads / 150) * 100, 100)}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {row.leads}
          </span>
        </div>
      ),
    },
    {
      header: 'Messages (Total)',
      accessor: (row: Channel) => (
        <div className="flex items-center gap-3">
          <div className="w-20 h-2 bg-slate-100 dark:bg-[#324d67] rounded-full overflow-hidden relative">
            <div 
              className="absolute inset-y-0 left-0 bg-primary/60 rounded-full"
              style={{ width: `${Math.min((row.messages / 250) * 100, 100)}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {row.messages}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: () => (
        <div className="text-right">
          <Button variant="ghost" size="sm">
            <MoreVertical size={20} />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ]

  return (
    <div className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648] rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-[#233648]">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Channels ({channels.length})
        </h2>
      </div>
      
      <DataTable
        columns={columns}
        data={channels}
      />

      {/* Pagination */}
      <div className="bg-slate-50 dark:bg-[#192633] px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-[#324d67]">
        <p className="text-xs text-slate-500 dark:text-[#92adc9]">
          Showing {channels.length} of {channels.length} channels
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="primary" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}  