import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { 
  addUserAddress, 
  updateUserAddress, 
  deleteUserAddress, 
  setDefaultAddress 
} from "@/lib/users"
import { z } from "zod"

// Schema for validating address data
const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  isDefault: z.boolean().optional(),
})

// GET - Retrieve user addresses
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // The user data including addresses is loaded in session, so we can return it directly
    return NextResponse.json({ 
      addresses: session.user.addresses || [] 
    })
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add a new address
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const body = await req.json()
    
    // Validate address data
    const validationResult = addressSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid address data", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    
    const userId = session.user.id
    const updatedUser = await addUserAddress(userId, validationResult.data)
    
    return NextResponse.json({
      message: "Address added successfully",
      addresses: updatedUser?.addresses || []
    }, { status: 201 })
  } catch (error) {
    console.error("Error adding address:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update an address
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const body = await req.json()
    
    // Extract addressId and validate address data
    const { addressId, ...addressData } = body
    
    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }
    
    // Validate the address data
    const validationResult = addressSchema.partial().safeParse(addressData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid address data", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    
    const userId = session.user.id
    const updatedUser = await updateUserAddress(userId, addressId, validationResult.data)
    
    return NextResponse.json({
      message: "Address updated successfully",
      addresses: updatedUser?.addresses || []
    })
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Remove an address
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const addressId = searchParams.get("id")
    
    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }
    
    const userId = session.user.id
    const updatedUser = await deleteUserAddress(userId, addressId)
    
    return NextResponse.json({
      message: "Address deleted successfully",
      addresses: updatedUser?.addresses || []
    })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Set an address as default
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const body = await req.json()
    const { addressId } = body
    
    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }
    
    const userId = session.user.id
    const updatedUser = await setDefaultAddress(userId, addressId)
    
    return NextResponse.json({
      message: "Default address set successfully",
      addresses: updatedUser?.addresses || []
    })
  } catch (error) {
    console.error("Error setting default address:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 