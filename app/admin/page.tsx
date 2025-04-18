"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentSales } from "@/components/admin/recent-sales"
import { CalendarDateRangePicker } from "@/components/admin/date-range-picker"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { BarChart3, Users, Package, CreditCard, LayoutDashboard, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"
import Loading from "@/components/ui/loading"

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function DashboardPage() {
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState<DashboardData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  useEffect(() => {
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      if (refreshing) return
      
      setRefreshing(true)
      if (!loading) {
        toast({
          title: "Refreshing data...",
          description: "Fetching the latest dashboard information",
        })
      }
      
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
      
      if (!loading) {
        toast({
          title: "Dashboard updated",
          description: "The latest data has been loaded",
        })
      }
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
      setRefreshing(false)
    }
  }
  
  if (loading) {
    return <Loading fullScreen text="Loading dashboard data..." />
  }

  // Destructure for easier access
  const { stats, recentOrders } = dashboardData
  
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8 lg:p-10 bg-[#faf5ee]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6 text-[#1d503a]" />
          <h2 className="text-2xl md:text-3xl font-coconat font-bold text-[#1d503a]">Admin Dashboard</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <CalendarDateRangePicker />
          <Button 
            onClick={fetchDashboardData} 
            disabled={refreshing}
            className="w-full sm:w-auto bg-[#5e7d77] hover:bg-[#1d503a] text-white"
          >
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-[#5e7d77]/20 p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-[#5e7d77] data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-[#5e7d77] data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <motion.div 
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" 
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.div {...fadeInUp}>
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5e7d77]/10 rounded-bl-full" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium font-gilroy text-[#1d503a]">
                    Total Revenue
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-[#5e7d77]/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-[#5e7d77]" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-[#1d503a] font-coconat">
                    ₹{stats.monthlyRevenue.toLocaleString()}
                  </div>
                  <div className="flex items-center mt-1">
                    {stats.revenueChange > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <p className={`text-xs ${stats.revenueChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stats.revenueChange > 0 ? "+" : ""}{stats.revenueChange}% from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp}>
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5e7d77]/10 rounded-bl-full" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium font-gilroy text-[#1d503a]">
                    Orders
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-[#5e7d77]/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-[#5e7d77]" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-[#1d503a] font-coconat">{stats.totalOrders}</div>
                  <div className="flex items-center mt-1">
                    {stats.orderChange > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <p className={`text-xs ${stats.orderChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stats.orderChange > 0 ? "+" : ""}{stats.orderChange}% from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp}>
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5e7d77]/10 rounded-bl-full" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium font-gilroy text-[#1d503a]">
                    Customers
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-[#5e7d77]/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#5e7d77]" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-[#1d503a] font-coconat">{stats.totalUsers}</div>
                  <p className="text-xs text-[#1d503a]/60 mt-1">
                    Active accounts
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp}>
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5e7d77]/10 rounded-bl-full" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium font-gilroy text-[#1d503a]">
                    Products
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-[#5e7d77]/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-[#5e7d77]" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-[#1d503a] font-coconat">{stats.totalProducts}</div>
                  <p className="text-xs text-[#1d503a]/60 mt-1">
                    Products in inventory
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid gap-6 md:grid-cols-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="col-span-7 md:col-span-4 border-none shadow-md">
              <CardHeader className="border-b border-[#5e7d77]/10 bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-[#5e7d77]" />
                    <CardTitle className="text-[#1d503a] font-coconat">Monthly Revenue</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <Overview data={stats.monthlySales} />
              </CardContent>
            </Card>
            
            <Card className="col-span-7 md:col-span-3 border-none shadow-md">
              <CardHeader className="border-b border-[#5e7d77]/10 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-[#1d503a] font-coconat">Recent Orders</CardTitle>
                    <CardDescription className="text-[#1d503a]/60 font-gilroy mt-1">
                      Latest {recentOrders.length} orders
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <RecentSales orders={recentOrders} />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-coconat text-[#1d503a]">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#1d503a]/80">Processing</span>
                    <span className="text-sm font-medium text-[#1d503a]">{stats.processOrders}</span>
                  </div>
                  <div className="w-full bg-[#5e7d77]/10 rounded-full h-2.5">
                    <div 
                      className="bg-[#5e7d77] h-2.5 rounded-full" 
                      style={{ width: `${(stats.processOrders / (stats.processOrders + stats.completedOrders) * 100) || 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#1d503a]/80">Completed</span>
                    <span className="text-sm font-medium text-[#1d503a]">{stats.completedOrders}</span>
                  </div>
                  <div className="w-full bg-[#5e7d77]/10 rounded-full h-2.5">
                    <div 
                      className="bg-[#1d503a] h-2.5 rounded-full" 
                      style={{ width: `${(stats.completedOrders / (stats.processOrders + stats.completedOrders) * 100) || 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-coconat text-[#1d503a]">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-[#5e7d77]/5 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1d503a]">Avg. Order Value</span>
                    <span className="font-coconat text-[#1d503a]">
                      ₹{stats.totalOrders ? Math.round(stats.monthlyRevenue / stats.totalOrders).toLocaleString() : 0}
                    </span>
                  </div>
                  
                  <div className="bg-[#5e7d77]/5 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1d503a]">Conversion Rate</span>
                    <span className="font-coconat text-[#1d503a]">
                      {stats.totalUsers ? Math.round((stats.totalOrders / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                  
                  <div className="bg-[#5e7d77]/5 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1d503a]">Products/Order</span>
                    <span className="font-coconat text-[#1d503a]">2.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-coconat text-[#1d503a]">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-[#5e7d77] hover:bg-[#1d503a] text-white">
                    Manage Products
                  </Button>
                  <Button className="w-full bg-[#1d503a] hover:bg-[#1d503a]/80 text-white">
                    View Orders
                  </Button>
                  <Button className="w-full bg-white border border-[#5e7d77] text-[#5e7d77] hover:bg-[#5e7d77]/5">
                    Export Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-[#1d503a] font-coconat">Advanced Analytics</CardTitle>
              <CardDescription className="text-[#1d503a]/60 font-gilroy">
                Detailed statistics and trends will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-[#5e7d77]/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1d503a] mb-2 font-coconat">Analytics Module Coming Soon</h3>
                <p className="text-[#1d503a]/60 max-w-md">
                  We're working on bringing you detailed analytics and insights to help you grow your business.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
