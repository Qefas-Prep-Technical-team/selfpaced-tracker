// components/ui/SideDrawer.tsx
'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'


interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function SideDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md'
}: SideDrawerProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        "fixed right-0 top-0 h-screen z-50 flex flex-col dark:border-[#233648] bg-white] border-l  ",
        sizes[size]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-bdark:border-[#233648] bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-slate-500 dark:text-[#92adc9] text-xs mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 dark:text-[#92adc9] hover:text-slate-900 dark:hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-slate-200 dark:border-[#233648] bg-white dark:bg-[#192633]">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}