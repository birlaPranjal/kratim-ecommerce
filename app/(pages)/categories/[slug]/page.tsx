import { notFound } from "next/navigation"
import { getCategoryBySlug, getProductsByCategory } from "@/lib/categories"
import ProductGrid from "@/components/product-grid"
import { Metadata } from "next"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: "Category Not Found"
    }
  }
  
  return {
    title: category.name,
    description: category.description
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    notFound()
  }
  
  const products = await getProductsByCategory(params.slug)
  
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
        )}
      </div>
      
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-gray-500">There are no products in this category yet.</p>
        </div>
      )}
    </div>
  )
} 