"use client"

import WishlistButton from "@/components/wishlist-button"

interface WishlistButtonWrapperProps {
  productId: string
  name: string
  price: number
  image: string
  className?: string
}

export default function WishlistButtonWrapper({
  productId,
  name,
  price,
  image,
  className
}: WishlistButtonWrapperProps) {
  return (
    <WishlistButton
      productId={productId}
      name={name}
      price={price}
      image={image}
      variant="outline"
      size="icon"
      className={className || "h-12 w-12"}
    />
  )
} 