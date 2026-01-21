// components/ui/Modal.tsx - Updated for new color scheme
'use client'

import { Fragment, ReactNode } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
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
  closeOnOverlayClick = true,
  className
}: ModalProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-6xl'
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

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
                  "w-full transform overflow-hidden rounded-xl bg-white dark:bg-surface-card shadow-2xl transition-all",
                  sizes[size],
                  className
                )}
              >
                {(title || showCloseButton) && (
                  <div className="border-b border-surface-light dark:border-surface-dark p-6">
                    <div className="flex items-center justify-between">
                      {title && (
                        <div>
                          <HeadlessDialog.Title className="text-2xl font-bold text-text-primary dark:text-white tracking-[-0.033em]">
                            {title}
                          </HeadlessDialog.Title>
                          {subtitle && (
                            <HeadlessDialog.Description className="text-text-secondary text-sm mt-1">
                              {subtitle}
                            </HeadlessDialog.Description>
                          )}
                        </div>
                      )}
                      {showCloseButton && (
                        <button
                          onClick={onClose}
                          className="text-text-secondary hover:text-text-primary dark:hover:text-white transition-colors cursor-pointer "
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-6">{children}</div>

                {footer && (
                  <div className="border-t border-surface-light dark:border-surface-dark p-6">
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