import { getOrders } from "@/lib/orders"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import OrdersTable from "@/components/admin/orders-table"
import OrdersSearch from "@/components/admin/orders-search"

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined
  const query = typeof searchParams.query === "string" ? searchParams.query : undefined
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined

  const orders = await getOrders({ status, query, sort })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <OrdersSearch />

      <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
        <OrdersTable orders={orders} />
      </Suspense>
    </div>
  )
}
