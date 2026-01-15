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
import React from 'react'
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

const inquiries: Inquiry[] = [
  {
    id: 1,
    parentName: 'Robert Fox',
    initials: 'RF',
    phone: '+1 (555) 012-3456',
    childClass: 'Grade 2',
    source: 'Facebook Ads',
    status: 'new',
    dateCreated: 'Oct 24, 2023',
  },
  {
    id: 2,
    parentName: 'Jane Cooper',
    initials: 'JC',
    phone: '+1 (555) 098-7654',
    childClass: 'Kindergarten',
    source: 'Radio Spot',
    status: 'contacted',
    dateCreated: 'Oct 23, 2023',
  },
  {
    id: 3,
    parentName: 'Wade Warren',
    initials: 'WW',
    phone: '+1 (555) 432-1098',
    childClass: 'Grade 1',
    source: 'Referral',
    status: 'followup',
    dateCreated: 'Oct 22, 2023',
  },
  {
    id: 4,
    parentName: 'Esther Howard',
    initials: 'EH',
    phone: '+1 (555) 765-4321',
    childClass: 'Grade 4',
    source: 'Google Ads',
    status: 'new',
    dateCreated: 'Oct 21, 2023',
  },
  {
    id: 5,
    parentName: 'Cameron Williamson',
    initials: 'CW',
    phone: '+1 (555) 321-0987',
    childClass: 'Grade 2',
    source: 'Facebook Ads',
    status: 'contacted',
    dateCreated: 'Oct 20, 2023',
  },
]

const sourceIcons: Record<string, React.ElementType> = {
  'Facebook Ads': Users,
  'Radio Spot': Radio,
  'Google Ads': Search,
  'Referral': Users,
}

export function InquiryTable() {
    const [page, setPage] = React.useState(1);
    const { data, isLoading } = useQuery({
  queryKey: ["inquiries", page],
  queryFn: async () => {
    const res = await fetch(`/api/inquiries?page=${page}&limit=5`);
    return res.json();
  },

});
const { editInquiry, deleteInquiry } = useInquiryMutations()

const inquiries = data?.data ?? [];
const totalPages = data?.meta.totalPages ?? 1;
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
const handleView = (inquiry: any) => {
  console.log("View inquiry:", inquiry)
  // router.push(`/dashboard/inquiries/${inquiry._id}`)
}

const handleEdit = (inquiry: any) => {
  console.log("Edit inquiry:", inquiry)
  // open edit modal
}

const handleDelete = (id: string) => {
  console.log("Delete inquiry:", id)
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
                    <span className="text-sm font-semibold">
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
                    {inquiry.status === 'followup' && 'Follow-up'}
                  </StatusBadge>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {formatDate(inquiry.createdAt)}
                </td>
                
 <td className="px-6 py-4 text-right">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="md">
        <MoreVertical size={18} />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
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
        onClick={() => deleteInquiry.mutate(inquiry._id)}
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
  <p className="text-xs text-slate-500">
    Showing 1 to 5 of 1,284 inquiries
  </p>

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
      return (
        <PaginationItem key={p}>
          <PaginationLink
            isActive={page === p}
            onClick={() => setPage(p)}
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      );
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