/* eslint-disable @typescript-eslint/no-explicit-any */
// components/inquiries/InquiryDetailsModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  User as Person, MessageCircle, 
  School, Megaphone, Send, Copy,
  MapPin, Info, RefreshCw, Zap,
  CheckCircle
} from 'lucide-react'
import { Modal } from './ui/Modal'
import { StatusToggle } from './ui/StatusToggle'
import { Button } from './ui/Button'
import { StatusBadge } from './ui/StatusBadge'
import { useInquiryMutations } from './useInquiryMutations'
import { toast } from 'react-toastify'

// Skeleton Loading Components
const SkeletonText = ({ width = 'full', height = '4', className = '' }: { width?: string, height?: string, className?: string }) => (
  <div 
    className={`bg-slate-200 dark:bg-slate-800 rounded animate-pulse ${className}`}
    style={{ 
      width: width === 'full' ? '100%' : width,
      height: height === '4' ? '1rem' : height === '6' ? '1.5rem' : height
    }}
  />
)

const SkeletonCircle = ({ size = '8' , className = ''}: { size?: string , className?: string }) => (
  <div 
    className={`bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse ${className}`}
    style={{ width: size === '8' ? '2rem' : size, height: size === '8' ? '2rem' : size }}
  />
)

const SkeletonButton = () => (
  <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-11 w-full animate-pulse" />
)

const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
    {/* Card Header */}
    <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
      <div className="flex items-center gap-2">
        <SkeletonCircle />
        <SkeletonText width="120px" height="6" />
      </div>
    </div>
    
    {/* Card Content */}
    <div className="p-6 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex justify-between items-center gap-3 py-4 border-b border-slate-100 dark:border-white/5 last:border-0">
          <div className="flex items-center gap-2">
            <SkeletonCircle size="5" />
            <SkeletonText width="80px" />
          </div>
          <SkeletonText width="120px" />
        </div>
      ))}
    </div>
  </div>
)

const SkeletonStatusCard = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl p-6">
    <div className="flex items-center gap-2 mb-5">
      <SkeletonCircle size="5" />
      <SkeletonText width="100px" height="6" />
    </div>
    <div className="space-y-3">
      <SkeletonText width="full" height="10" />
    </div>
  </div>
)

const SkeletonActionsCard = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl p-6">
    <div className="flex items-center gap-2 mb-5">
      <SkeletonCircle size="5" />
      <SkeletonText width="100px" height="6" />
    </div>
    <div className="space-y-3">
      <SkeletonButton />
      <SkeletonButton />
    </div>
  </div>
)

// Loading Modal Content Component
const LoadingModalContent = () => (
  <>
    {/* Profile Card Header Skeleton */}
    <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
      <SkeletonCircle size="16" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <SkeletonText width="200px" height="6" />
          <SkeletonText width="80px" height="6" />
        </div>
        <SkeletonText width="150px" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column Skeleton */}
      <section className="lg:col-span-8">
        <SkeletonCard />
      </section>

      {/* Right Column Skeleton */}
      <aside className="lg:col-span-4 space-y-6">
        <SkeletonStatusCard />
        <SkeletonActionsCard />
        
        {/* Map Placeholder Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden h-44">
          <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/20">
            <div className="text-center space-y-2">
              <SkeletonCircle size="12" className="mx-auto" />
              <SkeletonText width="80px" className="mx-auto" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  </>
)

interface InquiryDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (status: string) => void
  onEdit?: () => void
  id: string
}

export function InquiryDetailsModal({
  isOpen,
  onClose,
  onStatusChange,
  onEdit,
  id
}: InquiryDetailsModalProps) {
  const { useInquiry, editInquiry } = useInquiryMutations()
  const { data, isLoading, error } = useInquiry(id)
  const inquiry = data?.inquiry

  const [status, setStatus] = useState('new')
  const [contactMethod, setContactMethod] = useState<'sms' | 'whatsapp' | 'call' | 'other'>('whatsapp')
  const [contactMessage, setContactMessage] = useState('')

  // Keep local status in sync with db status when data loads or ID changes
  useEffect(() => {
    if (inquiry?.status) {
      setStatus(inquiry.status)
    }
  }, [inquiry])

  const handleRecordContact = () => {
    if (!contactMessage.trim()) {
      toast.error('Please add a message or interaction note.');
      return;
    }

    editInquiry.mutate(
      {
        id: inquiry?._id as string,
        data: {
          contactHistoryItem: {
            contactMethod,
            message: contactMessage.trim(),
          },
        } as any,
      },
      {
        onSuccess: (updatedData) => {
          toast.success('Contact interaction logged successfully!');
          setContactMessage('');
          if (updatedData?.inquiry?.status) {
            setStatus(updatedData.inquiry.status);
          }
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to save log.');
        },
      }
    );
  }

  const statusOptions = [
    { 
      value: 'new', 
      label: 'NEW', 
      bgColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm' 
    },
    { 
      value: 'contacted', 
      label: 'CONTACTED', 
      bgColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 shadow-sm' 
    },
    { 
      value: 'follow-up', 
      label: 'FOLLOW-UP', 
      bgColor: 'bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 shadow-sm' 
    },
    { 
      value: 'resolved', 
      label: 'RESOLVED', 
      bgColor: 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 shadow-sm' 
    },
    { 
      value: 'lost', 
      label: 'LOST', 
      bgColor: 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 shadow-sm' 
    }
  ]

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
    editInquiry.mutate(
      { 
        id: inquiry?._id as string, 
        data: { status: newStatus as any } 
      },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${newStatus.toUpperCase()}`)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  }

  const handleCopyDetails = () => {
    const details = `
      Parent: ${inquiry?.parentName}
      Phone/WhatsApp: ${inquiry?.whatsapp}
      Class: ${inquiry?.childClass}
      Source: ${inquiry?.channelName}
    `
    navigator.clipboard.writeText(details)
    toast.success(`Details copied to clipboard!`, {
      icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
      style: {
        borderRadius: '12px',
        fontSize: '14px',
      }
    });
  }

  const handleOpenWhatsApp = () => {
    const phone = inquiry?.whatsapp?.replace(/\D/g, '')
    if (phone) {
      window.open(`https://wa.me/${phone}`, '_blank')
    } else {
      toast.error('No WhatsApp number available')
    }
  }

  const handleCallPhone = () => {
    const phone = inquiry?.whatsapp?.replace(/[^\d+]/g, '')
    if (phone) {
      window.location.href = `tel:${phone}`
    } else {
      toast.error('No phone number available')
    }
  }

  function getInitials(name: string) {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  }

  function formatDate(dateString?: Date | string) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  }

  // If loading, show skeleton
  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Inquiry Details"
        size="3xl"
        className="max-h-[90vh] overflow-y-auto"
      >
        <LoadingModalContent />
      </Modal>
    )
  }

  // If error, show error state
  if (error) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Error"
        size="3xl"
        className="max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center py-12">
          <div className="text-red-500 mb-4 font-bold">Failed to load inquiry details</div>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inquiry Details"
      size="3xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      {/* Profile Card Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
        <div className="size-16 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
          {getInitials(inquiry?.parentName || '')}
        </div>
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              {inquiry?.parentName}
            </h2>
            <span className="shrink-0">
              <StatusBadge status={status as any}>{status.toUpperCase()}</StatusBadge>
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Lead created on {formatDate(inquiry?.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inquiry Information */}
        <section className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <h3 className="text-slate-900 dark:text-white text-lg font-black uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Info className="text-indigo-500" size={18} />
                Inquiry Information
              </h3>
            </div>
            
            <div className="p-6 divide-y divide-slate-100 dark:divide-white/5">
              {/* Parent Name */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Person className="text-slate-400 dark:text-slate-500" size={18} />
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Parent Name</span>
                </div>
                <span className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">
                  {inquiry?.parentName}
                </span>
              </div>
              
              {/* WhatsApp */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <MessageCircle className="text-slate-400 dark:text-slate-500" size={18} />
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">WhatsApp</span>
                </div>
                <button 
                  onClick={handleOpenWhatsApp}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold text-sm sm:text-base flex items-center gap-1 hover:underline cursor-pointer text-left sm:text-right"
                >
                  {inquiry?.whatsapp}
                </button>
              </div>

              {/* Child Class */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <School className="text-slate-400 dark:text-slate-500" size={18} />
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Child Class</span>
                </div>
                <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {inquiry?.childClass}
                </span>
              </div>

              {/* Source Channel */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Megaphone className="text-slate-400 dark:text-slate-500" size={18} />
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Source Channel</span>
                </div>
                <span className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">
                  {inquiry?.channelName}
                </span>
              </div>
            </div>
          </div>

          {/* Record Contact Attempt Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden mt-6">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <h3 className="text-slate-900 dark:text-white text-lg font-black uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Send className="text-indigo-500" size={18} />
                Record Contact Attempt
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Contact Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['sms', 'whatsapp', 'call', 'other'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setContactMethod(method)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                        contactMethod === method
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Message / Log Notes
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Summarize the interaction (e.g. Sent registration link, followed up about JSS1, etc.)"
                  className="w-full min-h-[80px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleRecordContact}
                  disabled={editInquiry.isPending}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-bold tracking-wider text-[10px] uppercase py-2.5 px-6 cursor-pointer"
                >
                  {editInquiry.isPending ? 'Saving...' : 'Save Interaction Log'}
                </Button>
              </div>
            </div>
          </div>

          {/* Contact History Logs (Timeline) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden mt-6">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <h3 className="text-slate-900 dark:text-white text-lg font-black uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Person className="text-indigo-500" size={18} />
                Interaction History
              </h3>
            </div>
            
            <div className="p-6">
              {!inquiry?.contactHistory || inquiry.contactHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm font-semibold">
                  No interactions logged yet for this lead.
                </div>
              ) : (
                <div className="relative border-l border-slate-200 dark:border-white/10 pl-6 space-y-6 ml-2">
                  {inquiry.contactHistory.map((historyItem: any, index: number) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 flex size-4 items-center justify-center rounded-full bg-indigo-500 text-white ring-4 ring-white dark:ring-slate-900">
                        <span className="size-2 rounded-full bg-white" />
                      </span>
                      
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                            {historyItem.contactMethod}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            {formatDate(historyItem.contactedAt)}
                          </span>
                        </div>
                        {historyItem.message && (
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                            {historyItem.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Status & Quick Actions */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Status Management Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl p-6">
            <h3 className="text-slate-900 dark:text-white text-lg font-black uppercase tracking-wider text-[11px] mb-5 flex items-center gap-2">
              <RefreshCw className="text-indigo-500" size={18} />
              Current Status
            </h3>
            <StatusToggle
              value={status}
              onChange={handleStatusChange}
              options={statusOptions}
            />
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl p-6">
            <h3 className="text-slate-900 dark:text-white text-lg font-black uppercase tracking-wider text-[11px] mb-5 flex items-center gap-2">
              <Zap className="text-indigo-500" size={18} />
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                className="w-full h-11 bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 font-bold tracking-wider text-[10px] uppercase cursor-pointer flex items-center justify-center gap-2"
                icon={Send}
                onClick={handleOpenWhatsApp}
              >
                Open WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-bold tracking-wider text-[10px] uppercase cursor-pointer flex items-center justify-center gap-2"
                icon={Copy}
                onClick={handleCopyDetails}
              >
                Copy Details
              </Button>
            </div>
          </div>

          {/* Location Preview Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden h-44 relative">
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/20 flex flex-col items-center justify-center p-4">
              <div className="size-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2 animate-bounce">
                <MapPin className="text-indigo-500" size={24} />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Location Details</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Online Lead
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex justify-between">
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-extrabold uppercase tracking-wider text-[10px] cursor-pointer"
        >
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleCallPhone}
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-extrabold uppercase tracking-wider text-[10px] cursor-pointer py-2 px-5"
        >
          Contact Now
        </Button>
      </div>
    </Modal>
  )
}