"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { OrderItem } from "@/lib/orders"

interface RecentOrder {
  _id: string
  totalAmount: number
  orderStatus: string
  createdAt: string | Date
  items: OrderItem[]
}

export default function AccountDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }
    
    // Fetch recent orders
    const fetchRecentOrders = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/user/orders?limit=3")
        
        if (response.ok) {
          const data = await response.json()
          setRecentOrders(data.orders || [])
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRecentOrders()
  }, [user, router])
  
  if (!user) {
    return null
  }
  
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user.name?.split(' ')[0]}</p>
      </div>
      
      <div className="grid gap-6">
        {/* Account Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.orderCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Total orders placed</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/account/orders" className="text-xs text-primary hover:underline">
                View all orders
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.addresses?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Saved addresses</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/account/addresses" className="text-xs text-primary hover:underline">
                Manage addresses
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">Saved items</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/account/wishlist" className="text-xs text-primary hover:underline">
                View wishlist
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your recently placed orders and their status</CardDescription>
              </div>
              <Link href="/account/orders">
                <Button variant="outline" size="sm">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-muted/10">
                <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                <p className="text-muted-foreground mt-2">You haven't placed any orders yet</p>
                <Link href="/shop">
                  <Button className="mt-4">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">
                          Order #{order._id.toString().substring(0, 8).toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">{order.items.length} items • </span>
                        <span className={
                          order.orderStatus === "processing" ? "text-blue-500" :
                          order.orderStatus === "shipped" ? "text-orange-500" :
                          order.orderStatus === "delivered" ? "text-green-500" :
                          "text-red-500"
                        }>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                      <Link href={`/order-confirmation/${order._id}`}>
                        <Button variant="link" className="h-auto p-0">View Order</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}