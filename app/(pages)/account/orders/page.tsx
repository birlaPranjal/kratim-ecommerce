"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Package, ShoppingBag, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderRequestForm } from "./components/order-request-form"

// Order status badge colors
const statusColors = {
  processing: "bg-blue-500",
  shipped: "bg-orange-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
}

// Define the Order type based on the data structure
interface OrderItem {
  _id: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

interface Order {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: OrderItem[]
  totalAmount: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentStatus: "pending" | "completed" | "failed"
  paymentId?: string
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled"
  adminComment?: string
  createdAt: string | Date
  updatedAt: string | Date
  customerRequest?: {
    type: string
    status: string
    reason: string
    adminComment?: string
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  
  // Fetch orders when component mounts
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }
    
    fetchOrders()
  }, [user, router])
  
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/orders")
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      setExpandedOrderId(orderId)
    }
  }
  
  if (loading && orders.length === 0) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">View your order history</p>
          </div>
          <Link href="/account">
            <Button variant="outline">Back to Account</Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="container max-w-4xl py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">View your order history</p>
        </div>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
          <p className="text-muted-foreground mt-2">You haven't placed any orders yet</p>
          <Link href="/shop">
            <Button className="mt-4">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order._id.toString().substring(0, 8).toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      Placed on {formatDate(new Date(order.createdAt))}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={
                      order.orderStatus === "processing" ? "bg-blue-500" :
                      order.orderStatus === "shipped" ? "bg-orange-500" :
                      order.orderStatus === "delivered" ? "bg-green-500" :
                      "bg-red-500"
                    }
                  >
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    <span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex overflow-x-auto space-x-4 py-2 px-1">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={item._id} className="relative min-w-[80px] h-20 rounded overflow-hidden border">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="relative min-w-[80px] h-20 rounded overflow-hidden border bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">+{order.items.length - 4} more</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="justify-between pt-0 pb-4">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary" 
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  {expandedOrderId === order._id ? "Hide Details" : "View Details"}
                </Button>
                <Link href={`/order-confirmation/${order._id}`}>
                  <Button variant="outline" size="sm">View Order</Button>
                </Link>
              </CardFooter>
              
              {expandedOrderId === order._id && (
                <div className="bg-accent/20 px-6 py-4">
                  <h4 className="font-medium mb-3">Order Details</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Items</h5>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex justify-between text-sm">
                            <div className="flex-1">
                              <div>{item.name}</div>
                              {item.variant && <div className="text-muted-foreground">{item.variant}</div>}
                              <div className="text-muted-foreground">Qty: {item.quantity}</div>
                            </div>
                            <div className="font-medium">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Shipping Address</h5>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Order Request Actions */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Order Actions</h5>
                      
                      {order.customerRequest ? (
                        <div className="text-sm p-3 bg-muted rounded-md">
                          <p className="font-medium">
                            {order.customerRequest.type.charAt(0).toUpperCase() + order.customerRequest.type.slice(1)} Request: 
                            <Badge className="ml-2" variant={
                              order.customerRequest.status === "approved" ? "secondary" : 
                              order.customerRequest.status === "rejected" ? "destructive" : 
                              "outline"
                            }>
                              {order.customerRequest.status.charAt(0).toUpperCase() + order.customerRequest.status.slice(1)}
                            </Badge>
                          </p>
                          <p className="mt-1">Reason: {order.customerRequest.reason}</p>
                          {order.customerRequest.adminComment && (
                            <p className="mt-1">Admin Response: {order.customerRequest.adminComment}</p>
                          )}
                        </div>
                      ) : (
                        <OrderRequestForm order={order} onRequestSubmitted={fetchOrders} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
