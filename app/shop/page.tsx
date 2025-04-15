import { getProducts } from "@/lib/products"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { Suspense } from "react"
import { ProductSkeletonGrid } from "@/components/product-skeleton"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get all products to extract categories and max price for filters
  const allProducts = await getProducts()
  
  // Extract unique categories
  const categories = Array.from(new Set(allProducts.map(product => product.category)))
  
  // Find max price
  const maxPrice = Math.max(...allProducts.map(product => product.price), 0)
  
  // Parse search params
  const category = searchParams.category as string | undefined
  const sort = searchParams.sort as string | undefined
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice as string) : undefined
  const maxPriceParam = searchParams.maxPrice ? parseInt(searchParams.maxPrice as string) : undefined
  
  // Filter products based on search params
  const products = await getProducts({ 
    category, 
    sort, 
    minPrice, 
    maxPrice: maxPriceParam 
  })

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">Our Collection</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ProductFilters 
            categories={categories} 
            maxPrice={maxPrice}
            onApplyFilters={() => {}} // Client-side handler will be used
          />
        </div>

        <div className="w-full md:w-3/4">
          <Suspense fallback={<ProductSkeletonGrid count={6} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => <ProductCard key={product._id} product={product} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
