import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getOrderById, updateOrder } from "@/lib/orders"
import { ObjectId } from "mongodb"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to request order changes" },
        { status: 401 }
      )
    }
    
    const orderId = params.id
    const { requestType, reason } = await req.json()
    
    if (!requestType || !reason) {
      return NextResponse.json(
        { error: "Request type and reason are required" },
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
    
    // Ensure the user owns this order
    if (order.user._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to update this order" },
        { status: 403 }
      )
    }
    
    // Update the order with the request
    const requestInfo = {
      type: requestType,
      reason: reason,
      status: "pending",
      createdAt: new Date()
    }
    
    // Can only cancel if the order is not already cancelled or delivered
    if (requestType === "cancellation" && 
        (order.orderStatus === "cancelled" || order.orderStatus === "delivered")) {
      return NextResponse.json(
        { error: `Cannot request cancellation for an order that is ${order.orderStatus}` },
        { status: 400 }
      )
    }
    
    // Can only return if the order is delivered
    if (requestType === "return" && order.orderStatus !== "delivered") {
      return NextResponse.json(
        { error: "Can only request returns for delivered orders" },
        { status: 400 }
      )
    }
    
    const updatedOrder = await updateOrder(orderId, {
      customerRequest: requestInfo,
    })
    
    return NextResponse.json({
      success: true,
      message: `Your ${requestType} request has been submitted`,
      order: updatedOrder
    })
    
  } catch (error) {
    console.error("Error processing order request:", error)
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    )
  }
} 