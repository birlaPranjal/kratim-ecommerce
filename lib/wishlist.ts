import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface WishlistItem {
  _id: string
  productId: string
  userId: string
  name: string
  price: number
  image: string
  slug?: string
  addedAt: Date
}

export async function getUserWishlistItems(userId: string) {
  if (!userId) return []
  
  try {
    const { db } = await connectToDatabase()
    
    const wishlistItems = await db
      .collection("wishlist")
      .find({ userId })
      .sort({ addedAt: -1 })
      .toArray()
    
    return JSON.parse(JSON.stringify(wishlistItems))
  } catch (error) {
    console.error("Error in getUserWishlistItems:", error)
    return []
  }
}

export async function addToWishlist(wishlistItem: Omit<WishlistItem, "_id" | "addedAt">) {
  try {
    const { db } = await connectToDatabase()
    
    // Check if item already exists in wishlist
    const existingItem = await db.collection("wishlist").findOne({
      userId: wishlistItem.userId,
      productId: wishlistItem.productId
    })
    
    if (existingItem) {
      return { 
        success: false, 
        message: "Item already in wishlist",
        item: JSON.parse(JSON.stringify(existingItem))
      }
    }
    
    const now = new Date()
    const newWishlistItem = {
      ...wishlistItem,
      addedAt: now
    }
    
    const result = await db.collection("wishlist").insertOne(newWishlistItem)
    
    return {
      success: true,
      message: "Item added to wishlist",
      item: {
        ...newWishlistItem,
        _id: result.insertedId.toString()
      }
    }
  } catch (error) {
    console.error("Error in addToWishlist:", error)
    throw error
  }
}

export async function removeFromWishlist(wishlistId: string) {
  if (!wishlistId) return { success: false, message: "No wishlist item ID provided" }
  
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection("wishlist").deleteOne({
      _id: new ObjectId(wishlistId)
    })
    
    if (result.deletedCount === 0) {
      return { 
        success: false, 
        message: "Wishlist item not found" 
      }
    }
    
    return { 
      success: true, 
      message: "Item removed from wishlist" 
    }
  } catch (error) {
    console.error("Error in removeFromWishlist:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}

export async function removeProductFromWishlist(userId: string, productId: string) {
  if (!userId || !productId) {
    return { 
      success: false, 
      message: "User ID and product ID are required" 
    }
  }
  
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection("wishlist").deleteOne({
      userId,
      productId
    })
    
    if (result.deletedCount === 0) {
      return { 
        success: false, 
        message: "Wishlist item not found" 
      }
    }
    
    return { 
      success: true, 
      message: "Item removed from wishlist" 
    }
  } catch (error) {
    console.error("Error in removeProductFromWishlist:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}

export async function getWishlistItem(userId: string, productId: string) {
  if (!userId || !productId) return null
  
  try {
    const { db } = await connectToDatabase()
    
    const wishlistItem = await db.collection("wishlist").findOne({
      userId,
      productId
    })
    
    return wishlistItem ? JSON.parse(JSON.stringify(wishlistItem)) : null
  } catch (error) {
    console.error("Error in getWishlistItem:", error)
    return null
  }
} 