// app/inquiries/page.tsx
'use client'

import { Download, Plus } from 'lucide-react'
import { Button } from './components/ui/Button'
import { StatsGrid } from './components/StatsGrid'
import { InquiryTable } from './components/ui/InquiryTable'
import { InquiryDetailsModal } from './components/InquiryDetailsModal'
import { useState } from 'react'
// import { ParentInquiriesSidebar } from './ParentInquiriesSidebar'

const mockInquiry = {
  id: 1,
  parentName: 'Sarah Jenkins',
  phone: '+1 234 567 890',
  childClass: 'Grade 4 - Science',
  sourceChannel: 'Facebook Ad Campaign',
  location: 'New York City'
}
export default function ParentInquiriesPage() {
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [id, setId] = useState("")
    const handleStatusChange = (status: string) => {
    console.log(`Status changed to: ${status}`)
    // Here you would typically update the status via API
  }

  const handleEdit = () => {
    console.log('Edit inquiry:', mockInquiry.id)
    // Navigate to edit page or open edit modal
  }
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
         {/* <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
            >
              View Details
            </Button> */}

        {/* Inquiry Table */}
        <InquiryTable setIsModalOpen={setIsModalOpen} setId={setId} />
         <InquiryDetailsModal
         id={id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
      />
      </main>
 
  )
}