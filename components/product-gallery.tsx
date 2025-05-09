"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative w-[400px] h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No image available
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="relative w-[400px] h-[400px] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={images[selectedImage] || "/images/product-placeholder.jpg"}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
          sizes="400px"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative w-[90px] h-[90px] overflow-hidden rounded-md ${
                selectedImage === index ? "ring-2 ring-amber-600" : "ring-1 ring-gray-200"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="90px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 