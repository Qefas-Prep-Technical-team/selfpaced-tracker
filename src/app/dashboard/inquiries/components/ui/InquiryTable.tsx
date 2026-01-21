/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/InquiryTable.tsx
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
import React, { Dispatch, SetStateAction } from 'react'
import { useQuery } from '@tanstack/react-query'
import { InquiryTableSkeleton } from './InquiryTableSkeleton'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { useInquiryMutations } from '../useInquiryMutations'



interface Inquiry {
  id: number
  parentName: string
  initials: string
  phone: string
  childClass: string
  source: string
  status: 'new' | 'contacted' | 'followup'
  dateCreated: string
}




export function InquiryTable({setIsModalOpen,setId}:{setIsModalOpen:Dispatch<SetStateAction<boolean>>,setId:Dispatch<SetStateAction<string>>}) {
    const [page, setPage] = React.useState(1);
    const { data, isLoading } = useQuery({
  queryKey: ["inquiries", page],
  queryFn: async () => {
    const res = await fetch(`/api/inquiries?page=${page}&limit=10`);
    return res.json();
  },

});
const { editInquiry, deleteInquiry } = useInquiryMutations()

// Inside InquiryTable component
const inquiries = data?.data ?? [];
const meta = data?.meta; // Store meta to make code cleaner

const totalPages = meta?.totalPages ?? 1;
const totalCount = meta?.total ?? 0; // Changed 'totalCount' to 'total' to match your backend
const currentPage = meta?.page ?? 1;
const limit = meta?.limit ?? 10;

// Calculate range for the "Showing X to Y" text
const from = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
const to = Math.min(currentPage * limit, totalCount);
function formatDate(dateString: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function getInitials(name: string) {
  if (!name) return "";

  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (
    parts[0][0].toUpperCase() +
    parts[parts.length - 1][0].toUpperCase()
  );
}

const sourceIcons: Record<string, React.ElementType> = {
  "facebook": Users,
  "instagram": Search,
  "Radio Spot": Radio,
  "Referral": Users,
  "School Walk-in": School,
};

function getSourceIcon(channelName: string) {
  return sourceIcons[channelName] || MessageCircle;
}
if (isLoading) {
  return <InquiryTableSkeleton />
}


const handleEdit = (inquiry: any) => {
  console.log("Edit inquiry:", inquiry)
  // open edit modal
}
const handleView = (inquiry: any) => {
  setIsModalOpen(true)
  setId(inquiry._id)
  // open edit modal
}

const handleDelete = (id: string) => {
  console.log(id)
 deleteInquiry.mutate(id)
  // confirm → delete mutation
}

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex-1 min-w-[300px]">
          <Input
            variant="search"
            placeholder="Search by name, phone or email..."
            icon={<Search size={20} />}
            className="w-full bg-slate-50 dark:bg-slate-800"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={School} iconPosition="left">
            Class
          </Button>
          <Button variant="outline" icon={Radio} iconPosition="left">
            Channel
          </Button>
          <Button variant="outline" icon={Calendar} iconPosition="left">
            Oct 20 - Oct 24
          </Button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
          <Button variant="ghost" size="sm">
            <Search size={20} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                Parent Name
              </th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                WhatsApp
              </th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                Child Class
              </th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                Source Channel
              </th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                Status
              </th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                Date Created
              </th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {inquiries.map((inquiry: any) => (
              <tr 
                key={inquiry._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {getInitials(inquiry.parentName)}
                    </div>
                    <span onClick={()=>handleView(inquiry)} className="text-sm font-semibold cursor-pointer">
                      {inquiry.parentName}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="size-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center transition-transform group-hover:scale-110">
                      {(() => {
      const Icon = getSourceIcon(inquiry.channelName);
      return <Icon size={14} className="text-slate-500" />;
    })()}
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {inquiry.phone}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {inquiry.childClass}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold uppercase border border-slate-200 dark:border-slate-700">
                    {inquiry.channelName}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={inquiry.status}>
                    {inquiry.status === 'new' && 'New Inquiry'}
                    {inquiry.status === 'contacted' && 'Contacted'}
                    {inquiry.status === "follow-up" && 'Follow-up'}
                  </StatusBadge>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {formatDate(inquiry.createdAt)}
                </td>
                
 <td className="px-6 py-4 text-right">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="md" className='cursor-pointer '>
        <MoreVertical size={18} />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem
      onClick={()=>handleView(inquiry)}
      >
        View
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          editInquiry.mutate({
            id: inquiry._id,
            data: {
              status: "contacted",
            },
          })
        }}
      >
        Edit
      </DropdownMenuItem>

      <DropdownMenuItem
        className="text-red-600 focus:text-red-600"
        onClick={() => handleDelete(inquiry._id)}
      >
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* Pagination */}
<div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between  gap-3">
<div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
  <p className="text-xs text-slate-500">
    {totalCount > 0 ? (
      <>Showing <strong>{from}</strong> to <strong>{to}</strong> of <strong>{totalCount.toLocaleString()}</strong> inquiries</>
    ) : (
      "No inquiries found"
    )}
  </p>

  {/* Pagination Component remains same */}
</div>
 <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setPage(p => Math.max(p - 1, 1))}
        className={page === 1 ? "pointer-events-none opacity-50" : ""}
      />
    </PaginationItem>

 {[...Array(totalPages)].map((_, i) => {
  const p = i + 1;
  // Only show first page, last page, and 2 pages around current page
  if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
    return (
      <PaginationItem key={p}>
        <PaginationLink
          isActive={page === p}
          onClick={() => setPage(p)}
          className="cursor-pointer"
        >
          {p}
        </PaginationLink>
      </PaginationItem>
    );
  }
  // Optional: Show ellipsis (...) logic here
  return null;
})}
    <PaginationItem>
      <PaginationNext
        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>

</div>

    </div>
  )
}