import { getProducts } from "@/lib/products"
import type { Product as ProductType } from "@/lib/products"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { Suspense } from "react"
import { ProductSkeletonGrid } from "@/components/product-skeleton"

// Tell Next.js this is a dynamic page that needs searchParams
export const dynamic = 'force-dynamic';

// Augment the Product type with the required inventory field for ProductCard
interface Product extends ProductType {
  inventory: number;
}

interface SearchParamsProps {
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  // Get all products to extract categories and max price for filters
  const allProducts = await getProducts() as unknown as Product[]
  
  // Extract unique categories and ensure string type
  const categories = Array.from(
    new Set(allProducts.map((product: Product) => product.category))
  ) as string[]
  
  // Find max price
  const maxPrice = Math.max(...allProducts.map((product: Product) => product.price), 0)
  
  // Wait for search params and provide default values
  // The await is necessary for Next.js to properly handle the searchParams
  const params = await Promise.resolve(searchParams);
  
  const categoryParam = String(params.category || 'all');
  const sortParam = String(params.sort || 'default');
  const minPriceParam = String(params.minPrice || '0');
  const maxPriceParam = String(params.maxPrice || maxPrice.toString());
  
  // Prepare filtered params for query
  const category = categoryParam !== 'all' ? categoryParam : undefined;
  const sort = sortParam !== 'default' ? sortParam : undefined;
  const minPrice = parseInt(minPriceParam);
  const maxPriceValue = parseInt(maxPriceParam);
  
  // Filter products based on search params
  const products = await getProducts({ 
    category, 
    sort, 
    minPrice: isNaN(minPrice) ? undefined : minPrice, 
    maxPrice: isNaN(maxPriceValue) ? undefined : maxPriceValue 
  }) as unknown as Product[]

  // Create an object with the current filter values to pass to the client component
  const currentFilters = {
    category: categoryParam,
    sort: sortParam,
    minPrice: isNaN(minPrice) ? 0 : minPrice,
    maxPrice: isNaN(maxPriceValue) ? maxPrice : maxPriceValue
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-center">
            Our Collection
          </h1>
          
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-8">
            Discover our curated collection of fine jewelry pieces, crafted with precision and designed for elegance.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Sticky on desktop */}
          <div className="w-full lg:w-1/4 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="font-medium text-lg mb-4">Filters</h2>
              <ProductFilters 
                categories={categories} 
                maxPrice={maxPrice}
                currentFilters={currentFilters}
              />
            </div>
          </div>

          {/* Products */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
                {/* Could add additional sort controls here */}
              </div>
            </div>
            
            <Suspense fallback={<ProductSkeletonGrid count={6} />}>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      product={{
                        ...product,
                        // Ensure inventory is available (using stock from DB as inventory for the UI)
                        inventory: product.inventory ?? product.stock ?? 0
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() => {
                      window.location.href = '/shop';
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
