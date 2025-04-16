import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { createOrder, getOrders, getOrderById } from "@/lib/orders"
import { addOrderToUser } from "@/lib/users"
import { z } from "zod"

// GET - Retrieve all orders (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    
    const orders = await getOrders()
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const body = await req.json()
    
    // Validate order data
    // Note: Full validation would be more comprehensive in production
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Order must contain items" }, { status: 400 })
    }
    
    // Create the order
    const orderData = {
      user: {
        _id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
      },
      items: body.items.map((item: any) => ({
        _id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variant: item.variant,
      })),
      totalAmount: body.total,
      shippingAddress: {
        name: `${body.customer.firstName} ${body.customer.lastName}`.trim(),
        address: body.customer.address,
        city: body.customer.city,
        state: body.customer.state,
        postalCode: body.customer.postalCode,
        country: body.customer.country,
      },
      paymentStatus: "pending",
      orderStatus: "processing",
      notes: body.notes || "",
    }
    
    const order = await createOrder(orderData)
    
    // Associate the order with the user
    await addOrderToUser(session.user.id, order._id.toString())
    
    // If using Razorpay, create a Razorpay order
    if (body.paymentMethod === "razorpay") {
      // Import dynamically to avoid issues with server components
      const { createRazorpayOrder } = await import("@/lib/razorpay")
      
      try {
        const razorpayOrder = await createRazorpayOrder({
          amount: order.totalAmount,
          receipt: order._id.toString(),
          notes: {
            orderId: order._id.toString(),
            customerName: `${body.customer.firstName} ${body.customer.lastName}`.trim(),
            customerEmail: body.customer.email,
          },
        })
        
        // Add Razorpay order ID to the order
        return NextResponse.json({
          ...order,
          razorpayOrderId: razorpayOrder.id,
        })
      } catch (razorpayError) {
        console.error("Error creating Razorpay order:", razorpayError)
        // Return the order even if Razorpay creation fails
        return NextResponse.json(order)
      }
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
} 