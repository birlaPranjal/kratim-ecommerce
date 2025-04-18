"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Define a more comprehensive column type
interface DataTableColumn<T> {
  accessorKey: string;
  header: React.ReactNode;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  searchKey?: string;
  placeholder?: string;
}

export function DataTable<T>({
  columns,
  data,
  searchKey,
  placeholder = "Search...",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredData = searchKey
    ? data.filter(item => {
        const value = (item as any)[searchKey]
        return value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      })
    : data

  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4 gap-2">
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              onClick={() => setSearchQuery("")}
              className="p-2 h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell
                        ? column.cell({ row: { original: row } })
                        : (row as any)[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 