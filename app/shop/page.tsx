import { getProducts } from "@/lib/products"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { Suspense } from "react"
import { ProductSkeletonGrid } from "@/components/product-skeleton"

interface SearchParams {
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Get all products to extract categories and max price for filters
  const allProducts = await getProducts()
  
  // Extract unique categories
  const categories = Array.from(new Set(allProducts.map(product => product.category)))
  
  // Find max price
  const maxPrice = Math.max(...allProducts.map(product => product.price), 0)
  
  // Parse search params
  const category = searchParams.category && searchParams.category !== 'all' ? searchParams.category : undefined
  const sort = searchParams.sort && searchParams.sort !== 'default' ? searchParams.sort : undefined
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined
  const maxPriceParam = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined
  
  // Filter products based on search params
  const products = await getProducts({ 
    category, 
    sort, 
    minPrice, 
    maxPrice: maxPriceParam 
  })

  // Create an object with the current filter values to pass to the client component
  const currentFilters = {
    category: category || "all",
    sort: sort || "default",
    minPrice: minPrice || 0,
    maxPrice: maxPriceParam || maxPrice
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">Our Collection</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ProductFilters 
            categories={categories} 
            maxPrice={maxPrice}
            currentFilters={currentFilters}
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
