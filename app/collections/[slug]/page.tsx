import { notFound } from "next/navigation"
import { getCollectionBySlug, getProductsByCollection } from "@/lib/collections"
import ProductGrid from "@/components/product-grid"
import { Metadata } from "next"

interface CollectionPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollectionBySlug(params.slug)
  
  if (!collection) {
    return {
      title: "Collection Not Found"
    }
  }
  
  return {
    title: collection.name,
    description: collection.description
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await getCollectionBySlug(params.slug)
  
  if (!collection) {
    notFound()
  }
  
  const products = await getProductsByCollection(params.slug)
  
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-bold mb-2">{collection.name}</h1>
        {collection.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">{collection.description}</p>
        )}
      </div>
      
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-gray-500">There are no products in this collection yet.</p>
        </div>
      )}
    </div>
  )
} 