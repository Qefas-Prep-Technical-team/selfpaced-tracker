/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/ChannelTable.tsx
'use client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Edit, Trash } from 'lucide-react'
import { useState, useMemo } from 'react'
import { MoreVertical } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { getChannelIcon, getTypeIcon, getTypeLabel } from '@/utils/channel-icons'
import { ChannelList, useDeleteChannel } from './hook'
import { Channel } from '../../types'
import { toast } from 'react-toastify'

const PAGE_SIZE = 5

export function ChannelTable() {
  const { data, isLoading, error } = ChannelList()
  const channels = data?.data || []

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'digital' | 'offline' | 'team'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'archived'>('all')
  const [page, setPage] = useState(1)
  function handleEdit(channel: Channel) {
  // Open modal or navigate to edit page
  console.log('Edit channel:', channel)
}

const deleteMutation = useDeleteChannel();

const handleDelete = (id: string) => {
  if (confirm('Are you sure you want to delete this channel?')) {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Channel removed');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  }
};


  const filteredChannels = useMemo(() => {
    return channels
      .filter((c: any) => {
        if (typeFilter !== 'all' && c.type !== typeFilter) return false
        if (statusFilter !== 'all' && c.status !== statusFilter) return false
        if (
          search &&
          !c.name.toLowerCase().includes(search.toLowerCase()) &&
          !c.type.toLowerCase().includes(search.toLowerCase()) &&
          !(c.trackingId?.toLowerCase().includes(search.toLowerCase()))
        ) return false
        return true
      })
  }, [channels, typeFilter, statusFilter, search])

  const pageCount = Math.ceil(filteredChannels.length / PAGE_SIZE)
  const paginatedChannels = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredChannels.slice(start, start + PAGE_SIZE)
  }, [filteredChannels, page])

  const columns = [
    {
      header: 'Channel Name',
      accessor: (row: Channel) => {
        const { Icon, color } = getChannelIcon(row)
        return (
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
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
        const TypeIcon: any = getTypeIcon(row.type)
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
        const variant = row.status === 'active' ? 'success' : row.status === 'paused' ? 'warning' : 'default'
        return (
          <Badge variant={variant}>
            {row.status === 'active' ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Active
              </>
            ) : row.status === 'paused' ? (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                Paused
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                Archived
              </>
            )}
          </Badge>
        )
      },
    },
    {
      header: 'Date Created',
      accessor: (row: Channel) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Leads',
      accessor: (row: Channel) => (
        <div className="flex items-center gap-3">
          <div className="w-20 h-2 bg-slate-100 dark:bg-[#324d67] rounded-full relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              style={{ width: `${Math.min((row.leads / 150) * 100, 100)}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{row.leads}</span>
        </div>
      ),
    },
    {
      header: 'Messages',
      accessor: (row: Channel) => (
        <div className="flex items-center gap-3">
          <div className="w-20 h-2 bg-slate-100 dark:bg-[#324d67] rounded-full relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary/60 rounded-full"
              style={{ width: `${Math.min((row.messages / 250) * 100, 100)}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{row.messages}</span>
        </div>
      ),
    },
   {
  header: 'Actions',
  accessor: (row: Channel) => (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(row)}>
            <Edit size={16} className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(row._id)}>
            <Trash size={16} className="mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  className: 'text-right',
}
  ]

  if (isLoading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">Error loading channels</p>

  return (
    <div className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648] rounded-xl overflow-hidden shadow-sm">
      {/* Filter/Search */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-[#233648] flex flex-wrap items-center gap-3 justify-between">
  {/* Search input takes full width on mobile, bigger on desktop */}
  <div className="flex-1 min-w-[250px]">
    <Input
      placeholder="Search channels..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value)
        setPage(1)
      }}
      className="w-full h-12 text-sm md:text-base" // bigger height and font
    />
  </div>

  {/* Filters aligned to the end */}
  <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
    <select
      value={typeFilter}
      onChange={(e) => {
        setTypeFilter(e.target.value as any)
        setPage(1)
      }}
      className="rounded-lg border px-3 py-2 text-sm md:text-base"
    >
      <option value="all">All Types</option>
      <option value="digital">Digital</option>
      <option value="offline">Offline</option>
      <option value="team">Team-based</option>
    </select>

    <select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value as any)
        setPage(1)
      }}
      className="rounded-lg border px-3 py-2 text-sm md:text-base"
    >
      <option value="all">All Status</option>
      <option value="active">Active</option>
      <option value="paused">Paused</option>
      <option value="archived">Archived</option>
    </select>
  </div>
</div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-[#192633] border-b border-slate-200 dark:border-[#324d67]">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`px-6 py-4 text-xs font-bold text-slate-500 dark:text-[#92adc9] uppercase tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#324d67]">
            {paginatedChannels.map((row:any, idx:any) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#192633] transition-colors">
                {columns.map((col, ci) => (
                  <td key={ci} className="px-6 py-5">{typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-[#324d67]">
        <span className="text-xs text-slate-500 dark:text-[#92adc9]">
          Showing {paginatedChannels.length} of {filteredChannels.length} channels
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>
            Previous
          </Button>
          {Array.from({ length: pageCount }, (_, i) => (
            <Button key={i} variant={i + 1 === page ? 'primary' : 'outline'} size="sm" onClick={() => setPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage(p => Math.min(p + 1, pageCount))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
