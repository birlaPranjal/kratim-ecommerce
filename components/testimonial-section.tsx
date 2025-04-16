"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Testimonial {
  id: number
  name: string
  title: string
  image: string
  quote: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophia Mitchell",
    title: "Regular Customer",
    image: "https://placehold.co/1920x1080/gold/white?text=testimonial-1",
    quote: "The craftsmanship is remarkable. Every piece I've purchased has been an investment in timeless beauty that I'll cherish for years to come.",
    rating: 5,
  },
  {
    id: 2,
    name: "James Wilson",
    title: "Watch Collector",
    image: "https://placehold.co/1920x1080/gold/white?text=testimonial-2",
    quote: "The attention to detail and quality of materials used in their pieces is outstanding. Their customer service is equally impressive.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Thompson",
    title: "Interior Designer",
    image: "https://placehold.co/1920x1080/gold/white?text=testimonial-3",
    quote: "I've recommended Emerald Gold to numerous clients. Their jewelry pieces add the perfect finishing touch to any space or outfit.",
    rating: 5,
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover why our clients choose Emerald Gold for their most precious moments.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white p-8 md:p-12 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 relative rounded-full overflow-hidden">
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex mb-2">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{currentTestimonial.quote}"</p>
                <div>
                  <p className="font-medium">{currentTestimonial.name}</p>
                  <p className="text-gray-500 text-sm">{currentTestimonial.title}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              <Button
                onClick={prevTestimonial}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
              {testimonials.map((_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className={`h-2 w-2 rounded-full p-0 ${
                    i === currentIndex ? "bg-amber-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(i)}
                >
                  <span className="sr-only">Testimonial {i + 1}</span>
                </Button>
              ))}
              <Button
                onClick={nextTestimonial}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 