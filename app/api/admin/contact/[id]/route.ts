import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { 
  getContactSubmissionById, 
  updateContactSubmissionStatus,
  deleteContactSubmission 
} from "@/lib/contact"

// Get a specific contact submission
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const id = params.id
    const submission = await getContactSubmissionById(id)
    
    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, submission },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error getting contact submission:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching contact submission" },
      { status: 500 }
    )
  }
}

// Update a contact submission status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const id = params.id
    const body = await request.json()
    const { status } = body
    
    if (!status || !["new", "read", "replied"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      )
    }
    
    const updatedSubmission = await updateContactSubmissionStatus(id, status)
    
    if (!updatedSubmission) {
      return NextResponse.json(
        { success: false, message: "Submission not found or could not be updated" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, submission: updatedSubmission },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error updating contact submission:", error)
    return NextResponse.json(
      { success: false, message: "Error updating contact submission" },
      { status: 500 }
    )
  }
}

// Delete a contact submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const id = params.id
    const result = await deleteContactSubmission(id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Submission could not be deleted" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Submission deleted successfully" },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error deleting contact submission:", error)
    return NextResponse.json(
      { success: false, message: "Error deleting contact submission" },
      { status: 500 }
    )
  }
} 