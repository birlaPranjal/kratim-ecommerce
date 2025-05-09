import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getContactSubmissions } from "@/lib/contact"

export async function GET(request: Request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get all contact submissions
    const submissions = await getContactSubmissions()
    
    return NextResponse.json(
      { success: true, submissions },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error getting contact submissions:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching contact submissions" },
      { status: 500 }
    )
  }
} 