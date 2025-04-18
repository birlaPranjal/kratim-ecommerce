import { getCategories } from "@/lib/categories"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">Product Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category._id} className="group relative overflow-hidden rounded-lg">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={500}
                height={600}
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-xl font-serif font-bold text-white">{category.name}</h3>
              {category.description && (
                <p className="mt-1 text-sm text-white/80">{category.description}</p>
              )}
              <Button asChild className="mt-4 bg-amber-600 hover:bg-amber-700 w-fit">
                <Link href={`/categories/${category.slug}`}>View Category</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 