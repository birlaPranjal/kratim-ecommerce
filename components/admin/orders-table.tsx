"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface OrdersTableProps {
  orders: any[]
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="px-4 py-3 font-medium">#{order._id.substring(0, 8).toUpperCase()}</td>
                <td className="px-4 py-3">
                  {order.customer.firstName} {order.customer.lastName}
                </td>
                <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span
                      className={`mr-2 h-2 w-2 rounded-full ${
                        order.status === "completed"
                          ? "bg-green-500"
                          : order.status === "processing"
                            ? "bg-blue-500"
                            : order.status === "shipped"
                              ? "bg-purple-500"
                              : order.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                      }`}
                    />
                    <span className="capitalize">{order.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize">{order.paymentStatus || "pending"}</td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/orders/${order._id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
