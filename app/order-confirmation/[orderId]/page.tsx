import { getOrderById } from "@/lib/orders"
import { notFound } from "next/navigation"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string }
}) {
  const order = await getOrderById(params.orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-500 mb-1">Order Number</div>
              <div className="font-medium">{order._id.substring(0, 8).toUpperCase()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Date</div>
              <div className="font-medium">{formatDate(order.createdAt)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total</div>
              <div className="font-medium">{formatCurrency(order.total)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Payment Method</div>
              <div className="font-medium capitalize">{order.paymentMethod}</div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="font-medium">Order Details</h2>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex items-start">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </span>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="font-medium">Shipping Address</h2>
            </div>
            <div className="p-6">
              <p className="mb-1">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="mb-1">{order.customer.address}</p>
              <p className="mb-1">
                {order.customer.city}, {order.customer.state} {order.customer.postalCode}
              </p>
              <p className="mb-1">{order.customer.country}</p>
              <p className="mt-4 text-gray-500">Email: {order.customer.email}</p>
              <p className="text-gray-500">Phone: {order.customer.phone}</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="font-medium">Payment Information</h2>
            </div>
            <div className="p-6">
              <p className="mb-2 capitalize">
                <span className="font-medium">Method: </span>
                {order.paymentMethod}
              </p>
              <p className="mb-2">
                <span className="font-medium">Status: </span>
                <span className="capitalize">{order.paymentStatus || "pending"}</span>
              </p>
              {order.razorpayPaymentId && (
                <p className="mb-2">
                  <span className="font-medium">Transaction ID: </span>
                  {order.razorpayPaymentId}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">A confirmation email has been sent to {order.customer.email}</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
