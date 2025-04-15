"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ImagePlus, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ImageUploadProps {
  images?: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images = [], onChange, maxImages = 5 }: ImageUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast({
        title: `Maximum ${maxImages} images allowed`,
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const newImages = [...images]

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await response.json()
        newImages.push(data.secure_url)
      }

      onChange(newImages)

      toast({
        title: "Images uploaded",
        description: "Your images have been uploaded successfully.",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
            <Image src={image || "/placeholder.svg"} alt={`Product image ${index + 1}`} fill className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => handleRemoveImage(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="relative aspect-square rounded-md border border-dashed flex flex-col items-center justify-center">
            <Input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6 mb-2 text-gray-400" />
                <span className="text-sm text-gray-500">Upload Image</span>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">Upload up to {maxImages} images. PNG, JPG, or WEBP. Max 5MB each.</p>
    </div>
  )
}
