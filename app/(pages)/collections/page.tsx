import { getCollections } from "@/lib/collections"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default async function CollectionsPage() {
  const collections = await getCollections() as Collection[]

  return (
    <main className="bg-[#faf5ee]">
      <div className="container px-4 mx-auto py-8 sm:py-10 lg:py-12">
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-astragon font-bold mb-2 sm:mb-3 text-[#1d503a]">
            Our Collections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-gilroy">
            Explore our uniquely curated jewelry collections, each telling its own story of elegance and craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {collections.map((collection) => (
            <div 
              key={collection._id} 
              className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-[#5e7d77]/10 hover:border-[#5e7d77]/30"
            >
              <div className="aspect-[4/5] w-full overflow-hidden rounded-t-lg">
                <Image
                  src={collection.image || "/placeholder.jpg"}
                  alt={collection.name}
                  width={500}
                  height={600}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 lg:p-6">
                <h3 className="text-lg sm:text-xl font-bold font-astragon text-white">{collection.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-white/90 font-gilroy line-clamp-2">{collection.description || "Explore our curated collection"}</p>
                <Button 
                  asChild 
                  className="mt-3 sm:mt-4 bg-[#1d503a] hover:bg-[#1d503a]/90 text-white rounded-full w-fit"
                  size="sm"
                >
                  <Link href={`/collections/${collection.slug}`} className="flex items-center gap-2 font-gilroy text-xs sm:text-sm">
                    View Collection <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">
          <Button asChild className="bg-[#1d503a] hover:bg-[#1d503a]/90 text-white px-6 py-2 sm:px-8 sm:py-6 text-sm sm:text-lg rounded-full">
            <Link href="/shop" className="flex items-center gap-2 font-gilroy">
              Browse All Jewelry <ArrowRight size={16} className="sm:w-5 sm:h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
