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
import { X } from "lucide-react"

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
}

export default function ProductFilters({ categories, maxPrice, currentFilters }: ProductFiltersProps) {
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
  }

  const resetFilters = () => {
    setCategory('all')
    setCollection('all')
    setSort('default')
    setPriceRange([0, maxPrice])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Filters</span>
        {filtersChanged && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-sm text-gray-500 hover:text-gray-900"
          >
            Reset <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["price", "category", "collection", "sort"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                max={maxPrice}
                step={100}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
              />
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 px-3 py-1.5 rounded-md">
                  <Label className="text-xs">Min</Label>
                  <p className="font-medium">₹{priceRange[0]}</p>
                </div>
                <div className="bg-gray-100 px-3 py-1.5 rounded-md">
                  <Label className="text-xs">Max</Label>
                  <p className="font-medium">₹{priceRange[1]}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="collection">
          <AccordionTrigger>Collection</AccordionTrigger>
          <AccordionContent>
            <Select value={collection} onValueChange={setCollection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Collections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {isLoading ? (
                  <SelectItem value="" disabled>Loading collections...</SelectItem>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort">
          <AccordionTrigger>Sort By</AccordionTrigger>
          <AccordionContent>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {filtersChanged && (
        <Button 
          onClick={handleApplyFilters} 
          className="w-full bg-amber-600 hover:bg-amber-700 mt-4"
        >
          Apply Filters
        </Button>
      )}
    </div>
  )
} 