"use client"

import { useState, useEffect } from "react"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"
import { WishlistItem } from "@/lib/wishlist"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Loader2, ShoppingCart, Trash } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

export default function WishlistPage() {
  const { user } = useAuth()
  const { wishlist, isLoading, removeFromWishlist } = useWishlist()
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({})

  const handleRemoveItem = async (wishlistId: string) => {
    setIsRemoving(prev => ({ ...prev, [wishlistId]: true }))
    
    try {
      await removeFromWishlist(wishlistId)
    } finally {
      setIsRemoving(prev => ({ ...prev, [wishlistId]: false }))
    }
  }
  
  if (!user) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">Products you've saved for later</p>
        </div>
        
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground stroke-[1.5px]" />
            <h3 className="mt-6 text-xl font-medium">Please sign in to view your wishlist</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              You need to be logged in to save and view your wishlist items.
            </p>
            <Link href="/api/auth/signin">
              <Button className="mt-6 bg-[#1d503a] hover:bg-[#1d503a]/90 text-white">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground mt-1">Products you've saved for later</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#1d503a]" />
        </div>
      ) : wishlist.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground stroke-[1.5px]" />
            <h3 className="mt-6 text-xl font-medium">Your wishlist is empty</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Browse our products and click the heart icon to save items to your wishlist for later.
            </p>
            <Link href="/shop">
              <Button className="mt-6 bg-[#1d503a] hover:bg-[#1d503a]/90 text-white">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <WishlistItemCard 
              key={item._id} 
              item={item} 
              isRemoving={isRemoving[item._id] || false}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function WishlistItemCard({ 
  item, 
  isRemoving, 
  onRemove 
}: { 
  item: WishlistItem
  isRemoving: boolean
  onRemove: (id: string) => void
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/shop/${item.productId}`}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
      </div>
      <CardContent className="p-4">
        <Link href={`/shop/${item.productId}`} className="block">
          <h3 className="text-lg font-medium line-clamp-1 mb-1 group-hover:text-[#1d503a] transition-colors">
            {item.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-[#1d503a]">{formatPrice(item.price)}</p>
          <div className="flex gap-2">
            <Link href={`/shop/${item.productId}`}>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">View Product</span>
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onRemove(item._id)}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 