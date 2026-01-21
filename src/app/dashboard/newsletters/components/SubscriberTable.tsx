/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Copy, UserX, Search, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '../../inquiries/components/ui/Button'

export function SubscriberTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // 1. Fetch Paginated Data
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['subscribers', page], // Page is part of the key
    queryFn: () => fetch(`/api/newsletter?page=${page}&limit=${limit}`).then(res => res.json()),
    placeholderData: (previousData) => previousData, // Keeps old data visible while fetching new page
  });

  const subscribers = data?.subscribers || [];
  const totalPages = data?.totalPages || 1;
  const totalResults = data?.total || 0;

  // 2. Delete Mutation (Remains same)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/newsletter?id=${id}`, { method: 'DELETE' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    }
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-surface-light dark:border-white/10 shadow-sm overflow-hidden">
      {/* Table Content */}
      {/* Filters & Search */}
      <div className="p-4 border-b border-surface-light dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by email address..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Download}>Export</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          {/* ... Head remains same ... */}
          <thead className="bg-gray-50 dark:bg-white/5 text-[#734c9a] uppercase text-[11px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Subscriber</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-light dark:divide-white/10">
            {subscribers.map((subscriber: any) => (
              <tr key={subscriber._id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium">{subscriber.email}</td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDistanceToNow(new Date(subscriber.subscribedAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                   <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(subscriber._id)}>
                     <UserX size={18} />
                   </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-surface-light dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-transparent">
        <p className="text-xs text-gray-500">
          Showing <span className="font-bold text-slate-700 dark:text-slate-300">{(page - 1) * limit + 1}</span> to <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min(page * limit, totalResults)}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{totalResults}</span> results
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(old => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </Button>
          
          <div className="flex items-center px-4 text-xs font-bold text-slate-600">
            Page {page} of {totalPages}
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (!isPlaceholderData && page < totalPages) {
                setPage(old => old + 1)
              }
            }}
            disabled={page === totalPages || isPlaceholderData}
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}