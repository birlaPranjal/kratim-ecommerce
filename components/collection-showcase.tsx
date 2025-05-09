"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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
  const [currentPage, setCurrentPage] = useState(0)
  const collectionsPerPage = 4

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
      <section className="py-6 sm:py-8 lg:py-10 bg-[#faf5ee]">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shimmer h-[260px] sm:h-[320px]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (collections.length === 0) {
    return null
  }

  const pageCount = Math.ceil(collections.length / collectionsPerPage)
  const currentCollections = collections.slice(
    currentPage * collectionsPerPage, 
    (currentPage + 1) * collectionsPerPage
  )
  
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pageCount)
  }
  
  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount)
  }

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-[#faf5ee]">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-astragon font-bold mb-2 sm:mb-3 text-[#1d503a]">
            Curated Collections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-gilroy">
            Discover our thoughtfully designed collections, each with its own unique story and character.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {currentCollections.map((collection) => (
            <Card key={collection._id} className="overflow-hidden">
              <Link href={`/collections/${collection.slug}`} className="block overflow-hidden relative aspect-square">
                <Image
                  src={collection.image || "/placeholder.jpg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
              </Link>
              <CardContent className="p-3 sm:p-4">
                <Link href={`/collections/${collection.slug}`} className="hover:underline">
                  <h3 className="font-medium font-astragon text-sm sm:text-base">{collection.name}</h3>
                </Link>
                <p className="text-gray-600 font-gilroy mt-1 text-xs sm:text-sm line-clamp-2">
                  {collection.description || "Explore our curated collection"}
                </p>
              </CardContent>
              <CardFooter className="p-3 sm:p-4 pt-0">
                <Button
                  asChild
                  className="w-full bg-[#1d503a] hover:bg-[#1d503a]/90 text-white"
                  size="sm"
                >
                  <Link href={`/collections/${collection.slug}`} className="flex items-center justify-center gap-1 sm:gap-2 font-gilroy text-xs sm:text-sm">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
              </div>
        
        {collections.length > collectionsPerPage && (
          <div className="mt-4 sm:mt-6 flex justify-center items-center gap-3">
            <button 
              onClick={goToPrevPage}
              className="p-1.5 sm:p-2 rounded-full bg-white text-[#1d503a] hover:bg-[#1d503a] hover:text-white transition-colors duration-300 shadow-sm"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
            </button>
            <div className="flex gap-1.5 sm:gap-2">
              {[...Array(pageCount)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                    i === currentPage 
                      ? 'bg-[#1d503a] scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                ></button>
              ))}
            </div>
            <button 
              onClick={goToNextPage}
              className="p-1.5 sm:p-2 rounded-full bg-white text-[#1d503a] hover:bg-[#1d503a] hover:text-white transition-colors duration-300 shadow-sm"
              aria-label="Next page"
            >
              <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        <div className="mt-6 sm:mt-8 text-center">
          <Button asChild className="bg-[#1d503a] hover:bg-[#1d503a]/90 text-white px-6 py-2 sm:px-8 sm:py-6 text-sm sm:text-lg rounded-full">
            <Link href="/collections" className="flex items-center gap-2 font-gilroy">
              View All Collections <ArrowRight size={16} className="sm:w-5 sm:h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 