// components/ui/Dialog.tsx
'use client'

import { Fragment, ReactNode } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export function Dialog({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  showCloseButton = true
}: DialogProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Dialog */}
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
                  "w-full transform overflow-hidden rounded-xl bg-white dark:bg-[#192633] shadow-2xl transition-all",
                  sizes[size]
                )}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#233648]">
                    {title && (
                      <div>
                        <HeadlessDialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                          {title}
                        </HeadlessDialog.Title>
                        {subtitle && (
                          <HeadlessDialog.Description className="text-slate-500 dark:text-[#92adc9] text-xs mt-1">
                            {subtitle}
                          </HeadlessDialog.Description>
                        )}
                      </div>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:text-[#92adc9] dark:hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="p-6 border-t border-slate-200 dark:border-[#233648]">
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