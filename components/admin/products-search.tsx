"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

export default function ProductsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize with current search query from URL
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  )
  
  // Update local state when URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new URLSearchParams with existing parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove query parameter
    if (searchQuery.trim()) {
      params.set("query", searchQuery)
    } else {
      params.delete("query")
    }
    
    // Preserve other search parameters like sort or category
    const query = params.toString()
    router.push(`/admin/products${query ? `?${query}` : ""}`)
  }

  const handleClear = () => {
    setSearchQuery("")
    
    // Create new URLSearchParams with existing parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Remove query parameter
    params.delete("query")
    
    // Preserve other search parameters like sort or category
    const query = params.toString()
    router.push(`/admin/products${query ? `?${query}` : ""}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-sm">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search by product name or category..."
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
      </div>
    </form>
  )
} 