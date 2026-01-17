/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/* =====================================================
   TYPES
===================================================== */

interface DashboardStateHandlerProps<T = any> {
  data?: T
  isLoading?: boolean
  error?: unknown
  children: React.ReactNode

  showSkeleton?: boolean
  skeletonComponent?: React.ReactNode
  onRetry?: () => void
}

/* =====================================================
   ACTION BUTTON
===================================================== */

const ActionButton = ({
  children,
  onClick,
  variant = 'primary',
  icon,
  className
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  icon?: string
  className?: string
}) => {
  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary/90',
    secondary:
      'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700',
    danger:
      'bg-red-600 text-white hover:bg-red-700'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        variants[variant],
        className
      )}
    >
      {icon && (
        <span className="material-symbols-outlined text-sm">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}

/* =====================================================
   SKELETON
===================================================== */

const DefaultSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 w-1/3 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
    <div className="h-40 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
  </div>
)

/* =====================================================
   EMPTY STATE
===================================================== */

const DashboardEmptyState = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
    <span className="material-symbols-outlined mb-3 text-5xl text-slate-400">
      inbox
    </span>
    <h3 className="mb-1 text-lg font-semibold">
      No data yet
    </h3>
    <p className="max-w-sm text-sm text-slate-500">
      Once data becomes available, it will appear here.
    </p>
  </div>
)

/* =====================================================
   ERROR STATE
===================================================== */

const DashboardErrorState = ({
  error,
  onRetry
}: {
  error: unknown
  onRetry?: () => void
}) => {
  const message =
    error instanceof Error
      ? error.message
      : 'Something went wrong while loading this data.'

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
      <span className="material-symbols-outlined mb-3 text-5xl text-red-500">
        error
      </span>

      <h3 className="mb-1 text-lg font-semibold">
        Error loading data
      </h3>

      <p className="mb-4 max-w-sm text-sm text-slate-600 dark:text-slate-400">
        {message}
      </p>

      {onRetry && (
        <ActionButton
          onClick={onRetry}
          icon="refresh"
        >
          Try again
        </ActionButton>
      )}
    </div>
  )
}

/* =====================================================
   MAIN HANDLER
===================================================== */

export function DashboardStateHandler<T>({
  data,
  isLoading = false,
  error,
  children,
  showSkeleton = true,
  skeletonComponent,
  onRetry
}: DashboardStateHandlerProps<T>) {
  /* ---------- LOADING ---------- */
  if (isLoading && showSkeleton) {
    return (
      <>{skeletonComponent ?? <DefaultSkeleton />}</>
    )
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <DashboardErrorState
        error={error}
        onRetry={onRetry}
      />
    )
  }

  /* ---------- EMPTY ---------- */
  const isEmpty =
    data == null ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === 'object' &&
      !Array.isArray(data) &&
      Object.keys(data).length === 0)

  if (isEmpty) {
    return <DashboardEmptyState />
  }

  /* ---------- SUCCESS ---------- */
  return <>{children}</>
}
