'use client'

import { Download, Plus, Zap, Loader2 } from 'lucide-react'
import { Button } from './components/ui/Button'
import { StatsGrid } from './components/StatsGrid'
import { InquiryTable } from './components/ui/InquiryTable'
import { InquiryDetailsModal } from './components/InquiryDetailsModal'

import { useState } from 'react'
import { AddInquiryModal } from './components/ui/AddInquiryModal'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Modal } from './components/ui/Modal'

export default function ParentInquiriesPage() {
  const queryClient = useQueryClient()
  
  // State for View/Details Modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  
  // State for Add New Inquiry Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // State for bulk processing loading
  const [isProcessing, setIsProcessing] = useState(false)

  // Progress modal states
  const [isProgressOpen, setIsProgressOpen] = useState(false)
  const [inquiriesToProcess, setInquiriesToProcess] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const [failureCount, setFailureCount] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [currentName, setCurrentName] = useState("")

  const handleBulkWelcome = async () => {
    setIsProcessing(true)
    const toastId = toast.loading("Checking for new inquiries...")
    try {
      const res = await fetch('/api/inquiries/bulk-welcome')
      const data = await res.json()
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch new inquiries.")
      }

      if (data.count === 0) {
        toast.update(toastId, {
          render: "No new inquiries found to process.",
          type: "info",
          isLoading: false,
          autoClose: 3000
        })
        setIsProcessing(false)
        return
      }

      toast.dismiss(toastId)

      // Setup state for progress modal
      setInquiriesToProcess(data.inquiries)
      setCurrentIdx(0)
      setSuccessCount(0)
      setFailureCount(0)
      setCurrentName(data.inquiries[0]?.parentName || "")
      setIsProgressOpen(true)
      setIsSending(true)

      // Start processing each inquiry sequentially
      startProcessing(data.inquiries)
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "An unexpected error occurred.",
        type: "error",
        isLoading: false,
        autoClose: 4000
      })
      setIsProcessing(false)
    }
  }

  const startProcessing = async (inquiries: any[]) => {
    let sCount = 0
    let fCount = 0

    for (let i = 0; i < inquiries.length; i++) {
      const inquiry = inquiries[i]
      setCurrentIdx(i)
      setCurrentName(inquiry.parentName)
      
      // Force React to repaint UI
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const res = await fetch('/api/inquiries/bulk-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inquiryId: inquiry._id })
        })
        const data = await res.json()
        if (res.ok && data.success && data.successCount > 0) {
          sCount++
          setSuccessCount(sCount)
        } else {
          fCount++
          setFailureCount(fCount)
        }
      } catch (err) {
        console.error(err)
        fCount++
        setFailureCount(fCount)
      }
    }
    
    setIsSending(false)
    setIsProcessing(false)
    // Invalidate cache to trigger table and stats refresh
    queryClient.invalidateQueries({ queryKey: ["inquiries"] })
    queryClient.invalidateQueries({ queryKey: ["inquiry-stats"] })
  }

  const handleStatusChange = (status: string) => {
    console.log(`Status changed to: ${status}`)
  }

  const handleEdit = () => {
    console.log('Edit inquiry:', selectedId)
  }

  return (
    <main className="flex-1 bg-background p-4 md:p-8 min-h-screen">
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
            icon={Zap}
            iconPosition="left"
            onClick={handleBulkWelcome}
            disabled={isProcessing}
            className='cursor-pointer w-full sm:w-auto py-3 shadow-lg shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-wider text-[11px]'
          >
            {isProcessing ? "Processing..." : "Process New"}
          </Button>
          
          <Button 
            icon={Plus} 
            iconPosition="left"
            onClick={() => setIsAddModalOpen(true)}
            className='cursor-pointer w-full sm:w-auto py-3 shadow-lg shadow-primary/20 bg-primary text-white font-black uppercase tracking-wider text-[11px]'
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

      {/* Progress Modal */}
      <Modal
        isOpen={isProgressOpen}
        onClose={() => {
          if (!isSending) {
            setIsProgressOpen(false)
          }
        }}
        title="Processing Welcome SMS"
        subtitle="Automated welcome message delivery and lead classification"
        size="md"
        showCloseButton={!isSending}
        closeOnOverlayClick={!isSending}
      >
        <div className="flex flex-col gap-6 py-2">
          {isSending ? (
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-semibold text-sm bg-amber-500/10 p-3 rounded-lg animate-pulse">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Sending SMS to {currentName}...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-semibold text-sm bg-emerald-500/10 p-3 rounded-lg">
              <span>All welcome SMS sent successfully!</span>
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${inquiriesToProcess.length > 0 ? ((successCount + failureCount) / inquiriesToProcess.length) * 100 : 0}%` }}
            />
          </div>

          {/* Status counts grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Total Leads</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1 block">
                {inquiriesToProcess.length}
              </span>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Processed</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1 block">
                {successCount + failureCount}
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100/50 dark:border-emerald-500/10">
              <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-500">Successful</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {successCount}
              </span>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100/50 dark:border-rose-500/10">
              <span className="block text-xs font-semibold uppercase tracking-wider text-rose-500">Failed</span>
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
                {failureCount}
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 mt-2">
            {isSending 
              ? `${inquiriesToProcess.length - (successCount + failureCount)} left to process...` 
              : "Bulk welcome dispatch completed."
            }
          </div>

          {!isSending && (
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setIsProgressOpen(false)}
                className="bg-primary text-white font-bold px-6 py-2 rounded-lg cursor-pointer"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </main>
  )
}