import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getFeaturedProducts } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { ArrowRight } from "lucide-react"
import TestimonialSection from "@/components/testimonial-section"
import ContactForm from "@/components/contact-form"
import FeaturesSection from "@/components/features-section"
import CollectionShowcase from "@/components/collection-showcase"
import { Product } from "@/types"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image 
          src="https://placehold.co/1920x1080/gold/white?text=Luxury+Jewelry" 
          alt="Luxury Jewelry" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 max-w-4xl">
            Timeless Luxury Jewelry
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl text-gray-100">
            Discover craftsmanship and elegant designs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
              <Link href="/collections">Explore Collections</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 px-8 py-6 text-lg">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Collection Showcase */}
      <CollectionShowcase />

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
              Explore Our Finest Pieces
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Each piece is carefully designed and crafted to create a timeless statement of elegance and
              sophistication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-amber-600 hover:bg-amber-700 px-8 py-6 text-lg">
              <Link href="/shop" className="flex items-center gap-2">
                View All Products <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Craftsmanship Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-2">OUR STORY</h3>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
                The Art of Craftsmanship & Elegance
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                For over thirty years, we have been creating exquisite jewelry pieces that celebrate the beauty of
                precious metals and gemstones. Our artisans combine traditional techniques with contemporary design to
                create pieces that are truly timeless.
              </p>
              <p className="text-gray-600 mb-8 text-lg">
                We stand for timeless art with contemporary designs, transforming every piece into a masterpiece.
                Experience the journey from inspiration to perfection, where craftsmanship meets elegance.
              </p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700 px-8 py-6 text-lg">
                <Link href="/about">Discover More</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Image
                src="https://placehold.co/600x600/gold/white?text=Craftsmanship+1"
                alt="Jewelry Craftsmanship"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full"
              />
              <Image
                src="https://placehold.co/600x600/gold/white?text=Craftsmanship+2"
                alt="Jewelry Detail"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full mt-8"
              />
              <Image
                src="https://placehold.co/600x600/gold/white?text=Craftsmanship+3"
                alt="Jewelry Making"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full"
              />
              <Image
                src="https://placehold.co/600x600/gold/white?text=Craftsmanship+4"
                alt="Finished Jewelry"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Contact Form */}
      <ContactForm />
    </div>
  )
}
