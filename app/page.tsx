import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getFeaturedProducts } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { ArrowRight, ArrowRightCircle } from "lucide-react"
import TestimonialSection from "@/components/testimonial-section"
import ContactForm from "@/components/contact-form"
import FeaturesSection from "@/components/features-section"
import CollectionShowcase from "@/components/collection-showcase"
import RotatingBanner from "@/components/rotating-banner"
import { Product } from "@/types"
import { Suspense } from "react"
import Loading from "@/components/ui/loading"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  // Banner images array
  const bannerImages = [
    {
      src: "/banner/Kratim Banner.png",
      alt: "Kratim Luxury Jewelry Collection"
    },
    {
      src: "/banner/Kratim Banner 1.png",
      alt: "Elegant Jewelry Designs by Kratim"
    },
    {
      src: "/banner/Kratim Grid.png",
      alt: "Kratim Fine Jewelry Showcase"
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Static Banners Section with no bottom margin */}
      <section className="w-full">
        {/* Desktop Banner - only visible on md screens and up */}
        <div className="hidden md:block w-full">
          <div className="w-full">
            <div className="relative overflow-hidden">
              <Image 
                src="/banner/banner-laptop.png"
                alt="Kratim Jewelry Desktop Banner"
                width={1920}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Banners - only visible on small screens */}
        <div className="md:hidden w-full">
          <div className="w-full">
            {/* First Mobile Banner */}
            <div className="relative overflow-hidden">
              <Image 
                src="/banner/banner-mobile.jpg"
                alt="Kratim Jewelry Mobile Banner 1"
                width={768}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tagline Section - reduced padding */}
      <section className="w-full bg-[#faf5ee] py-4 sm:py-5 text-center">
        <div className="container px-4 mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#1d503a] font-bold font-astragon" style={{ letterSpacing: '0.02em' }}>
            Bold. Timeless. Unapologetically You.
          </h2>
        </div>
      </section>

      {/* Collection Showcase - directly follows tagline with no gap */}
      <Suspense fallback={<Loading text="Loading collections..." />}>
        <CollectionShowcase />
      </Suspense>

      {/* Featured Products - reduced top padding */}
      <section className="py-8 sm:py-10 lg:py-12 bg-[#faf5ee]">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-astragon font-bold mb-3 text-[#1d503a]">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg font-gilroy">
              Each piece is carefully designed and crafted to create a timeless statement of elegance
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shimmer h-[260px] sm:h-[320px]" />
              ))}
            </div>}>
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Suspense>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <Button asChild className="bg-[#1d503a] hover:bg-[#1d503a]/90 text-white px-6 py-2 sm:px-8 sm:py-6 text-sm sm:text-lg rounded-full">
              <Link href="/shop" className="flex items-center gap-2 font-gilroy">
                View All Products <ArrowRight size={16} className="sm:w-5 sm:h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Craftsmanship Section - optimized spacing */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div>
              <h3 className="text-xs sm:text-sm uppercase tracking-wider text-[#5e7d77] mb-2 font-astragon">OUR STORY</h3>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-astragon font-bold mb-4 text-[#1d503a]">
                The Art of Craftsmanship & Elegance
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base lg:text-lg font-gilroy">
                For over thirty years, we have been creating exquisite jewelry pieces that celebrate the beauty of
                precious metals and gemstones. Our artisans combine traditional techniques with contemporary design to
                create pieces that are truly timeless.
              </p>
              <p className="text-gray-600 mb-6 text-sm sm:text-base lg:text-lg font-gilroy">
                We stand for timeless art with contemporary designs, transforming every piece into a masterpiece.
                Experience the journey from inspiration to perfection, where craftsmanship meets elegance.
              </p>
              <Button asChild className="bg-[#1d503a] hover:bg-[#1d503a]/90 text-white px-6 py-2 sm:px-8 sm:py-6 text-sm sm:text-lg rounded-full font-gilroy">
                <Link href="/about">Discover More</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-6 lg:mt-0">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/banner/Kratim Banner.png"
                  alt="Jewelry Craftsmanship"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover h-full w-full transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg mt-4 sm:mt-8">
                <Image
                  src="/banner/Kratim Banner 1.png"
                  alt="Jewelry Detail"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover h-full w-full transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/banner/Kratim Grid.png"
                  alt="Jewelry Making"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover h-full w-full transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg mt-4 sm:mt-8">
                <Image
                  src="/banner/Kratim Banner.png"
                  alt="Finished Jewelry"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover h-full w-full transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jewellery Care Section - optimized spacing and better mobile layout */}
      <section className="py-8 sm:py-12 lg:py-16 bg-[#faf5ee]">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-astragon font-bold mb-3 text-[#1d503a]">
              Jewellery Care Guide
            </h2>
            <p className="text-[#1d503a] max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-gilroy">
              Essential tips to keep your precious pieces sparkling for generations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Store Properly */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#5e7d77]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <span className="text-xl sm:text-2xl">💎</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1d503a] font-astragon">Store Properly</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-[#1d503a]/80 font-gilroy text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Keep pieces separate to avoid scratches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Use soft-lined boxes or pouches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Store in dry places with silica gel</span>
                </li>
              </ul>
            </div>

            {/* Wear with Care */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#5e7d77]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <span className="text-xl sm:text-2xl">✨</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1d503a] font-astragon">Wear with Care</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-[#1d503a]/80 font-gilroy text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Apply cosmetics before wearing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Remove during swimming/exercising</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Avoid during household chores</span>
                </li>
              </ul>
            </div>

            {/* Clean Regularly */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#5e7d77]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <span className="text-xl sm:text-2xl">🛁</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1d503a] font-astragon">Clean Regularly</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-[#1d503a]/80 font-gilroy text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Use soft brush and mild soap</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Pat dry with soft cloth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Professional cleaning yearly</span>
                </li>
              </ul>
            </div>

            {/* Avoid Chemicals */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#5e7d77]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <span className="text-xl sm:text-2xl">🚫</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1d503a] font-astragon">Avoid Chemicals</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-[#1d503a]/80 font-gilroy text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>No bleach or acids</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Keep away from chlorine</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Use soft cloth for polishing</span>
                </li>
              </ul>
            </div>

            {/* Check for Damage */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#5e7d77]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <span className="text-xl sm:text-2xl">🔍</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1d503a] font-astragon">Check for Damage</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-[#1d503a]/80 font-gilroy text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Inspect for loose stones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Check clasps and prongs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Get professional repairs</span>
                </li>
              </ul>
            </div>

            {/* Additional Tips */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#5e7d77]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <span className="text-xl sm:text-2xl">💡</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1d503a] font-astragon">Quick Tips</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-[#1d503a]/80 font-gilroy text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Store in airtight containers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
                  <span>Clean after each wear</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5e7d77] mr-2">•</span>
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
