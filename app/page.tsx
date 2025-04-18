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
      <section className="relative h-[400px] sm:h-[450px] lg:h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 z-10" />
        <Image 
          src="/banner/Kratim Banner.png" 
          alt="Kratim Luxury Jewelry" 
          fill 
          className="h-[550px]" 
          priority 
        />
      </section>

      {/* Tagline Section */}
      <section className="w-full bg-white py-10 sm:py-12 lg:py-14 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1d503a] font-bold" style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.02em' }}>
            Kratim – Bold. Timeless. Unapologetically You.
          </h2>
        </div>
      </section>

      {/* Collection Showcase */}
      <CollectionShowcase />

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 text-[#1d503a]">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Each piece is carefully designed and crafted to create a timeless statement of elegance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-[#1d503a] hover:bg-[#1d503a]/90 text-white px-8 py-6 text-lg">
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
              <h3 className="text-sm uppercase tracking-wider text-[#c8a25d] mb-2">OUR STORY</h3>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 text-[#1d503a]">
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
              <Button asChild className="bg-[#1d503a] hover:bg-[#1d503a]/90 text-white px-8 py-6 text-lg">
                <Link href="/about">Discover More</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Image
                src="/banner/Kratim Banner.png"
                alt="Jewelry Craftsmanship"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full"
              />
              <Image
                src="/banner/Kratim Banner 1.png"
                alt="Jewelry Detail"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full mt-8"
              />
              <Image
                src="/banner/Kratim Grid.png"
                alt="Jewelry Making"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full"
              />
              <Image
                src="/banner/Kratim Banner.png"
                alt="Finished Jewelry"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full w-full mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Jewellery Care Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-amber-50">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 text-amber-900">
              Jewellery Care Guide
            </h2>
            <p className="text-amber-800 max-w-2xl mx-auto text-lg">
              Essential tips to keep your precious pieces sparkling for generations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Store Properly */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Store Properly</h3>
              </div>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Keep pieces separate to avoid scratches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Use soft-lined boxes or pouches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Store in dry places with silica gel</span>
                </li>
              </ul>
            </div>

            {/* Wear with Care */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Wear with Care</h3>
              </div>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Apply cosmetics before wearing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Remove during swimming/exercising</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Avoid during household chores</span>
                </li>
              </ul>
            </div>

            {/* Clean Regularly */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">🛁</span>
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Clean Regularly</h3>
              </div>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Use soft brush and mild soap</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Pat dry with soft cloth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Professional cleaning yearly</span>
                </li>
              </ul>
            </div>

            {/* Avoid Chemicals */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">🚫</span>
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Avoid Chemicals</h3>
              </div>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>No bleach or acids</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Keep away from chlorine</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Use soft cloth for polishing</span>
                </li>
              </ul>
            </div>

            {/* Check for Damage */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Check for Damage</h3>
              </div>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Inspect for loose stones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Check clasps and prongs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Get professional repairs</span>
                </li>
              </ul>
            </div>

            {/* Additional Tips */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-amber-900">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Store in airtight containers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Clean after each wear</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Regular professional checks</span>
                </li>
              </ul>
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
