// components/ui/Toast.tsx
'use client'

import { CheckCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ 
  title, 
  message, 
  type = 'success',
  duration = 5000,
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200'
  }

  const typeIcons = {
    success: <CheckCircle className="text-emerald-600" size={24} />,
    error: <X className="text-red-600" size={24} />,
    warning: <CheckCircle className="text-amber-600" size={24} />,
    info: <CheckCircle className="text-blue-600" size={24} />
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-[100] animate-bounce-in",
      typeStyles[type],
      "border rounded-lg px-5 py-3 flex items-center gap-3 shadow-lg min-w-[300px]"
    )}>
      {typeIcons[type]}
      <div className="flex-1">
        <p className={cn(
          "text-sm font-bold",
          type === 'success' && 'text-emerald-800',
          type === 'error' && 'text-red-800',
          type === 'warning' && 'text-amber-800',
          type === 'info' && 'text-blue-800'
        )}>
          {title}
        </p>
        <p className={cn(
          "text-xs",
          type === 'success' && 'text-emerald-700',
          type === 'error' && 'text-red-700',
          type === 'warning' && 'text-amber-700',
          type === 'info' && 'text-blue-700'
        )}>
          {message}
        </p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className={cn(
          "ml-2 hover:opacity-70 transition-opacity",
          type === 'success' && 'text-emerald-600',
          type === 'error' && 'text-red-600',
          type === 'warning' && 'text-amber-600',
          type === 'info' && 'text-blue-600'
        )}
      >
        <X size={18} />
      </button>
    </div>
  )
}