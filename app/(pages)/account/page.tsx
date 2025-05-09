"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signOut } from "next-auth/react"
import { CreditCard, LogOut, Package, Settings, User, Home, ShoppingBag, MapPin, Lock } from "lucide-react"
import Link from "next/link"
import { OrderItem } from "@/lib/orders"

interface RecentOrder {
  _id: string
  totalAmount: number
  orderStatus: string
  createdAt: string | Date
  items: OrderItem[]
}

export default function AccountPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }
    
    // Fetch recent orders
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch("/api/user/orders?limit=3")
        
        if (response.ok) {
          const data = await response.json()
          setRecentOrders(data.orders || [])
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error)
      }
    }
    
    fetchRecentOrders()
  }, [user, router])
  
  if (!user) {
    return null
  }
  
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"
  
  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">My Account</h1>
        <p className="text-muted-foreground">Manage your account and view your orders</p>
      </div>
      
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Link href="/account/addresses">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <MapPin className="mr-2 h-4 w-4" />
                    My Addresses
                  </Button>
                </Link>
                <Link href="/account/orders">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Order History
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  size="lg"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Orders and Activities */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Your recently placed orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
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
          {recentOrders.length > 0 && (
            <CardFooter className="flex justify-center border-t pt-6">
              <Link href="/account/orders">
                <Button variant="outline">View All Orders</Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}