"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { user } = useAuth()
  const [wishlistItems] = useState<any[]>([]) // Will be populated with real data later
  
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground mt-1">Products you've saved for later</p>
      </div>
      
      {wishlistItems.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground stroke-[1.5px]" />
            <h3 className="mt-6 text-xl font-medium">Your wishlist is empty</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Browse our products and click the heart icon to save items to your wishlist for later.
            </p>
            <Link href="/shop">
              <Button className="mt-6 bg-primary hover:bg-primary/90">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Wishlist items will be mapped here */}
        </div>
      )}
    </div>
  )
} 