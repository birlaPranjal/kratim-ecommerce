import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-6">Our Story</h1>
            <p className="text-gray-600 mb-4">
              Founded in 1990, Emerald Gold has been creating exquisite jewelry that celebrates the beauty of precious
              metals and gemstones. What began as a small family workshop has grown into a renowned jewelry brand, while
              maintaining the same dedication to craftsmanship and quality.
            </p>
            <p className="text-gray-600 mb-4">
              Our founder, Elizabeth Gold, started with a vision to create jewelry that would be passed down through
              generations. Today, her children continue her legacy, blending traditional techniques with contemporary
              design.
            </p>
            <p className="text-gray-600">
              Every piece of Emerald Gold jewelry tells a story - of artistry, of heritage, and of the special moments
              in our customers' lives that our creations help commemorate.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/images/about-story.jpg" alt="Our workshop" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="mb-16 bg-gray-50 p-12 rounded-lg">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/images/icon-craftsmanship.svg" alt="Craftsmanship" width={32} height={32} />
            </div>
            <h3 className="text-xl font-medium mb-2">Craftsmanship</h3>
            <p className="text-gray-600">
              We believe in the power of human hands to create beauty. Each piece is meticulously crafted by our skilled
              artisans.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/images/icon-quality.svg" alt="Quality" width={32} height={32} />
            </div>
            <h3 className="text-xl font-medium mb-2">Quality</h3>
            <p className="text-gray-600">
              We use only the finest materials, ethically sourced and carefully selected to ensure lasting beauty and
              value.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/images/icon-sustainability.svg" alt="Sustainability" width={32} height={32} />
            </div>
            <h3 className="text-xl font-medium mb-2">Sustainability</h3>
            <p className="text-gray-600">
              We are committed to responsible practices, from ethical sourcing to minimizing our environmental
              footprint.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Our Artisans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image src="/images/artisans.jpg" alt="Our artisans at work" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-serif font-bold mb-4">Masters of Their Craft</h3>
            <p className="text-gray-600 mb-4">
              Behind every Emerald Gold creation is a team of dedicated artisans who bring decades of experience to
              their craft. Many have trained with us for years, perfecting traditional techniques while embracing
              innovation.
            </p>
            <p className="text-gray-600 mb-4">
              Our workshop is a place where creativity flourishes and skills are constantly refined. Each artisan brings
              their unique perspective and expertise, contributing to the distinctive character of our jewelry.
            </p>
            <p className="text-gray-600 mb-6">
              We take pride in preserving traditional craftsmanship while embracing new technologies that enhance our
              capabilities without compromising on quality or artistic integrity.
            </p>
            <Button asChild className="w-fit bg-amber-600 hover:bg-amber-700">
              <Link href="/collections">Explore Our Collections</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
