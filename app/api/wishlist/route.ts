import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getUserWishlistItems, addToWishlist } from "@/lib/wishlist"

// Get user's wishlist items
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    const wishlistItems = await getUserWishlistItems(userId)
    
    return NextResponse.json(
      { success: true, wishlistItems },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error fetching wishlist items:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching wishlist items" },
      { status: 500 }
    )
  }
}

// Add item to wishlist
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    const body = await request.json()
    
    // Validate required fields
    const { productId, name, price, image } = body
    
    if (!productId || !name || price === undefined || !image) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Generate slug if not provided
    let { slug } = body
    if (!slug && name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }
    
    // Add to wishlist
    const result = await addToWishlist({
      userId,
      productId,
      name,
      price,
      image,
      slug
    })
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, item: result.item },
        { status: 409 } // Conflict
      )
    }
    
    return NextResponse.json(
      { success: true, message: result.message, item: result.item },
      { status: 201 }
    )
    
  } catch (error) {
    console.error("Error adding item to wishlist:", error)
    return NextResponse.json(
      { success: false, message: "Error adding item to wishlist" },
      { status: 500 }
    )
  }
} 