// app/inquiries/page.tsx
'use client'

import { Download, Plus } from 'lucide-react'
import { Button } from './components/ui/Button'
import { StatsGrid } from './components/StatsGrid'
import { InquiryTable } from './components/ui/InquiryTable'
// import { ParentInquiriesSidebar } from './ParentInquiriesSidebar'


export default function ParentInquiriesPage() {
  return (
    
   
      
      <main className="flex-1  bg-background-light dark:bg-background-dark p-8">
        {/* Top Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Parent Inquiries
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track and manage prospective student leads.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" icon={Download} iconPosition="left">
              Export Leads
            </Button>
            <Button icon={Plus} iconPosition="left">
              Add New Inquiry
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Inquiry Table */}
        <InquiryTable />
      </main>
 
  )
}