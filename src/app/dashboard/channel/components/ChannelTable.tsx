/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Edit, Lock, Trash, MoreVertical, Search, Filter, Calendar } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { getChannelIcon, getTypeIcon, getTypeLabel } from '@/utils/channel-icons'
import { ChannelList, useDeleteChannel } from './hook'
import { Channel } from '../../types'
import { toast } from 'react-toastify'
import { SkeletonTable } from './TableSkeleton'
import { useSession } from 'next-auth/react'
import { ConfirmModal } from '@/app/components/ui/ConfirmModal'

const PAGE_SIZE = 10

interface ChannelTableProps {
  onEdit?: (channel: any) => void;
}

export function ChannelTable({ onEdit }: ChannelTableProps) {
  const { data: session } = useSession();
  const { data, isLoading, error } = ChannelList()
  const channels = data?.data || []

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'digital' | 'offline' | 'team'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'archived'>('all')
  const [page, setPage] = useState(1)
  
  const userRole = (session?.user as any)?.role?.toUpperCase();
  const canManage = userRole === "ADMIN" || userRole === "EDITOR";
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  const deleteMutation = useDeleteChannel();

  const handleOpenDelete = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedId) return;
    deleteMutation.mutate(selectedId, {
      onSuccess: () => {
        toast.success('Channel removed');
        setIsModalOpen(false);
        setSelectedId(null);
      },
      onError: (error: any) => {
        toast.error(error.message);
      }
    });
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
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${color}`}>
              <Icon size={18} className="sm:size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-black text-slate-900 dark:text-white block truncate uppercase tracking-tight">
                {row.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block truncate lg:hidden uppercase tracking-tighter">
                {getTypeLabel(row.type)}
              </span>
            </div>
          </div>
        )
      },
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
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Status',
      accessor: (row: Channel) => {
        const variant = row.status === 'active' ? 'success' : row.status === 'paused' ? 'warning' : 'default'
        return (
          <Badge variant={variant}>
            {row.status === 'active' ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </>
            ) : row.status === 'paused' ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Paused
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Archived
              </>
            )}
          </Badge>
        )
      },
    },
    {
      header: 'Created',
      accessor: (row: Channel) => (
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tighter">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
      className: 'hidden xl:table-cell',
    },
    {
      header: 'Leads',
      accessor: (row: Channel) => (
        <div className="flex items-center gap-3">
          <div className="w-16 sm:w-20 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full relative overflow-hidden shrink-0">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${row.status === 'active' ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'bg-slate-400'}`}
              style={{ width: `${Math.min((row.leads / 150) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{row.leads}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Channel) => (
        <div className="text-right">
          {canManage ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors outline-none active:scale-95">
                  <MoreVertical size={18} className="text-slate-400"/>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-md">
                <DropdownMenuItem 
                  className="cursor-pointer font-bold text-xs uppercase tracking-tight py-2.5" 
                  onClick={() => onEdit?.(row)} 
                >
                  <Edit size={14} className="mr-2 text-indigo-500" /> Edit Channel
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500 cursor-pointer font-bold text-xs uppercase tracking-tight py-2.5"
                  onClick={() => handleOpenDelete(row._id)}
                >
                  <Trash size={14} className="mr-2" /> Delete Source
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex justify-end pr-3">
              <Lock size={16} className="text-slate-300 dark:text-slate-600" />
            </div>
          )}
        </div>
      ),
      className: 'text-right',
    }
  ]

  if (isLoading) return <SkeletonTable />
  if (error) return <p className="text-red-500 p-4">Error loading channels</p>

  return (
    <div className="bg-white/70 backdrop-blur-md dark:bg-background-dark/70 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all">
      {/* Filter/Search */}
      <div className="px-4 sm:px-6 py-5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="flex-1 relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            placeholder="Search acquisition sources..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full h-11 sm:h-12 pl-12 pr-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-white/10 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-white outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 md:flex-none relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any)
                setPage(1)
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer shadow-sm"
            >
              <option value="all">All Types</option>
              <option value="digital">Digital</option>
              <option value="offline">Offline</option>
              <option value="team">Team-based</option>
            </select>
          </div>

          <div className="flex-1 md:flex-none relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-slate-400 pointer-events-none" />
             <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setPage(1)
              }}
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer shadow-sm"
            >
              <option value="all">Any Status</option>
              <option value="active">Active Only</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`px-4 sm:px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedChannels.map((row:any, idx:any) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                {columns.map((col, ci) => (
                  <td key={ci} className={`px-4 sm:px-6 py-5 ${col.className || ''}`}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Showing {paginatedChannels.length} of {filteredChannels.length} results
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="flex items-center justify-center p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
            {Array.from({ length: pageCount }, (_, i) => (
                <button 
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`size-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${i + 1 === page ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {i + 1}
                </button>
            ))}
          </div>

          <button 
            disabled={page === pageCount} 
            onClick={() => setPage(p => Math.min(p + 1, pageCount))}
            className="flex items-center justify-center p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setSelectedId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Acquisition Source"
        message="Are you sure you want to permanently remove this acquisition source? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}