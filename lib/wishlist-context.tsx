"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { WishlistItem } from "@/lib/wishlist"

interface WishlistContextType {
  wishlist: WishlistItem[]
  isLoading: boolean
  addToWishlist: (item: Omit<WishlistItem, "_id" | "userId" | "addedAt">) => Promise<boolean>
  removeFromWishlist: (wishlistId: string) => Promise<boolean>
  removeProductFromWishlist: (productId: string) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  getWishlistId: (productId: string) => string | null
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch wishlist items when session changes
  useEffect(() => {
    if (status === "loading") return
    
    if (status === "authenticated" && session?.user) {
      fetchWishlistItems()
    } else {
      setWishlist([])
      setIsLoading(false)
    }
  }, [status, session])

  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/wishlist")
      
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist items")
      }
      
      const data = await response.json()
      setWishlist(data.wishlistItems || [])
    } catch (error) {
      console.error("Error fetching wishlist items:", error)
      toast({
        title: "Error",
        description: "Failed to load your wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (item: Omit<WishlistItem, "_id" | "userId" | "addedAt">) => {
    if (status !== "authenticated") {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add items to your wishlist.",
      })
      return false
    }
    
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        // If item is already in wishlist, this is not an error for the user
        if (response.status === 409) {
          toast({
            title: "Info",
            description: "This item is already in your wishlist.",
          })
          return true
        }
        
        throw new Error(data.message || "Failed to add item to wishlist")
      }
      
      // Update local state
      if (data.item) {
        setWishlist(prev => [...prev, data.item])
      }
      
      toast({
        title: "Success",
        description: "Item added to your wishlist.",
      })
      
      return true
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item to wishlist.",
        variant: "destructive",
      })
      return false
    }
  }

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${wishlistId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to remove item from wishlist")
      }
      
      // Update local state
      setWishlist(prev => prev.filter(item => item._id !== wishlistId))
      
      toast({
        title: "Success",
        description: "Item removed from your wishlist.",
      })
      
      return true
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item from wishlist.",
        variant: "destructive",
      })
      return false
    }
  }

  const removeProductFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist/product/${productId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to remove item from wishlist")
      }
      
      // Update local state
      setWishlist(prev => prev.filter(item => item.productId !== productId))
      
      toast({
        title: "Success",
        description: "Item removed from your wishlist.",
      })
      
      return true
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item from wishlist.",
        variant: "destructive",
      })
      return false
    }
  }

  const isInWishlist = (productId: string): boolean => {
    if (!wishlist || wishlist.length === 0) return false
    return wishlist.some(item => item.productId === productId)
  }

  const getWishlistId = (productId: string): string | null => {
    if (!wishlist || wishlist.length === 0) return null
    const item = wishlist.find(item => item.productId === productId)
    return item ? item._id : null
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        removeProductFromWishlist,
        isInWishlist,
        getWishlistId,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
} 