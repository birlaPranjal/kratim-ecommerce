"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, PackageOpen, Clock, MapPin, CalendarClock, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Order, OrderItem } from "@/lib/orders"
import { useAuth } from "@/lib/auth-context"

// Define API response interface that extends the base Order type
interface OrderResponse extends Omit<Order, '_id'> {
  id: string;
  orderNumber?: string;
  date?: Date;
  status?: string;
  total?: number;
  items: (OrderItem & { id?: string })[];
}

export default function OrderConfirmationPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Unwrap params using React.use()
  const unwrappedParams = params instanceof Promise ? React.use(params) : params
  const orderId = unwrappedParams.id

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is missing")
        setLoading(false)
        return
      }

      try {
        // Fetch order details
        const response = await fetch(`/api/user/orders/${orderId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Order not found")
          } else if (response.status === 401) {
            router.push("/auth/signin?redirect=/order-confirmation/" + orderId)
            return
          } else {
            setError("Failed to fetch order details")
          }
          setLoading(false)
          return
        }
        
        const data = await response.json()
        console.log("Order confirmation data:", data)
        setOrder(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("An error occurred while fetching order details")
        setLoading(false)
      }
    }

    if (user) {
      fetchOrder()
    } else {
      // Redirect to login if no user
      router.push("/auth/signin?redirect=/order-confirmation/" + orderId)
    }
  }, [orderId, router, user])

  if (loading) {
    return (
      <div className="container max-w-4xl py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading your order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">{error}</p>
          <Button asChild>
            <Link href="/account/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!order) return null

  // Calculate subtotal from items
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Calculate shipping, ensure it's not NaN
  const shipping = typeof order.total === 'number' 
    ? order.total - subtotal 
    : typeof order.totalAmount === 'number'
      ? order.totalAmount - subtotal 
      : 0
  
  // Ensure total is a number
  const total = typeof order.total === 'number' 
    ? order.total 
    : typeof order.totalAmount === 'number'
      ? order.totalAmount
      : subtotal + shipping

  // Get order status
  const orderStatus = order.status || order.orderStatus || "processing"
  
  // Get order date
  const orderDate = order.date || order.createdAt

  return (
    <div className="container max-w-4xl py-16">
      <div className="mb-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Your order #{order.orderNumber || order.id || orderId.substring(0, 8).toUpperCase()} has been placed successfully.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-lg p-4 border flex flex-col items-center text-center">
          <PackageOpen className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Order Status</h3>
          <p className="text-muted-foreground capitalize">{orderStatus}</p>
        </div>
        
        <div className="bg-card rounded-lg p-4 border flex flex-col items-center text-center">
          <Clock className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Expected Delivery</h3>
          <p className="text-muted-foreground">5-7 Business Days</p>
        </div>
        
        <div className="bg-card rounded-lg p-4 border flex flex-col items-center text-center">
          <CalendarClock className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Order Date</h3>
          <p className="text-muted-foreground">{orderDate ? formatDate(orderDate) : "Processing"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id || item._id} className="flex gap-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between font-medium">
                      <h3>{item.name}</h3>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      Qty: {item.quantity} x {formatCurrency(item.price)}
                    </div>
                    {item.variant && (
                      <div className="text-sm text-muted-foreground">
                        {item.variant}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{order.shippingAddress?.name}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg border sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              
              <div className="bg-muted p-3 rounded-md mt-3">
                <p className="font-medium">Payment Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {(order.paymentStatus === "completed") ? (
                    <span className="text-green-600">Paid</span>
                  ) : (order.paymentStatus === "pending") ? (
                    <span className="text-amber-600">Pending Payment</span>
                  ) : (
                    order.paymentStatus
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.paymentStatus === "completed" 
                    ? "Payment has been processed successfully." 
                    : order.paymentStatus === "pending" 
                    ? `Amount of ${formatCurrency(total)} to be paid on delivery.`
                    : "There was an issue with your payment."}
                </p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button asChild className="w-full">
                <Link href="/account/orders">
                  View All Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/shop">
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Home Page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 