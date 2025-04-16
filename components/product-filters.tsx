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
    sort: string
    minPrice: number
    maxPrice: number
  }
}

export default function ProductFilters({ categories, maxPrice, currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice)
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(currentFilters.maxPrice || maxPrice)
  const [category, setCategory] = useState<string>(currentFilters.category || "all")
  const [sort, setSort] = useState<string>(currentFilters.sort || "default")
  const [filtersChanged, setFiltersChanged] = useState(false)

  // Check if the current filters differ from the URL params
  useEffect(() => {
    const urlMinPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') as string) : 0
    const urlMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') as string) : maxPrice
    const urlCategory = searchParams.get('category') || "all"
    const urlSort = searchParams.get('sort') || "default"
    
    // Check if any filters have changed from the URL
    const hasChanged = 
      minPrice !== urlMinPrice ||
      selectedMaxPrice !== urlMaxPrice ||
      category !== urlCategory ||
      sort !== urlSort

    setFiltersChanged(hasChanged)
  }, [minPrice, selectedMaxPrice, category, sort, searchParams, maxPrice])

  const handleReset = () => {
    setMinPrice(0)
    setSelectedMaxPrice(maxPrice)
    setCategory("all")
    setSort("default")
    
    // Update URL by removing all filter parameters
    router.push('/shop')
    setFiltersChanged(false)
  }

  const handleApplyFilters = () => {
    // Create a new URLSearchParams instance
    const params = new URLSearchParams()
    
    // Add parameters only if they have values
    if (minPrice > 0) {
      params.set('minPrice', minPrice.toString())
    }
    
    if (selectedMaxPrice < maxPrice) {
      params.set('maxPrice', selectedMaxPrice.toString())
    }
    
    if (category && category !== "all") {
      params.set('category', category)
    }
    
    if (sort && sort !== "default") {
      params.set('sort', sort)
    }
    
    // Update the URL with the new filters
    const newPath = params.toString() ? `/shop?${params.toString()}` : '/shop'
    router.push(newPath)
    setFiltersChanged(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        {filtersChanged && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-sm">
            <X className="h-4 w-4 mr-1" /> Reset
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full" defaultValue={["price", "category", "sort"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={[selectedMaxPrice]}
                max={maxPrice}
                step={10}
                onValueChange={(value) => setSelectedMaxPrice(value[0])}
              />
              <div className="flex items-center space-x-2">
                <div>
                  <Label htmlFor="min-price">Min</Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    min={0}
                    max={selectedMaxPrice}
                    className="h-8"
                  />
                </div>
                <div className="pt-5">—</div>
                <div>
                  <Label htmlFor="max-price">Max</Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={selectedMaxPrice}
                    onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
                    min={minPrice}
                    max={maxPrice}
                    className="h-8"
                  />
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