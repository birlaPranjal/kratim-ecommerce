"use client"

import { useState, useEffect } from "react"
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
  onApplyFilters: (filters: {
    minPrice?: number
    maxPrice?: number
    category?: string
    sort?: string
  }) => void
}

export default function ProductFilters({ categories, maxPrice, onApplyFilters }: ProductFiltersProps) {
  const [minPrice, setMinPrice] = useState(0)
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(maxPrice)
  const [category, setCategory] = useState<string>("")
  const [sort, setSort] = useState<string>("")
  const [filtersChanged, setFiltersChanged] = useState(false)

  useEffect(() => {
    setFiltersChanged(true)
  }, [minPrice, selectedMaxPrice, category, sort])

  const handleReset = () => {
    setMinPrice(0)
    setSelectedMaxPrice(maxPrice)
    setCategory("")
    setSort("")
    onApplyFilters({})
    setFiltersChanged(false)
  }

  const handleApplyFilters = () => {
    const filters: any = {}

    if (minPrice > 0) {
      filters.minPrice = minPrice
    }

    if (selectedMaxPrice < maxPrice) {
      filters.maxPrice = selectedMaxPrice
    }

    if (category) {
      filters.category = category
    }

    if (sort) {
      filters.sort = sort
    }

    onApplyFilters(filters)
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
                <SelectItem value="">All Categories</SelectItem>
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
                <SelectItem value="">Default</SelectItem>
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