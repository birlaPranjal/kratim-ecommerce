"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  name: string
  price: number
  image: string
  slug?: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function WishlistButton({
  productId,
  name,
  price,
  image,
  slug,
  className,
  variant = "outline",
  size = "icon"
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeProductFromWishlist } = useWishlist()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const isItemInWishlist = isInWishlist(productId)
  
  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      if (isItemInWishlist) {
        await removeProductFromWishlist(productId)
      } else {
        await addToWishlist({
          productId,
          name,
          price,
          image,
          slug
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "group",
        isItemInWishlist && "text-red-500 hover:text-red-600 hover:bg-red-50",
        className
      )}
      disabled={isLoading}
      onClick={handleToggleWishlist}
    >
      <Heart 
        className={cn(
          "h-5 w-5",
          isItemInWishlist ? "fill-current" : "fill-none",
          isLoading && "animate-pulse"
        )} 
      />
      <span className="sr-only">
        {isItemInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </span>
    </Button>
  )
} 