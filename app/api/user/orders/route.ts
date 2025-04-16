import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getUserOrders } from "@/lib/orders"

// GET - Retrieve user orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const userId = session.user.id
    const orders = await getUserOrders(userId)
    
    return NextResponse.json({ 
      orders: orders || []
    })
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 