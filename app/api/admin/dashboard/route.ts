import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getOrderStats, getRecentOrders } from "@/lib/orders"
import { getUserStats } from "@/lib/users"
import { getProductStats } from "@/lib/products"

// GET - Dashboard stats (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }
    
    // Get various stats
    const orderStats = await getOrderStats()
    const userStats = await getUserStats()
    const productStats = await getProductStats()
    const recentOrders = await getRecentOrders(5)
    
    return NextResponse.json({
      stats: {
        totalOrders: orderStats.totalOrders,
        totalUsers: userStats.totalUsers,
        totalProducts: productStats.totalProducts,
        monthlyRevenue: orderStats.monthlyRevenue,
        revenueChange: orderStats.revenueChange,
        orderChange: orderStats.orderChange,
        processOrders: orderStats.processOrders,
        completedOrders: orderStats.completedOrders,
        monthlySales: orderStats.monthlySales
      },
      recentOrders
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
} 