/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { MessageCircle, MoreVertical, School, Radio, Users, Search, Calendar } from 'lucide-react'
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

  const userRole = (session?.user as any)?.role?.toUpperCase();
  const canEditOrDelete = userRole === "ADMIN" || userRole === "EDITOR";

  // 2. Updated Query: Added debouncedSearch to queryKey
const { data, isLoading, isPlaceholderData } = useQuery({
  queryKey: ["inquiries", page, debouncedSearch],
  queryFn: async () => {
    const res = await fetch(`/api/inquiries?page=${page}&limit=10&search=${debouncedSearch}`);
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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex-1 min-w-[300px]">
          <Input
            variant="search"
            placeholder="Search by name, phone or email..."
            icon={<Search size={20} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={School} iconPosition="left">Class</Button>
          <Button variant="outline" icon={Radio} iconPosition="left">Channel</Button>
          <Button variant="outline" icon={Calendar} iconPosition="left">Oct 20 - Oct 24</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Parent Name</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">WhatsApp</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Child Class</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Source</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Status</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {inquiries.map((inquiry: any) => (
              <tr key={inquiry._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {getInitials(inquiry.parentName)}
                    </div>
                    <span onClick={() => handleView(inquiry)} className="text-sm font-semibold cursor-pointer hover:text-primary">
                      {inquiry.parentName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{inquiry.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{inquiry.childClass}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{inquiry.channelName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={inquiry.status}>{inquiry.status}</StatusBadge>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="md"><MoreVertical size={18} className="cursor-pointer" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(inquiry)} className="cursor-pointer">View</DropdownMenuItem>
                      {canEditOrDelete && (
                        <>
                          <DropdownMenuItem onClick={() => editInquiry.mutate({ id: inquiry._id, data: { status: "contacted" } })} className="cursor-pointer">
                            Mark Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem  className="text-red-600 cursor-pointer" onClick={() => { setSelectedId(inquiry._id); setIsModalOpen2(true); }}>
                            Delete
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

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {totalCount > 0 ? <>Showing <strong>{from}</strong> to <strong>{to}</strong> of <strong>{totalCount}</strong> inquiries</> : "No inquiries found"}
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(p => Math.max(p - 1, 1))} className={page === 1 ? "opacity-50" : "cursor-pointer"} />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm px-4">Page {page} of {totalPages}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => setPage(p => Math.min(p + 1, totalPages))} className={page === totalPages ? "opacity-50" : "cursor-pointer"} />
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