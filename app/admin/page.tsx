import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrderStats, getRecentOrders } from "@/lib/orders"
import { getProductStats } from "@/lib/products"
import { getUserStats } from "@/lib/users"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, Package, Users } from "lucide-react"
import Link from "next/link"
import RecentOrdersTable from "@/components/admin/recent-orders-table"
import SalesChart from "@/components/admin/sales-chart"

export default async function AdminDashboard() {
  // Wrap in try/catch to handle potential errors
  let orderStats;
  let productStats;
  let userStats;
  let recentOrders;

  try {
    orderStats = await getOrderStats();
    productStats = await getProductStats();
    userStats = await getUserStats();
    recentOrders = await getRecentOrders(5);
  } catch (error) {
    console.error("Error fetching admin data:", error);
    // Set default values if data fetching fails
    orderStats = { 
      totalRevenue: 0, 
      totalOrders: 0, 
      revenueChange: 0, 
      orderChange: 0,
      monthlySales: []
    };
    productStats = { totalProducts: 0, lowStock: 0 };
    userStats = { totalUsers: 0, newUsers: 0 };
    recentOrders = [];
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(orderStats.totalRevenue || 0)}</div>
            <p className="text-xs text-gray-500">
              {(orderStats.revenueChange >= 0 ? "+" : "") + (orderStats.revenueChange || 0)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.totalOrders || 0}</div>
            <p className="text-xs text-gray-500">
              {(orderStats.orderChange >= 0 ? "+" : "") + (orderStats.orderChange || 0)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats.totalProducts || 0}</div>
            <p className="text-xs text-gray-500">{productStats.lowStock || 0} products low in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers || 0}</div>
            <p className="text-xs text-gray-500">{userStats.newUsers || 0} new this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable orders={recentOrders || []} />
            <div className="mt-4 text-center">
              <Link href="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700">
                View all orders
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1">
          <SalesChart data={orderStats.monthlySales || []} />
        </div>
      </div>
    </div>
  )
}
