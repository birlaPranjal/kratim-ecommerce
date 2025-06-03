"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Filter, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProductFiltersProps {
  categories: string[]
  maxPrice: number
  currentFilters: {
    category: string
    collection: string
    sort: string
    minPrice: number
    maxPrice: number
  }
  onApply?: () => void
  isMobile?: boolean
}

export default function ProductFilters({ 
  categories, 
  maxPrice, 
  currentFilters,
  onApply,
  isMobile = false
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(currentFilters.category)
  const [collection, setCollection] = useState(currentFilters.collection)
  const [sort, setSort] = useState(currentFilters.sort)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentFilters.minPrice,
    currentFilters.maxPrice
  ])
  const [collections, setCollections] = useState<{_id: string, name: string, slug: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
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
  
  // Check if filters have changed from the current URL params
  const filtersChanged = 
    category !== currentFilters.category ||
    collection !== currentFilters.collection ||
    sort !== currentFilters.sort ||
    priceRange[0] !== currentFilters.minPrice ||
    priceRange[1] !== currentFilters.maxPrice

  // Apply filters by updating the URL
  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    if (category !== 'all') {
      params.set('category', category)
    }

    if (collection !== 'all') {
      params.set('collection', collection)
    }

    if (sort !== 'default') {
      params.set('sort', sort)
    }

    if (priceRange[0] > 0) {
      params.set('minPrice', priceRange[0].toString())
    }

    if (priceRange[1] < maxPrice) {
      params.set('maxPrice', priceRange[1].toString())
    }

    const query = params.toString()
    router.push(`/shop${query ? `?${query}` : ''}`)
    
    // Call the onApply callback if provided
    if (onApply) {
      onApply()
    }
  }

  const resetFilters = () => {
    setCategory('all')
    setCollection('all')
    setSort('default')
    setPriceRange([0, maxPrice])
  }

  // Count active filters
  const activeFilterCount = [
    category !== 'all',
    collection !== 'all',
    sort !== 'default',
    priceRange[0] > 0,
    priceRange[1] < maxPrice
  ].filter(Boolean).length

  return (
    <div className="space-y-5">
      {!isMobile && (
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <Badge 
                className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-amber-500 text-white" 
                variant="default"
              >
                {activeFilterCount}
              </Badge>
            )}
          </div>
          
          {filtersChanged && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              Reset <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      <Accordion 
        type="multiple" 
        defaultValue={isMobile ? ["sort"] : ["price", "category", "collection", "sort"]}
        className="space-y-3"
      >
        <AccordionItem value="price" className="border rounded-md px-3 shadow-sm overflow-hidden">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <span>Price Range</span>
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Badge variant="outline" className="ml-2 bg-amber-50 border-amber-200">Active</Badge>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-5 pt-2 pb-4">
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                max={maxPrice}
                step={100}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                className="mt-6"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                  <Label className="text-xs text-gray-500">Min</Label>
                  <p className="font-medium text-sm">₹{priceRange[0]}</p>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                  <Label className="text-xs text-gray-500">Max</Label>
                  <p className="font-medium text-sm">₹{priceRange[1]}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border rounded-md px-3 shadow-sm overflow-hidden">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <span>Category</span>
              {category !== 'all' && (
                <Badge variant="outline" className="ml-2 bg-amber-50 border-amber-200">Active</Badge>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="collection" className="border rounded-md px-3 shadow-sm overflow-hidden">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <span>Collection</span>
              {collection !== 'all' && (
                <Badge variant="outline" className="ml-2 bg-amber-50 border-amber-200">Active</Badge>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-3">
              <Select value={collection} onValueChange={setCollection}>
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="All Collections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-600 mr-2" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : collections.length > 0 ? (
                    collections.map((col) => (
                      <SelectItem key={col._id} value={col._id}>
                        {col.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No collections available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort" className="border rounded-md px-3 shadow-sm overflow-hidden">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-sm font-medium flex items-center">
              <span>Sort By</span>
              {sort !== 'default' && (
                <Badge variant="outline" className="ml-2 bg-amber-50 border-amber-200">Active</Badge>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-3">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {filtersChanged && (
        <Button 
          onClick={handleApplyFilters} 
          className="w-full bg-amber-600 hover:bg-amber-700 mt-4 transition-all"
        >
          Apply Filters
        </Button>
      )}
    </div>
  )
} 