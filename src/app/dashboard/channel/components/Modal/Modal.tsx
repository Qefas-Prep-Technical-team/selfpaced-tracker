// components/ui/Modal.tsx
'use client'

import { Fragment, ReactNode } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true
}: ModalProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }

  

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
        </Transition.Child>

        {/* Dialog Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
            <HeadlessDialog.Panel
  className={cn(
    // CHANGED: bg-white for light mode, bg-[#192633] (or your specific dark color) for dark mode
    "w-full transform overflow-hidden rounded-2xl bg-white dark:bg-[#192633] border border-slate-200 dark:border-[#233648] shadow-2xl transition-all max-h-[90vh] flex flex-col",
    sizes[size]
  )}
>
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#233648]">
                    {title && (
                      <div>
                        <HeadlessDialog.Title className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                          {title}
                        </HeadlessDialog.Title>
                        {subtitle && (
                          <HeadlessDialog.Description className="text-slate-500 dark:text-[#92adc9] text-sm mt-1">
                            {subtitle}
                          </HeadlessDialog.Description>
                        )}
                      </div>
                    )}
                    {showCloseButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="p-2 text-slate-500 cursor-pointer dark:text-[#92adc9] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#233648]"
                      >
                        <X size={20} />
                      </Button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="p-6 border-t border-slate-200 dark:border-[#233648]  rounded-b-2xl">
                    {footer}
                  </div>
                )}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}