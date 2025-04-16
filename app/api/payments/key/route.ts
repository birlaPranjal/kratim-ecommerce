import { NextResponse } from "next/server"
import { getPublicKey } from "@/lib/razorpay"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the Razorpay key
    const key = getPublicKey()

    if (!key) {
      return NextResponse.json(
        { error: "Razorpay key not configured" },
        { status: 500 }
      )
    }

    return NextResponse.json({ key })
  } catch (error) {
    console.error("Error fetching Razorpay key:", error)
    return NextResponse.json(
      { error: "Failed to fetch Razorpay key" },
      { status: 500 }
    )
  }
} 