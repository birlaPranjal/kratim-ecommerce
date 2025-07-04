"use client"

import { Badge } from "@/components/ui/badge"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
// Remove the direct import from lib/orders and define types locally
// import { Order } from "@/lib/orders"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"

// Define the Order type interface with more specific types
interface OrderItem {
  _id: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

interface OrderUser {
  _id: string
  name: string
  email: string
}

interface Order {
  _id: string
  user: OrderUser
  items: OrderItem[]
  totalAmount: number
  subtotal?: number
  shipping?: number
  total?: number
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "completed" | "failed"
  paymentMethod?: string
  razorpayPaymentId?: string
  createdAt: string | Date
  updatedAt: string | Date
  notes?: string
  customer?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

interface RecentOrdersTableProps {
  orders?: Order[]
}

export default function RecentOrdersTable({ orders = [] }: RecentOrdersTableProps) {
  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No recent orders found
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          // Safely extract properties with fallbacks
          const id = order._id?.toString().slice(-6) || 'N/A'
          const customerName = order.user?.name || 'Guest'
          const date = order.createdAt ? formatDate(new Date(order.createdAt)) : 'N/A'
          const status = order.orderStatus || 'processing'
          const amount = order.totalAmount || 0

          return (
            <TableRow key={order._id}>
              <TableCell className="font-medium">#{id}</TableCell>
              <TableCell>{customerName}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>
                <OrderStatusBadge status={status} />
              </TableCell>
              <TableCell className="text-right">{formatCurrency(amount)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function OrderStatusBadge({ status }: { status: Order['orderStatus'] }) {
  const statusStyles = {
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    pending: "bg-gray-100 text-gray-800"
  }
  
  const style = statusStyles[status] || statusStyles.processing
  
  return (
    <Badge className={`${style} border-none`} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
} 