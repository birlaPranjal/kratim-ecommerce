import { getUsers } from "@/lib/users"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import UsersTable from "@/components/admin/users-table"
import UsersSearch from "@/components/admin/users-search"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const role = typeof searchParams.role === "string" ? searchParams.role : undefined
  const query = typeof searchParams.query === "string" ? searchParams.query : undefined
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined

  const users = await getUsers({ role, query, sort })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users</h1>

      <UsersSearch />

      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <UsersTable users={users} />
      </Suspense>
    </div>
  )
}
