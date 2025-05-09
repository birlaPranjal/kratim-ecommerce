import { NextResponse } from "next/server"
import { createContactSubmission } from "@/lib/contact"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      )
    }
    
    // Create submission in database
    const submission = await createContactSubmission({
      name,
      email,
      subject,
      message
    })
    
    return NextResponse.json(
      { success: true, message: "Contact form submitted successfully", submission },
      { status: 201 }
    )
    
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json(
      { success: false, message: "Error submitting contact form" },
      { status: 500 }
    )
  }
} 