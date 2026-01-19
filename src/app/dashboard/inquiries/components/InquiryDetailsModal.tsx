/* eslint-disable @typescript-eslint/no-explicit-any */
// components/inquiries/InquiryDetailsModal.tsx
'use client'

import { useState } from 'react'
import { 
  ArrowLeft, User as Person, MessageCircle, 
  School, Megaphone, Send, Copy,
  MapPin, Info, RefreshCw, Zap,
  CheckCircle
} from 'lucide-react'
import { Modal } from './ui/Modal'
import { DetailItem } from './ui/DetailItem'
import { StatusToggle } from './ui/StatusToggle'
import { Button } from './ui/Button'
import { Toast } from './ui/Toast'
import { useInquiryMutations } from './useInquiryMutations'
import { toast } from 'react-toastify'

// Skeleton Loading Components
const SkeletonText = ({ width = 'full', height = '4', className = '' }: { width?: string, height?: string, className?: string }) => (
  <div 
    className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
    style={{ 
      width: width === 'full' ? '100%' : width,
      height: height === '4' ? '1rem' : height === '6' ? '1.5rem' : height
    }}
  />
)

const SkeletonCircle = ({ size = '8' , className = ''}: { size?: string , className?: string }) => (
  <div 
    className={`bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ${className}`}
    style={{ width: size === '8' ? '2rem' : size, height: size === '8' ? '2rem' : size }}
  />
)

const SkeletonButton = () => (
  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-11 w-full animate-pulse" />
)

const SkeletonCard = () => (
  <div className="bg-white dark:bg-surface-card rounded-xl border border-surface-light dark:border-surface-dark shadow-sm overflow-hidden">
    {/* Card Header */}
    <div className="p-6 border-b border-surface-light dark:border-surface-dark">
      <div className="flex items-center gap-2">
        <SkeletonCircle />
        <SkeletonText width="w-32" height="6" />
      </div>
    </div>
    
    {/* Card Content */}
    <div className="p-6 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonCircle size="6" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-24" />
            <SkeletonText width="w-32" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const SkeletonStatusCard = () => (
  <div className="bg-white dark:bg-surface-card rounded-xl border border-surface-light dark:border-surface-dark shadow-sm p-6">
    <div className="flex items-center gap-2 mb-5">
      <SkeletonCircle size="5" />
      <SkeletonText width="w-32" height="6" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <SkeletonText key={i} width="full" height="10" />
      ))}
    </div>
  </div>
)

const SkeletonActionsCard = () => (
  <div className="bg-white dark:bg-surface-card rounded-xl border border-surface-light dark:border-surface-dark shadow-sm p-6">
    <div className="flex items-center gap-2 mb-5">
      <SkeletonCircle size="5" />
      <SkeletonText width="w-32" height="6" />
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
    {/* Breadcrumbs Skeleton */}
    <div className="mb-6">
      <div className="flex items-center gap-1 mb-4">
        <SkeletonCircle size="5" />
        <SkeletonText width="w-36" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      {/* Left Column Skeleton */}
      <section className="lg:col-span-8">
        <SkeletonCard />
      </section>

      {/* Right Column Skeleton */}
      <aside className="lg:col-span-4 space-y-6">
        <SkeletonStatusCard />
        <SkeletonActionsCard />
        
        {/* Map Placeholder Skeleton */}
        <div className="bg-white dark:bg-surface-card rounded-xl border border-surface-light dark:border-surface-dark shadow-sm overflow-hidden h-48">
          <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center space-y-2">
              <SkeletonCircle size="12" className="mx-auto" />
              <SkeletonText width="w-24" className="mx-auto" />
            </div>
          </div>
        </div>
      </aside>
    </div>

    {/* Footer Actions Skeleton */}
    <div className="mt-8 pt-6 border-t border-surface-light dark:border-surface-dark flex justify-between">
      <SkeletonText width="w-20" height="11" />
      <div className="flex gap-3">
        <SkeletonText width="w-28" height="11" />
        <SkeletonText width="w-32" height="11" />
      </div>
    </div>
  </>
)

interface InquiryData {
    _id: string
  id: number
  parentName: string
  phone: string
  childClass: string
  sourceChannel: string
  location?: string
}

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
//   inquiry,
  onStatusChange,
  onEdit,
  id
}: InquiryDetailsModalProps) {
  const [status, setStatus] = useState('new')
  const [showToast, setShowToast] = useState(false)
  const { useInquiry,editInquiry } = useInquiryMutations()
  const { data, isLoading, error } = useInquiry(id)


  console.log(data)
  const inquiry = data?.inquiry
  
  const statusOptions = [
      { value: 'new', label: 'NEW' },
      { value: 'contacted', label: 'CONTACTED' },
      { value: 'follow-up', label: 'FOLLOW-UP' }
    ]
    const handleStatusChange = (newStatus: string) => {
        console.log('Changing status to:', inquiry)
       setStatus(newStatus)
      // setShowToast(true)
      onStatusChange?.(newStatus)
      editInquiry.mutate(
        { 
          id: inquiry?._id as string, 
          data: { status: newStatus as any } 
        },
        {
          onSuccess: () => {
            toast.success(`Status updated to ${newStatus}`)
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
      Phone: ${inquiry?.whatsapp}
      Class: ${inquiry?.childClass}
      Source: ${inquiry?.channelName}
    `
    navigator.clipboard.writeText(details)
    // Trigger the Toast
    toast.success(`details copied to clipboard!`, {
     icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      style: {
        borderRadius: '12px',
        fontSize: '14px',
      }
    });
  }

  const handleOpenWhatsApp = () => {
    const phone = inquiry?.whatsapp?.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}`, '_blank')
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
          <div className="text-red-500 mb-4">Failed to load inquiry details</div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    )
  }

  // Original content
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Inquiry Details"
        size="3xl"
        className="max-h-[90vh] overflow-y-auto"
      >
        {/* Breadcrumbs */}
        <div className="mb-6">
          <button
            onClick={onClose}
            className="text-primary text-base font-medium flex items-center gap-1 hover:underline mb-4 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Contacts
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inquiry Information */}
          <section className="lg:col-span-8">
            <div className="bg-white dark:bg-surface-card rounded-xl border border-surface-light dark:border-surface-dark shadow-sm overflow-hidden">
              <div className="p-6 border-b border-surface-light dark:border-surface-dark">
                <h3 className="text-text-primary dark:text-white text-xl font-bold flex items-center gap-2">
                  <Info className="text-primary" size={24} />
                  Inquiry Information
                </h3>
              </div>
              <div className="p-6 space-y-0">
                <DetailItem
                  icon={Person}
                  label="Parent Name"
                  value={inquiry?.parentName}
                />
                <DetailItem
                  icon={MessageCircle}
                  label="WhatsApp"
                  value={inquiry?.whatsapp}
                />
                <DetailItem
                  icon={School}
                  label="Child Class"
                  value={inquiry?.childClass}
                />
                <DetailItem
                  icon={Megaphone}
                  label="Source Channel"
                  value={inquiry?.channelName}
                />
              </div>
            </div>
          </section>

          {/* Right Column: Status & Quick Actions */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Status Management Card */}
            <div className="bg-white dark:bg-surface-card rounded-xl border border-surface-light dark:border-surface-dark shadow-sm p-6">
              <h3 className="text-text-primary dark:text-white text-lg font-bold mb-5 flex items-center gap-2">
                <RefreshCw className="text-primary" size={20} />
                Current Status
              </h3>
              <StatusToggle
                value={status}
                onChange={handleStatusChange}
                options={statusOptions}
              />
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-surface-card rounded-xl border border-surface-light dark:border-surface-dark shadow-sm p-6">
              <h3 className="text-text-primary dark:text-white text-lg font-bold mb-5 flex items-center gap-2">
                <Zap className="text-primary" size={20} />
                Quick Actions
              </h3>
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  className="w-full h-11"
                  icon={Send}
                  onClick={handleOpenWhatsApp}
                >
                  Open WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 cursor-pointer"
                  icon={Copy}
                  onClick={handleCopyDetails}
                >
                  Copy Details
                </Button>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white dark:bg-surface-card rounded-xl border border-surface-light dark:border-surface-dark shadow-sm overflow-hidden h-48 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-primary opacity-40" size={40} />
                  {/* <p className="text-xs font-bold text-primary/60 mt-2 uppercase tracking-widest">
                    {inquiry?.location || 'Location Preview'}
                  </p> */}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-surface-light dark:border-surface-dark flex justify-between">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-3">
            {/* <Button variant="outline" onClick={onEdit}>
              Edit Profile
            </Button> */}
            <Button variant="primary" onClick={handleOpenWhatsApp}>
              Contact Now
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Toast */}
      {showToast && (
        <Toast
          title="Status updated successfully"
          message={`The record has been updated to '${status}'`}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}