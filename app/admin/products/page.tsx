import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/products"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/admin/products-table"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import ProductsSearch from "@/components/admin/products-search"
import ProductsSort from "@/components/admin/products-sort"
import ProductsCategoryFilter from "@/components/admin/products-category-filter"
import ProductsCollectionFilter from "@/components/admin/products-collection-filter"
import Loading from "@/components/ui/loading"

export const metadata = {
  title: "Admin - Products",
  description: "Manage your products",
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const searchParamsObj = searchParams || {}
  const query = typeof searchParamsObj.query === "string" ? searchParamsObj.query : undefined
  const category = typeof searchParamsObj.category === "string" ? searchParamsObj.category : undefined
  const collection = typeof searchParamsObj.collection === "string" ? searchParamsObj.collection : undefined
  const sort = typeof searchParamsObj.sort === "string" ? searchParamsObj.sort : undefined

  const products = await getProducts({ query, category, collection, sort })

  // Check if any filters are active for filter clear button visibility
  const hasActiveFilters = query || category || collection || sort;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <Button asChild className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-col space-y-4">
          <ProductsSearch />
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 pt-3 border-t">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <ProductsCategoryFilter />
              <ProductsCollectionFilter />
            </div>
            <ProductsSort />
          </div>
          
          {hasActiveFilters && (
            <div className="pt-3 border-t flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="text-amber-600 hover:text-amber-700 border-amber-200 hover:bg-amber-50"
              >
                <Link href="/admin/products">
                  Clear All Filters
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
        <Suspense fallback={
          <div className="min-h-[400px]">
            <Loading transparent text="Loading products..." />
          </div>
        }>
          <ProductsTable products={products} />
          
          {products.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products">Clear Filters</Link>
              </Button>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}
