'use client'

import { Download, Plus } from 'lucide-react'
import { Button } from './components/ui/Button'
import { StatsGrid } from './components/StatsGrid'
import { InquiryTable } from './components/ui/InquiryTable'
import { InquiryDetailsModal } from './components/InquiryDetailsModal'

import { useState } from 'react'
import { AddInquiryModal } from './components/ui/AddInquiryModal'

export default function ParentInquiriesPage() {
  // State for View/Details Modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  
  // State for Add New Inquiry Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleStatusChange = (status: string) => {
    console.log(`Status changed to: ${status}`)
  }

  const handleEdit = () => {
    console.log('Edit inquiry:', selectedId)
  }

  return (
    <main className="flex-1 bg-background-light dark:bg-background-dark p-4 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Parent Inquiries
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Track and manage prospective student leads.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="outline" icon={Download} iconPosition="left" className="w-full sm:w-auto py-3">
            Export Leads
          </Button>
          
          <Button 
            icon={Plus} 
            iconPosition="left"
            onClick={() => setIsAddModalOpen(true)}
            className='cursor-pointer w-full sm:w-auto py-3 shadow-lg shadow-primary/20 bg-primary test-white font-black uppercase tracking-wider text-[11px]'
          >
            Add New Inquiry
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Inquiry Table - Note the prop names match what's used in state */}
      <InquiryTable setIsModalOpen={setIsDetailsOpen} setId={setSelectedId} />

      {/* View/Details Modal */}
      <InquiryDetailsModal
        id={selectedId}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
      />

      {/* Add New Inquiry Modal */}
      <AddInquiryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </main>
  )
}