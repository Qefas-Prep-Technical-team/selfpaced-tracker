/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { MessageCircle, MoreVertical, School, Radio, Users, Search, Calendar, BarChart as ChartIcon } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { Button } from './Button'
import { Input } from './Input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { InquiryTableSkeleton } from './InquiryTableSkeleton'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useInquiryMutations } from '../useInquiryMutations'
import { useSession } from 'next-auth/react'
import { ConfirmModal } from '@/app/components/ui/ConfirmModal'

export function InquiryTable({setIsModalOpen, setId}: {setIsModalOpen: Dispatch<SetStateAction<boolean>>, setId: Dispatch<SetStateAction<string>>}) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // New Filter States
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: session } = useSession();
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 1. Debounce Logic: Wait 500ms after user stops typing to trigger search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when other filters change
  useEffect(() => {
    setPage(1);
  }, [selectedClass, selectedChannel, startDate, endDate]);

  const userRole = (session?.user as any)?.role?.toUpperCase();
  const canEditOrDelete = userRole === "ADMIN" || userRole === "EDITOR";

  // Fetch filter options (classes and channels)
  const { data: filterOptions } = useQuery({
    queryKey: ["inquiry-filters"],
    queryFn: async () => {
      const res = await fetch('/api/inquiries/filters');
      const result = await res.json();
      return result.data;
    }
  });

  // 2. Updated Query: Added filters to queryKey and URL
const { data, isLoading, isPlaceholderData } = useQuery({
  queryKey: ["inquiries", page, debouncedSearch, selectedClass, selectedChannel, startDate, endDate],
  queryFn: async () => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearch,
        childClass: selectedClass,
        channelName: selectedChannel,
        startDate: startDate,
        endDate: endDate,
    });
    const res = await fetch(`/api/inquiries?${params.toString()}`);
    return res.json();
  },
  placeholderData: (previousData) => previousData, // This keeps the old table visible while loading
});

  const { editInquiry, deleteInquiry } = useInquiryMutations()

  const inquiries = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalCount = meta?.total ?? 0;
  const currentPage = meta?.page ?? 1;
  const limit = meta?.limit ?? 10;

  const from = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, totalCount);

  // Helper Functions
  function formatDate(dateString: string) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function getInitials(name: string) {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  }

  const sourceIcons: Record<string, React.ElementType> = {
    "facebook": Users,
    "instagram": Search,
    "Radio Spot": Radio,
    "Referral": Users,
    "School Walk-in": School,
  };

  const getSourceIcon = (channelName: string) => sourceIcons[channelName] || MessageCircle;

  const handleView = (inquiry: any) => {
    setIsModalOpen(true)
    setId(inquiry._id)
  }

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteInquiry.mutate(selectedId, {
        onSuccess: () => {
          setIsModalOpen2(false);
          setSelectedId(null);
        }
      });
    }
  }

  if (isLoading) return <InquiryTableSkeleton />

  return (
    <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">      <div className="flex flex-col xl:flex-row items-stretch justify-between gap-6 p-6 border-b border-slate-100 dark:border-white/5">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-4">
          <Input
            variant="search"
            placeholder="Search leads..."
            icon={<Search size={18} className="text-primary" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-white/5 rounded-xl h-10 text-xs font-medium"
          />
          <Link href="/dashboard/analytics/channels" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group">
              <ChartIcon size={16} className="group-hover:rotate-12 transition-transform" />
              Analyse Channels
            </button>
          </Link>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Class Filter */}
          <div className="flex-1 sm:flex-none">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" icon={School} iconPosition="left" className="w-full sm:w-auto text-[11px] sm:text-xs h-10">
                    {selectedClass || "Class"}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto w-48">
                <DropdownMenuItem onClick={() => setSelectedClass('')}>All Classes</DropdownMenuItem>
                {filterOptions?.classes?.map((cls: string) => (
                    <DropdownMenuItem key={cls} onClick={() => setSelectedClass(cls)}>
                    {cls}
                    </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Channel Filter */}
          <div className="flex-1 sm:flex-none">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" icon={Radio} iconPosition="left" className="w-full sm:w-auto text-[11px] sm:text-xs h-10">
                    {selectedChannel || "Channel"}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto w-48">
                <DropdownMenuItem onClick={() => setSelectedChannel('')}>All Channels</DropdownMenuItem>
                {filterOptions?.channels?.map((ch: string) => (
                    <DropdownMenuItem key={ch} onClick={() => setSelectedChannel(ch)}>
                    {ch}
                    </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Date Filters */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto overflow-hidden">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <div className="flex items-center gap-1">
                <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none text-[10px] sm:text-xs focus:ring-0 dark:text-slate-300 p-0 w-24"
                />
                <span className="text-slate-300">-</span>
                <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none text-[10px] sm:text-xs focus:ring-0 dark:text-slate-300 p-0 w-24"
                />
            </div>
          </div>

          {(selectedClass || selectedChannel || startDate || endDate || searchTerm) && (
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                    setSelectedClass('');
                    setSelectedChannel('');
                    setStartDate('');
                    setEndDate('');
                    setSearchTerm('');
                }}
                className="text-slate-500 hover:text-red-500 text-[10px] uppercase font-black"
            >
                Clear
            </Button>
          )}
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5">Lead Details</th>
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5 hidden sm:table-cell">WhatsApp</th>
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5 hidden lg:table-cell">Child Class</th>
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5 hidden md:table-cell">Source Channel</th>
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5">Status</th>
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {inquiries.map((inquiry: any) => (
              <tr key={inquiry._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="size-8 sm:size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] sm:text-xs shadow-inner shrink-0">
                      {getInitials(inquiry.parentName)}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span 
                        onClick={() => handleView(inquiry)} 
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:text-primary transition-colors truncate"
                        >
                        {inquiry.parentName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium sm:hidden truncate">
                            {inquiry.phone || inquiry.whatsapp || "No Phone"}
                        </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400 hidden sm:table-cell">{inquiry.phone || inquiry.whatsapp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                    <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md text-[10px] uppercase">
                        {inquiry.childClass}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                   <div className="flex items-center gap-2">
                      <div className="text-slate-400">
                        {React.createElement(getSourceIcon(inquiry.channelName), { size: 14 })}
                      </div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">{inquiry.channelName}</span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={inquiry.status}>{inquiry.status}</StatusBadge>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} className="text-slate-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-2xl border-white/10">
                      <DropdownMenuItem onClick={() => handleView(inquiry)} className="rounded-lg font-medium cursor-pointer">
                        View Details
                      </DropdownMenuItem>
                      {canEditOrDelete && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => editInquiry.mutate({ id: inquiry._id, data: { status: "contacted" } })} 
                            className="rounded-lg font-medium cursor-pointer text-primary"
                          >
                            Mark as Contacted
                          </DropdownMenuItem>
                          <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                          <DropdownMenuItem  
                            className="rounded-lg font-medium text-red-600 cursor-pointer" 
                            onClick={() => { setSelectedId(inquiry._id); setIsModalOpen2(true); }}
                          >
                            Delete Record
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="p-6 bg-slate-50/30 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Status</p>
            <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {totalCount > 0 
                ? <>Showing <span className="text-slate-900 dark:text-white font-bold">{from}–{to}</span> of <span className="text-slate-900 dark:text-white font-bold">{totalCount}</span> inquiries</> 
                : "No matching records found"}
            </p>
        </div>
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(p - 1, 1))} 
                className={`h-9 px-4 rounded-xl border-slate-200 dark:border-white/5 transition-all ${page === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white dark:hover:bg-white/10 cursor-pointer shadow-sm"}`} 
              />
            </PaginationItem>
            <PaginationItem>
              <div className="bg-white dark:bg-white/5 h-9 px-4 flex items-center rounded-xl border border-slate-200 dark:border-white/5 text-xs font-bold shadow-sm">
                Page {page} of {totalPages}
              </div>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
                className={`h-9 px-4 rounded-xl border-slate-200 dark:border-white/5 transition-all ${page === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-white dark:hover:bg-white/10 cursor-pointer shadow-sm"}`} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen2}
        onClose={() => setIsModalOpen2(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this inquiry?"
        isLoading={deleteInquiry.isPending}
      />
    </div>
  )
}