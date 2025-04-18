import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/products"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/admin/products-table"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import ProductsSearch from "@/components/admin/products-search"

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
  const sort = typeof searchParamsObj.sort === "string" ? searchParamsObj.sort : undefined

  const products = await getProducts({ query, category, sort })

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <Button asChild className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <ProductsSearch />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
          <ProductsTable products={products} />
        </Suspense>
      </div>
    </div>
  )
}
