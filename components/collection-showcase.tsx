"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function CollectionShowcase() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch('/api/collections')
        if (response.ok) {
          const data = await response.json()
          setCollections(data)
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center">
            <p>Loading collections...</p>
          </div>
        </div>
      </section>
    )
  }

  if (collections.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-2 text-[#1d503a]">Curated Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our thoughtfully designed collections, each with its own unique story and character.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.slice(0, 3).map((collection) => (
            <div key={collection._id} className="group relative overflow-hidden rounded-lg">
              <div className="relative h-[400px]">
                <Image
                  src={collection.image || "/placeholder.jpg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h3 className="text-xl font-serif font-medium mb-2">{collection.name}</h3>
                <p className="mb-4 text-white/80">{collection.description?.substring(0, 60) || "Explore our curated collection"}</p>
                <Button asChild className="bg-[#c8a25d] hover:bg-[#b08d4a] text-white">
                  <Link href={`/collections/${collection.slug}`}>Explore Collection</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 