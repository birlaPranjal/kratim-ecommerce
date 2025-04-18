import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getOrderById, updatePaymentStatus } from "@/lib/orders"

export async function PATCH(
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
    const { paymentStatus } = await req.json()
    
    if (!paymentStatus) {
      return NextResponse.json(
        { error: "Payment status is required" },
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
    
    // Update the payment status
    const updatedOrder = await updatePaymentStatus(orderId, paymentStatus)
    
    return NextResponse.json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      order: updatedOrder
    })
    
  } catch (error) {
    console.error("Error updating payment status:", error)
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    )
  }
} 