import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getOrderById, updateOrderStatus, addAdminComment } from "@/lib/orders"

// GET - Get order details (admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }
    
    const orderId = params.id
    const order = await getOrderById(orderId)
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to retrieve order" }, { status: 500 })
  }
}

// PATCH - Update order status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }
    
    const orderId = params.id
    const body = await req.json()
    const { status, comment } = body
    
    if (!status) {
      return NextResponse.json({ error: "Order status is required" }, { status: 400 })
    }
    
    // Validate status value
    const validStatuses = ["processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      }, { status: 400 })
    }
    
    // Update order with status and optional comment
    const updatedOrder = await updateOrderStatus(orderId, status, comment)
    
    return NextResponse.json({
      message: "Order status updated successfully",
      order: updatedOrder
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

// PUT - Add admin comment to order
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }
    
    const orderId = params.id
    const body = await req.json()
    const { comment } = body
    
    if (!comment || typeof comment !== 'string' || comment.trim() === '') {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 })
    }
    
    const updatedOrder = await addAdminComment(orderId, comment)
    
    return NextResponse.json({
      message: "Comment added successfully",
      order: updatedOrder
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
} 