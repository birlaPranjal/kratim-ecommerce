"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowUpDown } from "lucide-react"

export default function ProductsSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get current sort option from URL
  const currentSort = searchParams.get("sort") || "newest"
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    // Create new URLSearchParams with existing parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or add sort parameter
    if (value === "newest") {
      // Default sort is "newest", so remove the parameter
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    
    // Preserve other search parameters like query or category
    const query = params.toString()
    router.push(`/admin/products${query ? `?${query}` : ""}`)
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-amber-600" />
        <Label htmlFor="sort-select" className="text-sm font-medium whitespace-nowrap">
          Sort by:
        </Label>
      </div>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          <SelectValue placeholder="Select sort option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
            <SelectItem value="category-asc">Category: A to Z</SelectItem>
            <SelectItem value="category-desc">Category: Z to A</SelectItem>
            <SelectItem value="collection-asc">Collection: A to Z</SelectItem>
            <SelectItem value="collection-desc">Collection: Z to A</SelectItem>
            <SelectItem value="inventory-asc">Inventory: Low to High</SelectItem>
            <SelectItem value="inventory-desc">Inventory: High to Low</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
} 