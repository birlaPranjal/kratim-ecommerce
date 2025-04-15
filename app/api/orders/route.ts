import { NextResponse } from "next/server"
import { createOrder } from "@/lib/orders"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const order = await createOrder(data)
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
} 