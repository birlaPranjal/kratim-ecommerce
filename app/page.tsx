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
      {/* Hero Section with Rotating Banner */}
      <section className="relative h-[300px] sm:h-[450px] lg:h-[550px] w-full overflow-hidden mobile-reduced-height">
        <RotatingBanner images={bannerImages} interval={3000} />
        
      </section>

      {/* Tagline Section */}
      <section className="w-full bg-[#faf5ee] py-10 sm:py-12 lg:py-14 text-center fade-in">
        <div className="section-container">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#1d503a] font-bold font-astragon" style={{ letterSpacing: '0.02em' }}>
            Bold. Timeless. Unapologetically You.
          </h2>
        </div>
      </section>

      {/* Collection Showcase */}
      <Suspense fallback={<Loading text="Loading collections..." />}>
        <CollectionShowcase />
      </Suspense>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#faf5ee]">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-astragon font-bold mb-4 text-[#1d503a]">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-gilroy">
              Each piece is carefully designed and crafted to create a timeless statement of elegance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shimmer h-[320px]" />
              ))}
            </div>}>
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Suspense>
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-[#1d503a] hover:bg-[#1d503a]/90 text-white px-8 py-6 text-lg rounded-full">
              <Link href="/shop" className="flex items-center gap-2 font-gilroy">
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
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-[#5e7d77] mb-2 font-astragon">OUR STORY</h3>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-astragon font-bold mb-6 text-[#1d503a]">
                The Art of Craftsmanship & Elegance
              </h2>
              <p className="text-gray-600 mb-6 text-lg font-gilroy">
                For over thirty years, we have been creating exquisite jewelry pieces that celebrate the beauty of
                precious metals and gemstones. Our artisans combine traditional techniques with contemporary design to
                create pieces that are truly timeless.
              </p>
              <p className="text-gray-600 mb-8 text-lg font-gilroy">
                We stand for timeless art with contemporary designs, transforming every piece into a masterpiece.
                Experience the journey from inspiration to perfection, where craftsmanship meets elegance.
              </p>
              <Button asChild className="bg-[#1d503a] hover:bg-[#1d503a]/90 text-white px-8 py-6 text-lg rounded-full font-gilroy">
                <Link href="/about">Discover More</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/banner/Kratim Banner.png"
                  alt="Jewelry Craftsmanship"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover h-full w-full transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg mt-8">
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
              <div className="overflow-hidden rounded-lg mt-8">
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

      {/* Jewellery Care Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[#faf5ee]">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-astragon font-bold mb-4 text-[#1d503a]">
              Jewellery Care Guide
            </h2>
            <p className="text-[#1d503a] max-w-2xl mx-auto text-lg font-gilroy">
              Essential tips to keep your precious pieces sparkling for generations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Store Properly */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-6">
                <div className="bg-[#5e7d77]/10 p-3 rounded-full mr-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1d503a] font-astragon">Store Properly</h3>
              </div>
              <ul className="space-y-3 text-[#1d503a]/80 font-gilroy">
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
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-6">
                <div className="bg-[#5e7d77]/10 p-3 rounded-full mr-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1d503a] font-astragon">Wear with Care</h3>
              </div>
              <ul className="space-y-3 text-[#1d503a]/80 font-gilroy">
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
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-6">
                <div className="bg-[#5e7d77]/10 p-3 rounded-full mr-4">
                  <span className="text-2xl">🛁</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1d503a] font-astragon">Clean Regularly</h3>
              </div>
              <ul className="space-y-3 text-[#1d503a]/80 font-gilroy">
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
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-6">
                <div className="bg-[#5e7d77]/10 p-3 rounded-full mr-4">
                  <span className="text-2xl">🚫</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1d503a] font-astragon">Avoid Chemicals</h3>
              </div>
              <ul className="space-y-3 text-[#1d503a]/80 font-gilroy">
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
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-6">
                <div className="bg-[#5e7d77]/10 p-3 rounded-full mr-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1d503a] font-astragon">Check for Damage</h3>
              </div>
              <ul className="space-y-3 text-[#1d503a]/80 font-gilroy">
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
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#5e7d77]/10 hover:border-[#5e7d77]/30">
              <div className="flex items-center mb-6">
                <div className="bg-[#5e7d77]/10 p-3 rounded-full mr-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1d503a] font-astragon">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-[#1d503a]/80 font-gilroy">
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
