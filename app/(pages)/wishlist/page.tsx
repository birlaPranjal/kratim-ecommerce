"use client"

import { useState } from "react"
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
      <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-astragon text-[#1d503a] mb-3">My Wishlist</h1>
          <p className="text-gray-600">Save your favorite items for later</p>
        </div>
        
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground stroke-[1.5px]" />
            <h3 className="mt-6 text-xl font-astragon font-medium">Please sign in to view your wishlist</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              You need to be logged in to save and view your wishlist items.
            </p>
            <Link href="/auth/signin">
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
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-astragon text-[#1d503a] mb-3">My Wishlist</h1>
        <p className="text-gray-600">Items you've saved for later</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#1d503a]" />
        </div>
      ) : wishlist.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground stroke-[1.5px]" />
            <h3 className="mt-6 text-xl font-medium font-astragon">Your wishlist is empty</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Browse our products and click the heart icon to save items to your wishlist for later.
            </p>
            <div className="mt-6 text-sm text-gray-500 max-w-md mx-auto">
              <h4 className="font-medium text-gray-600 mb-2">How to use wishlist:</h4>
              <ul className="text-left list-disc pl-5 space-y-1">
                <li>Hover over a product to see the heart icon</li>
                <li>Click the heart to save items to your wishlist</li>
                <li>Visit this page to view all your saved items</li>
                <li>Click the trash icon to remove items from your wishlist</li>
              </ul>
            </div>
            <Link href="/shop">
              <Button className="mt-6 bg-[#1d503a] hover:bg-[#1d503a]/90 text-white">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        <Button 
          size="sm" 
          variant="outline"
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-600 hover:bg-white"
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
      <CardContent className="p-4">
        <Link href={`/shop/${item.productId}`} className="block">
          <h3 className="text-lg font-medium line-clamp-1 mb-1 group-hover:text-[#1d503a] transition-colors font-astragon">
            {item.name}
          </h3>
          <p className="font-semibold text-[#1d503a] mb-3">{formatPrice(item.price)}</p>
        </Link>
        <div className="flex justify-between items-center">
          <Button 
            size="sm" 
            variant="default"
            className="w-full bg-[#1d503a] hover:bg-[#1d503a]/90 text-white"
            asChild
          >
            <Link href={`/shop/${item.productId}`}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Product
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 