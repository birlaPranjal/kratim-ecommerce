import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getOrderById, updateOrder, updateOrderStatus } from "@/lib/orders"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      )
    }
    
    const orderId = params.id
    const { status, adminComment, updateOrderStatus: newOrderStatus } = await req.json()
    
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }
    
    // Get the order
    const order = await getOrderById(orderId)
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }
    
    // Check if the order has a customer request
    if (!order.customerRequest) {
      return NextResponse.json(
        { error: "This order does not have a customer request" },
        { status: 400 }
      )
    }
    
    // Update the customer request status
    const updateData: any = {
      "customerRequest.status": status
    }
    
    if (adminComment) {
      updateData["customerRequest.adminComment"] = adminComment
    }
    
    // Update the order
    let updatedOrder = await updateOrder(orderId, updateData)
    
    // If cancellation request is approved, cancel the order
    if (status === "approved" && newOrderStatus) {
      updatedOrder = await updateOrderStatus(orderId, newOrderStatus)
    }
    
    return NextResponse.json({
      success: true,
      message: `Request ${status}`,
      order: updatedOrder
    })
    
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    )
  }
} 