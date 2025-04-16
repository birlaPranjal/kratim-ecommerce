import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { getOrderById, updateOrder } from "@/lib/orders"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    console.log(`Creating payment order for orderId: ${orderId}`);

    // Get order details
    const order = await getOrderById(orderId)

    if (!order) {
      console.error(`Order not found for ID: ${orderId}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    console.log(`Order found: ${JSON.stringify({
      id: order._id,
      user: order.user?.email || 'no email'
    })}`);
    
    // Debug - log the complete order object structure
    console.log('Full order object structure:', JSON.stringify(order, null, 2));
    
    // Calculate the amount from the order (handle different property names)
    // If totalAmount isn't available directly, try to calculate from items
    let amount = order.totalAmount || order.total;
    
    // If still no amount, try to calculate from items
    if (!amount && order.items && Array.isArray(order.items)) {
      amount = order.items.reduce((sum, item) => {
        return sum + ((item.price || 0) * (item.quantity || 1));
      }, 0);
      console.log(`Calculated amount from items: ${amount}`);
    }
    
    if (!amount) {
      console.error(`Order amount not found or zero. Order data:`, {
        id: order._id,
        totalAmount: order.totalAmount,
        total: order.total,
        itemsCount: order.items?.length
      });
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 })
    }

    // Ensure amount is at least 1 (minimum required by Razorpay)
    const finalAmount = Math.max(1, Math.round(amount));
    console.log(`Final amount to be used: ${finalAmount} (${finalAmount * 100} paise)`);

    // Check for Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not found in environment variables');
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    console.log(`Creating Razorpay order with amount: ${finalAmount * 100} paise`);

    // Create Razorpay order
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: finalAmount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: orderId.toString(),
      });

      console.log(`Razorpay order created successfully: ${razorpayOrder.id}`);

      // Update order with Razorpay order ID
      await updateOrder(orderId, {
        razorpayOrderId: razorpayOrder.id,
      });

      return NextResponse.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (razorpayError) {
      console.error('Error from Razorpay API:', razorpayError);
      return NextResponse.json({ 
        error: `Razorpay API error: ${razorpayError.message || 'Unknown error'}` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ 
      error: `Failed to create payment order: ${error.message || 'Unknown error'}` 
    }, { status: 500 });
  }
}
