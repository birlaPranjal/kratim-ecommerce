"use client"

import { Product } from "@/types"
import ProductCard from "@/components/product-card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RelatedProductsProps {
  category: string
  currentProductId: string
  products: Product[]
}

export default function RelatedProducts({ category, currentProductId, products }: RelatedProductsProps) {
  // Filter out the current product and get products from the same category
  const relatedProducts = products
    .filter((product) => product._id !== currentProductId && product.category === category)
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-medium text-gray-900">You may also like</h2>
        <p className="text-gray-500 mt-1">Discover more products from this collection</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {relatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

      <div className="text-center mt-8">
        <Button variant="ghost" asChild className="text-amber-600 hover:text-amber-700">
          <Link href={`/categories/${category.toLowerCase()}`} className="flex items-center gap-2 mx-auto">
            View All {formatCategoryName(category)} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
} 