import { NextResponse } from "next/server"

export async function GET() {
  try {
    const key = process.env.RAZORPAY_KEY_ID;

    if (!key) {
      console.error("Razorpay key not found in environment variables");
      return NextResponse.json({ error: "Razorpay key not configured" }, { status: 500 });
    }

    return NextResponse.json({ key });
  } catch (error) {
    console.error("Error retrieving Razorpay key:", error);
    return NextResponse.json({ error: "Failed to retrieve payment gateway key" }, { status: 500 });
  }
} 