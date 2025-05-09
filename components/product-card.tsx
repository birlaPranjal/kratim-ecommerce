"use client"

import { useCart } from "@/lib/cart-context"
// Remove the direct import from lib/products
// import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import WishlistButton from "@/components/wishlist-button"
import { formatPrice } from "@/lib/utils"

// Define Product type locally
interface Product {
  _id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  featured?: boolean
  inventory: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
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
      duration: 3000,
    })
  }

  const formattedPrice = formatPrice(product.price)

  return (
    <Card className="overflow-hidden group relative">
      {/* Wishlist button */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <WishlistButton
          productId={product._id}
          name={product.name}
          price={product.price}
          image={product.images[0] || "/images/product-placeholder.jpg"}
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm hover:bg-white h-8 w-8"
        />
      </div>
      
      <Link href={`/shop/${product._id}`} className="block overflow-hidden relative aspect-square">
        <Image
          src={product.images[0] || "/images/product-placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform hover:scale-105 duration-300"
        />
      </Link>
      <CardContent className="p-4">
        <Link href={`/shop/${product._id}`} className="hover:underline">
          <h3 className="font-medium">{product.name}</h3>
        </Link>
        <p className="text-amber-600 font-medium mt-1">{formattedPrice}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-amber-600 hover:bg-amber-700"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
