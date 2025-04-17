"use client"

import { Package, RefreshCw, Shield, Truck } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Free Worldwide Shipping",
    description: "On all orders over $150. Fast delivery to your doorstep.",
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "30-Day Returns",
    description: "Not satisfied? Return within 30 days for a full refund.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Lifetime Warranty",
    description: "All our jewelry comes with a lifetime warranty against defects.",
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Elegant Gift Packaging",
    description: "Each piece comes beautifully wrapped in premium packaging.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 font-serif">{feature.title}</h3>
              <p className="text-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 