import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if environment variables exist (don't show the full values for security)
    const razorpayKeyIdExists = !!process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecretExists = !!process.env.RAZORPAY_KEY_SECRET;
    
    // Get partial key info for debugging (first 4 chars only)
    const razorpayKeyIdPartial = process.env.RAZORPAY_KEY_ID ? 
      `${process.env.RAZORPAY_KEY_ID.substring(0, 4)}...` : 'not set';
    
    // Test if we can initialize Razorpay (don't actually make a request)
    let razorpayInitSuccess = false;
    let razorpayError = null;
    
    try {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'missing',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'missing',
      });
      razorpayInitSuccess = true;
    } catch (err) {
      razorpayError = err.message;
    }
    
    // Return diagnostic info
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      variables: {
        razorpayKeyIdExists,
        razorpayKeySecretExists,
        razorpayKeyIdPartial,
      },
      razorpay: {
        initSuccess: razorpayInitSuccess,
        errorMessage: razorpayError
      }
    });
  } catch (error) {
    console.error("Debug route error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Unknown error" 
    }, { status: 500 });
  }
} 