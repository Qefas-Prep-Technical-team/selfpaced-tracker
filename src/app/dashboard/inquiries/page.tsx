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
    <main className="flex-1 bg-background-light dark:bg-background-dark p-8">
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
          
          {/* FIX: Added onClick to trigger the Add Modal */}
          <Button 
            icon={Plus} 
            iconPosition="left"
            onClick={() => setIsAddModalOpen(true)}
            className='cursor-pointer'
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