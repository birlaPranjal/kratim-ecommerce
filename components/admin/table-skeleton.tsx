"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  columns: number
  rows: number
}

export function TableSkeleton({ columns = 5, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="w-full">
      {/* Table header */}
      <div className="flex border-b pb-4 pt-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={`header-${colIndex}`}
            className="flex-1 px-4"
          >
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex items-center border-b py-4"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="flex-1 px-4"
            >
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default TableSkeleton 