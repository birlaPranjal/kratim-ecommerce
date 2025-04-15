"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Collection {
  id: string
  name: string
  description: string
  image: string
  link: string
}

const collections: Collection[] = [
  {
    id: "rings",
    name: "Engagement Rings",
    description: "Timeless symbols of love and commitment.",
    image: "/images/collection-rings.jpg",
    link: "/collections/rings",
  },
  {
    id: "necklaces",
    name: "Statement Necklaces",
    description: "Bold pieces that elevate any outfit.",
    image: "/images/collection-necklaces.jpg",
    link: "/collections/necklaces",
  },
  {
    id: "earrings",
    name: "Fine Earrings",
    description: "From subtle studs to elegant drops.",
    image: "/images/collection-earrings.jpg",
    link: "/collections/earrings",
  },
]

export default function CollectionShowcase() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-2">Curated Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our thoughtfully designed collections, each with its own unique story and character.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div key={collection.id} className="group relative overflow-hidden rounded-lg">
              <div className="relative h-[400px]">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h3 className="text-xl font-medium mb-2">{collection.name}</h3>
                <p className="mb-4 text-white/80">{collection.description}</p>
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href={collection.link}>Explore Collection</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 