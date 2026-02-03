/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Copy, UserX, Search, Download, Loader2, ChevronLeft, ChevronRight, CheckCircle2, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '../../inquiries/components/ui/Button'
import { ConfirmModal } from '@/app/components/ui/ConfirmModal'
import { useSession } from 'next-auth/react'

export function SubscriberTable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  // Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 1. Debounce Logic: Updates 'debouncedSearch' 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Always reset to page 1 on a new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Permission Check
  const userRole = (session?.user as any)?.role?.toUpperCase();
  const canManage = userRole === "ADMIN" || userRole === "EDITOR";

  // 2. Fetch Data (Added debouncedSearch to the Key and URL)
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['subscribers', page, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/newsletter?page=${page}&limit=${limit}&search=${debouncedSearch}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    placeholderData: (previousData) => previousData,
    refetchInterval: debouncedSearch ? false : 10000, // Pause auto-refetch while searching
  });

  const subscribers = data?.subscribers || [];
  const totalPages = data?.totalPages || 1;
  const totalResults = data?.total || 0;

  // 3. Mutations (Status Update)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) =>
      fetch('/api/newsletter', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    }
  });

  // 4. Mutations (Delete)
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/newsletter?id=${id}`, { method: 'DELETE' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      setIsModalOpen(false);
      setSelectedId(null);
    }
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'processing':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'inactive':
        return 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border-slate-200 dark:border-white/10';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  }

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-slate-500">Loading subscribers...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-surface-light dark:border-white/10 shadow-sm overflow-hidden">
      
      {/* Search & Export Header */}
      <div className="p-4 border-b border-surface-light dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by email address..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading && isPlaceholderData && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
               <Loader2 className="animate-spin text-slate-400" size={16} />
            </div>
          )}
        </div>
        <Button variant="primary" icon={Download}>Export</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 dark:bg-white/5 text-[#734c9a] uppercase text-[11px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Subscriber</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-light dark:divide-white/10">
            {subscribers.length > 0 ? (
              subscribers.map((subscriber: any) => (
                <tr key={subscriber._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={subscriber.status || 'active'}
                      onChange={(e) => updateStatusMutation.mutate({ id: subscriber._id, status: e.target.value })}
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none appearance-none transition-all ${getStatusStyles(subscriber.status || 'active')}`}
                    >
                      <option value="active">Active</option>
                      <option value="processing">Processing</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {subscriber.subscribedAt ? formatDistanceToNow(new Date(subscriber.subscribedAt), { addSuffix: true }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                     {canManage ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => { setSelectedId(subscriber._id); setIsModalOpen(true); }}
                        >
                          <UserX size={18} />
                        </Button>
                      ) : (
                        <Lock size={14} className="text-slate-300" />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No subscribers found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-surface-light dark:border-white/10 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <strong>{subscribers.length}</strong> of <strong>{totalResults}</strong> subscribers
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center px-3 text-xs font-medium">
            {page} / {totalPages}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => !isPlaceholderData && page < totalPages && setPage(p => p + 1)}
            disabled={page === totalPages || isPlaceholderData}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => selectedId && deleteMutation.mutate(selectedId)}
        title="Remove Subscriber"
        message="Are you sure you want to remove this email? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}