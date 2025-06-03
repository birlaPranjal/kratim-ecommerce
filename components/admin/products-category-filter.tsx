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
import { TagIcon } from "lucide-react"

export default function ProductsCategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for categories
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Get current category from URL
  const currentCategory = searchParams.get("category") || ""
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        // Get unique categories from products
        const res = await fetch('/api/products/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
  }, [])
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    // Create new URLSearchParams with existing parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove category parameter
    if (value) {
      params.set("category", value)
    } else {
      params.delete("category")
    }
    
    // Preserve other search parameters like query or sort
    const query = params.toString()
    router.push(`/admin/products${query ? `?${query}` : ""}`)
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <TagIcon className="h-4 w-4 text-amber-600" />
        <Label htmlFor="category-select" className="text-sm font-medium whitespace-nowrap">
          Category:
        </Label>
      </div>
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger id="category-select" className="w-[180px]" disabled={isLoading}>
          <SelectValue placeholder={isLoading ? "Loading..." : "All Categories"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 