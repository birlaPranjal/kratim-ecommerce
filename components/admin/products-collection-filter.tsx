"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BookmarkIcon, Loader2 } from "lucide-react"

export default function ProductsCollectionFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for collections
  const [collections, setCollections] = useState<{_id: string, name: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Get current collection from URL
  const currentCollection = searchParams.get("collection") || ""
  
  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/collections')
        if (res.ok) {
          const data = await res.json()
          setCollections(data)
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCollections()
  }, [])
  
  // Handle collection change
  const handleCollectionChange = (value: string) => {
    // Create new URLSearchParams with existing parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove collection parameter
    if (value) {
      params.set("collection", value)
    } else {
      params.delete("collection")
    }
    
    // Preserve other search parameters like query or sort
    const query = params.toString()
    router.push(`/admin/products${query ? `?${query}` : ""}`)
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <BookmarkIcon className="h-4 w-4 text-amber-600" />
        <Label htmlFor="collection-select" className="text-sm font-medium whitespace-nowrap">
          Collection:
        </Label>
      </div>
      <Select value={currentCollection} onValueChange={handleCollectionChange}>
        <SelectTrigger id="collection-select" className="w-[180px]" disabled={isLoading}>
          <SelectValue placeholder={isLoading ? "Loading..." : "All Collections"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Collections</SelectItem>
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-amber-600 mr-2" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : collections.length > 0 ? (
            collections.map((collection) => (
              <SelectItem key={collection._id} value={collection._id}>
                {collection.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>No collections available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
} 