"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentSales } from "@/components/admin/recent-sales"
import { CalendarDateRangePicker } from "@/components/admin/date-range-picker"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface DashboardData {
  stats: {
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    monthlyRevenue: number;
    revenueChange: number;
    orderChange: number;
    processOrders: number;
    completedOrders: number;
    monthlySales: Array<{ name: string; total: number }>;
  };
  recentOrders: Array<any>;
}

// Default empty data to prevent null errors
const DEFAULT_DATA: DashboardData = {
  stats: {
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    monthlyRevenue: 0,
    revenueChange: 0,
    orderChange: 0,
    processOrders: 0,
    completedOrders: 0,
    monthlySales: []
  },
  recentOrders: []
};

export default function DashboardPage() {
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState<DashboardData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch("/api/admin/dashboard")
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      
      const data = await response.json()
      
      // Ensure all required values exist
      const safeData = {
        stats: {
          totalOrders: data.stats?.totalOrders || 0,
          totalUsers: data.stats?.totalUsers || 0,
          totalProducts: data.stats?.totalProducts || 0,
          monthlyRevenue: data.stats?.monthlyRevenue || 0,
          revenueChange: data.stats?.revenueChange || 0,
          orderChange: data.stats?.orderChange || 0,
          processOrders: data.stats?.processOrders || 0,
          completedOrders: data.stats?.completedOrders || 0,
          monthlySales: data.stats?.monthlySales || []
        },
        recentOrders: data.recentOrders || []
      }
      
      setDashboardData(safeData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
      
      // Set default data to prevent UI errors
      setDashboardData(DEFAULT_DATA)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Destructure for easier access
  const { stats, recentOrders } = dashboardData
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button onClick={fetchDashboardData}>Refresh</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.revenueChange > 0 ? "+" : ""}{stats.revenueChange}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Orders
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.orderChange > 0 ? "+" : ""}{stats.orderChange}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Customers
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Active accounts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Products
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Products in inventory
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={stats.monthlySales} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest {recentOrders.length} orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales orders={recentOrders} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Current order status distribution</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Processing</span>
                    <span className="text-sm text-muted-foreground">{stats.processOrders} orders</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm text-muted-foreground">{stats.completedOrders} orders</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Sales performance summary</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Orders</span>
                    <span className="text-sm text-muted-foreground">{stats.totalOrders} orders</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Month Revenue</span>
                    <span className="text-sm text-muted-foreground">₹{stats.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Revenue Growth</span>
                    <span className={`text-sm ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.revenueChange > 0 ? "+" : ""}{stats.revenueChange}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
