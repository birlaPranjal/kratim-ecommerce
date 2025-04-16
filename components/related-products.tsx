"use client"

import { Product } from "@/types"
import ProductCard from "@/components/product-card"

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

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-2xl font-serif font-medium mb-6">You may also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
} 