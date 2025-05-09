"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Package, ShoppingBag, MessageSquare, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderRequestForm } from "./components/order-request-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Order status badge colors and icons
const statusConfig = {
  processing: {
    color: "bg-blue-500",
    icon: Package,
    label: "Processing"
  },
  shipped: {
    color: "bg-orange-500",
    icon: Package,
    label: "Shipped"
  },
  delivered: {
    color: "bg-green-500",
    icon: Package,
    label: "Delivered"
  },
  cancelled: {
    color: "bg-red-500",
    icon: Package,
    label: "Cancelled"
  }
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
  const [activeTab, setActiveTab] = useState<string>("all")
  
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

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true
    return order.orderStatus === activeTab
  })
  
  if (loading && orders.length === 0) {
    return (
      <div className="container max-w-4xl py-12 mx-auto">
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
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">View your order history</p>
        </div>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
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
          {filteredOrders.map((order) => {
            const status = statusConfig[order.orderStatus]
            const StatusIcon = status.icon
            
            return (
              <Card key={order._id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
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
                
                <CardContent>
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
                    variant="ghost" 
                    className="p-0 h-auto text-primary hover:text-primary/80" 
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    {expandedOrderId === order._id ? (
                      <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    {expandedOrderId === order._id ? "Hide Details" : "View Details"}
                  </Button>
                  <Link href={`/order-confirmation/${order._id}`}>
                    <Button variant="outline" size="sm">
                      View Order
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
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
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Payment Information</h5>
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={order.paymentStatus === "completed" ? "default" : "secondary"}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                          </div>
                          {order.paymentId && (
                            <div className="flex justify-between mt-1">
                              <span className="text-muted-foreground">Payment ID:</span>
                              <span>{order.paymentId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {order.adminComment && (
                        <>
                          <Separator />
                          <div>
                            <h5 className="text-sm font-medium mb-2">Admin Note</h5>
                            <p className="text-sm text-muted-foreground">{order.adminComment}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 
