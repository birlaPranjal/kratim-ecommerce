"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface UsersSearchProps {
  onSearch: (query: string) => void
}

export default function UsersSearch({ onSearch }: UsersSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleClear = () => {
    setSearchQuery("")
    onSearch("")
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-sm">
      <Input
        type="search"
        placeholder="Search by name or email..."
        className="pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      ) : (
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      )}
    </form>
  )
} 