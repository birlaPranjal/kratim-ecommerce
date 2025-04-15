import Razorpay from "razorpay"
import crypto from "crypto"

// Initialize Razorpay with your key id and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export interface PaymentOptions {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

export async function createOrder({
  amount,
  currency = "INR",
  receipt = `order_${Date.now()}`,
  notes = {},
}: PaymentOptions) {
  try {
    // Create a new order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise (Razorpay expects amount in smallest currency unit)
      currency,
      receipt,
      notes,
    })

    return {
      success: true,
      order,
    }
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return {
      success: false,
      error: "Failed to create payment order",
    }
  }
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  // Create a signature using the order_id and payment_id
  const text = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(text)
    .digest("hex")

  // Compare the signatures
  return expectedSignature === signature
}

export function getPublicKey() {
  return process.env.RAZORPAY_KEY_ID
} 