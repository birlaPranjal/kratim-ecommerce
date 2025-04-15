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

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image src="/images/hero-jewelry.jpg" alt="Luxury Jewelry" fill className="object-cover" priority />
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Timeless Luxury Jewelry</h1>
          <p className="text-lg mb-8 max-w-2xl">Discover craftsmanship and elegant designs.</p>
          <div className="flex gap-4">
            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="/collections">Explore Collections</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Collection Showcase */}
      <CollectionShowcase />

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-2">Explore Our Finest Pieces</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each piece is carefully designed and crafted to create a timeless statement of elegance and
              sophistication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/shop" className="flex items-center gap-2">
                View All Products <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Craftsmanship Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-2">OUR STORY</h3>
              <h2 className="text-3xl font-serif font-bold mb-6">The Art of Craftsmanship & Elegance</h2>
              <p className="text-gray-600 mb-6">
                For over thirty years, we have been creating exquisite jewelry pieces that celebrate the beauty of
                precious metals and gemstones. Our artisans combine traditional techniques with contemporary design to
                create pieces that are truly timeless.
              </p>
              <p className="text-gray-600 mb-8">
                We stand for timeless art with contemporary designs, transforming every piece into a masterpiece.
                Experience the journey from inspiration to perfection, where craftsmanship meets elegance.
              </p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/about">Discover More</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/images/craftsmanship-1.jpg"
                alt="Jewelry Craftsmanship"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full"
              />
              <Image
                src="/images/craftsmanship-2.jpg"
                alt="Jewelry Detail"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full mt-8"
              />
              <Image
                src="/images/craftsmanship-3.jpg"
                alt="Jewelry Making"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full"
              />
              <Image
                src="/images/craftsmanship-4.jpg"
                alt="Finished Jewelry"
                width={300}
                height={300}
                className="rounded-lg object-cover h-full mt-8"
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
