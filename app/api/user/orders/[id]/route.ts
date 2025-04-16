import { NextRequest, NextResponse } from "next/server"
import { getOrderById } from "@/lib/orders"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const order = await getOrderById(params.id)

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Check if the user is admin or the order belongs to the user
    if (
      session.user.role !== "admin" && 
      order.user._id.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You do not have permission to view this order" },
        { status: 403 }
      )
    }

    // Transform the order data for the frontend
    const transformedOrder = {
      id: order._id.toString(),
      orderNumber: order._id.toString().substring(0, 8).toUpperCase(),
      date: order.createdAt,
      total: order.totalAmount,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      items: order.items.map(item => ({
        id: item._id.toString(),
        productId: typeof item._id === 'string' ? item._id : item._id.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress: {
        name: order.shippingAddress.name,
        street: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zip: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
      },
      user: {
        id: order.user._id.toString(),
        name: order.user.name,
        email: order.user.email
      }
    }

    return NextResponse.json(transformedOrder)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
} 