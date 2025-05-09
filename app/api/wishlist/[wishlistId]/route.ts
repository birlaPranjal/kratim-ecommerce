import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { removeFromWishlist } from "@/lib/wishlist"

// Delete an item from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { wishlistId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const { wishlistId } = params
    
    if (!wishlistId) {
      return NextResponse.json(
        { success: false, message: "Wishlist item ID is required" },
        { status: 400 }
      )
    }
    
    const result = await removeFromWishlist(wishlistId)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: result.message },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error removing item from wishlist:", error)
    return NextResponse.json(
      { success: false, message: "Error removing item from wishlist" },
      { status: 500 }
    )
  }
} 