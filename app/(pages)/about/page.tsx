import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hammer, Users, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-6">About Kratim</h1>
            <p className="text-gray-600 mb-4">
              At Kratim, we bring India's rich artistic heritage to life through handcrafted jewelry that tells a story. 
              Inspired by traditional craftsmanship from every corner of India, we focus on tribal jewelry and bold, 
              statement earrings—pieces that don't just adorn but empower.
            </p>
            <p className="text-gray-600 mb-4">
              Our designs celebrate the fearless, confident woman who knows that jewelry isn't just an accessory; 
              it's a statement of beauty, strength, and individuality.
            </p>
            <p className="text-gray-600">
              Jewelry has been an integral part of Indian culture for centuries, symbolizing tradition, status, and artistry. 
              From the intricate silverwork of Rajasthan to the vibrant tribal jewelry of Odisha and Nagaland, every region 
              has its own unique style.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/images/01.jpg" alt="Kratim jewelry collection" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="mb-16 bg-gray-50 p-12 rounded-lg">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hammer className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Traditional Craftsmanship</h3>
            <p className="text-gray-600">
              We honor India's rich jewelry-making traditions, preserving centuries-old techniques while adding a 
              contemporary touch.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Empowerment</h3>
            <p className="text-gray-600">
              Our jewelry is designed to empower women, helping them express their unique style and confidence 
              through bold, statement pieces.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Cultural Heritage</h3>
            <p className="text-gray-600">
              We celebrate India's diverse cultural heritage through our designs, bringing traditional artistry 
              to modern women.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Our Founder's Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image src="/images/pallavi.jpg" alt="Kratim founder" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-serif font-bold mb-4">Pallavi Shrivastava's Vision</h3>
            <p className="text-gray-600 mb-4">
              For Pallavi Shrivastava, the founder of Kratim, jewelry has been a lifelong passion. Since childhood, 
              she was drawn to bold, heavy earrings—pieces that stood out and made a statement. She would spend hours 
              admiring and discussing designs with shopkeepers, fascinated by the materials, craftsmanship, and the 
              artistry behind each piece.
            </p>
            <p className="text-gray-600 mb-4">
              Her love for bold, statement earrings never faded. Over the years, this passion grew into a vision—to 
              create a brand that celebrates the power of bold jewelry and makes it accessible to women who love to 
              stand out.
            </p>
            <p className="text-gray-600 mb-6">
              Kratim was born from this dream, blending traditional Indian artistry with modern confidence, creating 
              pieces that tell stories and empower women to express their unique style.
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
