import { NextResponse } from "next/server"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { updatePaymentStatus } from "@/lib/orders"

export async function POST(request: Request) {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await request.json()

    if (!orderId || !razorpayPaymentId) {
      return NextResponse.json(
        { success: false, error: "Missing required payment parameters" },
        { status: 400 }
      )
    }

    // If we don't have both order ID and signature, skip signature verification
    if (razorpayOrderId && razorpaySignature) {
      // Verify the payment signature
      const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)

      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid payment signature" },
          { status: 400 }
        )
      }
    } else {
      console.log("Skipping signature verification - missing required data", {
        orderId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      });
    }

    // Update the order status
    await updatePaymentStatus(orderId, "completed", razorpayPaymentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
