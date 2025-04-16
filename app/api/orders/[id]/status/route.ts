import { NextRequest, NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/orders"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { status } = await request.json()

    if (!status || !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const updatedOrder = await updateOrderStatus(params.id, status)

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    )
  }
} 