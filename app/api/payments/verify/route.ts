import { NextRequest, NextResponse } from "next/server"
import { updatePaymentStatus, getOrderById } from "@/lib/orders"
import { verifyPayment } from "@/lib/razorpay"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body
    
    if (!orderId || !razorpayPaymentId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required parameters" 
      }, { status: 400 })
    }
    
    // If signature is available, verify the payment
    if (razorpaySignature && razorpayOrderId) {
      const isValid = await verifyPayment({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      })
      
      if (!isValid) {
        await updatePaymentStatus(orderId, "failed")
        return NextResponse.json({ 
          success: false, 
          error: "Invalid payment signature" 
        }, { status: 400 })
      }
    }
    
    // Update payment status
    await updatePaymentStatus(orderId, "completed", razorpayPaymentId)
    
    // Get the updated order
    const updatedOrder = await getOrderById(orderId)
    
    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(updatedOrder)
      console.log("Order confirmation email sent successfully")
    } catch (emailError) {
      console.error("Error sending order confirmation email:", emailError)
      // Continue with the response even if email fails
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Payment verified successfully",
      order: updatedOrder
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to verify payment" 
    }, { status: 500 })
  }
}
