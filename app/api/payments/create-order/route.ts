import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { getOrderById, updateOrder } from "@/lib/orders"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get order details
    const order = await getOrderById(orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: order.total * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: orderId,
    })

    // Update order with Razorpay order ID
    await updateOrder(orderId, {
      razorpayOrderId: razorpayOrder.id,
    })

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}
