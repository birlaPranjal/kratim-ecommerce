import { NextRequest, NextResponse } from "next/server"
import { getUserOrders } from "@/lib/orders"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the limit query parameter
    const url = new URL(request.url)
    const limitParam = url.searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    // Fetch orders for the logged-in user
    const userOrders = await getUserOrders(session.user.id)
    
    // Apply limit if specified
    const orders = limit ? userOrders.slice(0, limit) : userOrders

    // Transform the data for the frontend
    const transformedOrders = orders.map(order => ({
      id: order._id.toString(),
      orderNumber: order._id.toString().substring(0, 8).toUpperCase(),
      date: order.createdAt,
      total: order.totalAmount,
      status: order.orderStatus,
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
      }
    }))

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
} 