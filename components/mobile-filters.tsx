"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter, X, SlidersHorizontal } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import ProductFilters from "@/components/product-filters"

interface MobileFiltersProps {
  categories: string[]
  maxPrice: number
  currentFilters: {
    category: string
    collection: string
    sort: string
    minPrice: number
    maxPrice: number
  }
  hasActiveFilters: boolean
}

export default function MobileFilters({ 
  categories, 
  maxPrice, 
  currentFilters, 
  hasActiveFilters 
}: MobileFiltersProps) {
  const [open, setOpen] = useState(false)
  
  // Count active filters
  const activeFilterCount = [
    currentFilters.category !== 'all',
    currentFilters.collection !== 'all',
    currentFilters.sort !== 'default',
    currentFilters.minPrice > 0,
    currentFilters.maxPrice < maxPrice
  ].filter(Boolean).length
  
  return (
    <div className="sticky top-[70px] z-20 bg-background py-2">
      <div className="flex items-center justify-between mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 flex items-center justify-center gap-2 border-gray-200 shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4 text-amber-600" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge 
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-amber-500 text-white" 
                  variant="default"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-xl">
            <SheetHeader className="mb-4 border-b pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-amber-600" />
                  <SheetTitle>Filters</SheetTitle>
                  {activeFilterCount > 0 && (
                    <Badge 
                      className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-amber-500 text-white" 
                      variant="default"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </div>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.location.href = '/shop'}
                    className="h-8 text-sm text-amber-600 hover:bg-amber-50"
                  >
                    Reset <X className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            </SheetHeader>
            
            <div className="pb-8">
              <ProductFilters 
                categories={categories} 
                maxPrice={maxPrice}
                currentFilters={currentFilters}
                onApply={() => setOpen(false)}
                isMobile
              />
            </div>
            
            <SheetFooter className="mb-2">
              <div className="w-full flex flex-col gap-2">
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 h-12 font-medium"
                  onClick={() => {
                    // Close the sheet after a brief delay to allow for any filter apply navigations
                    setTimeout(() => setOpen(false), 100)
                  }}
                >
                  View Results
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {hasActiveFilters && (
          <a 
            href="/shop" 
            className="flex-shrink-0 ml-3 text-xs font-medium text-amber-600 hover:text-amber-700"
          >
            Reset all
          </a>
        )}
      </div>
      
      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-3">
          {currentFilters.category !== 'all' && (
            <Badge variant="outline" className="h-6 text-xs bg-gray-50 border-gray-200 px-2">
              <span className="text-gray-500 mr-1">Category:</span> {currentFilters.category}
            </Badge>
          )}
          
          {currentFilters.collection !== 'all' && (
            <Badge variant="outline" className="h-6 text-xs bg-gray-50 border-gray-200 px-2">
              <span className="text-gray-500 mr-1">Collection</span>
            </Badge>
          )}
          
          {currentFilters.sort !== 'default' && (
            <Badge variant="outline" className="h-6 text-xs bg-gray-50 border-gray-200 px-2">
              <span className="text-gray-500 mr-1">Sort:</span> {currentFilters.sort === 'price-asc' 
                ? 'Low to High' 
                : currentFilters.sort === 'price-desc' 
                  ? 'High to Low' 
                  : 'Newest'}
            </Badge>
          )}
          
          {(currentFilters.minPrice > 0 || currentFilters.maxPrice < maxPrice) && (
            <Badge variant="outline" className="h-6 text-xs bg-gray-50 border-gray-200 px-2">
              <span className="text-gray-500 mr-1">Price:</span> ₹{currentFilters.minPrice} - ₹{currentFilters.maxPrice}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
} 