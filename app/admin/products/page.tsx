import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/products"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/admin/products-table"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import ProductsSearch from "@/components/admin/products-search"

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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <ProductsSearch />

      <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
        <ProductsTable products={products} />
      </Suspense>
    </div>
  )
}
