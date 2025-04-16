"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminOrderDetailsPage({
  params,
}: {
  params: { orderId: string }
}) {
  const { toast } = useToast()

  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }

        const orderData = await response.json()

        if (orderData) {
          setOrder(orderData)
          setStatus(orderData.status)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Error",
          description: "Failed to load order details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.orderId, toast])

  const handleStatusChange = async () => {
    try {
      setIsUpdating(true)

      const response = await fetch(`/api/orders/${params.orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      toast({
        title: "Status updated",
        description: "The order status has been updated successfully.",
      })

      setOrder((prev: any) => ({ ...prev, status }))
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/admin/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Order #{order._id.substring(0, 8).toUpperCase()}</h1>
        </div>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-1 text-sm">
              <dt className="text-gray-500">Date</dt>
              <dd>{formatDate(order.createdAt)}</dd>

              <dt className="text-gray-500">Status</dt>
              <dd>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-500"
                        : order.status === "processing"
                          ? "bg-blue-500"
                          : order.status === "shipped"
                            ? "bg-purple-500"
                            : order.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                    }`}
                  ></span>
                  <span className="capitalize">{order.status}</span>
                </div>
              </dd>

              <dt className="text-gray-500">Payment</dt>
              <dd className="capitalize">{order.paymentMethod}</dd>

              <dt className="text-gray-500">Payment Status</dt>
              <dd className="capitalize">{order.paymentStatus || "pending"}</dd>

              {order.razorpayPaymentId && (
                <>
                  <dt className="text-gray-500">Transaction ID</dt>
                  <dd className="truncate">{order.razorpayPaymentId}</dd>
                </>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-gray-500">{order.customer.email}</p>
              <p className="text-gray-500">{order.customer.phone}</p>

              <Separator className="my-3" />

              <p>{order.customer.address}</p>
              <p>
                {order.customer.city}, {order.customer.state} {order.customer.postalCode}
              </p>
              <p>{order.customer.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={handleStatusChange}
                disabled={isUpdating || status === order.status}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Quantity</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item._id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.variant && <div className="text-xs text-gray-500">{item.variant}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b">
                  <td colSpan={3} className="px-4 py-3 text-right font-medium">
                    Subtotal
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(order.subtotal)}</td>
                </tr>
                <tr className="border-b">
                  <td colSpan={3} className="px-4 py-3 text-right font-medium">
                    Shipping
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(order.shipping)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {order.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Order Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
