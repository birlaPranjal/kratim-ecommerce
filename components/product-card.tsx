"use client"

import { useCart } from "@/lib/cart-context"
import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

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

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price)

  return (
    <Card className="overflow-hidden">
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
