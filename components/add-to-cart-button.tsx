"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

interface AddToCartButtonProps {
  product: {
    _id: string
    name: string
    price: number
    images: string[]
    inventory: number
  }
  variant?: "default" | "outline" | "secondary"
  className?: string
}

export function AddToCartButton({ product, variant = "default", className }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    if (product.inventory <= 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)

    setTimeout(() => {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      })

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })

      setIsAdding(false)
    }, 500)
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleAddToCart}
      disabled={isAdding || product.inventory <= 0}
    >
      {isAdding ? (
        "Adding..."
      ) : product.inventory <= 0 ? (
        "Out of Stock"
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
