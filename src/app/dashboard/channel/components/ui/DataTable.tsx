/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/DataTable.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => ReactNode)
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowClassName?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-[#192633] border-b border-slate-200 dark:border-[#324d67]">
            {columns?.map((column, index) => (
              <th
                key={index}
                className={cn(
                  'px-6 py-4 text-xs font-bold text-slate-500 dark:text-[#92adc9] uppercase tracking-wider',
                  column?.className
                )}
              >
                {column?.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-[#324d67]">
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'hover:bg-slate-50 dark:hover:bg-[#192633] transition-colors group',
                onRowClick && 'cursor-pointer',
                rowClassName
              )}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-5">
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}