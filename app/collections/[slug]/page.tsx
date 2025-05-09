import { notFound } from "next/navigation";
import { getCollectionBySlug, getProductsByCollection } from "@/lib/collections";
import ProductGrid from "@/components/product-grid";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Types for edge runtime (params is a Promise)
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return {
      title: "Collection Not Found | Kratim Jewelry",
    };
  }
  try {
    const collection = await getCollectionBySlug(slug);
    if (!collection) {
      return {
        title: "Collection Not Found | Kratim Jewelry",
      };
    }
    return {
      title: `${collection.name} | Kratim Jewelry`,
      description: collection.description || `Explore our ${collection.name} collection of fine jewelry.`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Jewelry Collection | Kratim Jewelry",
    };
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  try {
    const collection = await getCollectionBySlug(slug);
    if (!collection) {
      notFound();
    }
    const products = await getProductsByCollection(slug);
    return (
      <main className="bg-[#faf5ee]">
        <div className="container px-4 mx-auto py-8 sm:py-10 lg:py-12">
          <div className="flex justify-start mb-6">
            <Button 
              asChild 
              variant="ghost" 
              className="text-[#1d503a] hover:text-[#1d503a]/80 hover:bg-[#1d503a]/5 -ml-2"
              size="sm"
            >
              <Link href="/collections" className="flex items-center gap-1 text-xs sm:text-sm font-gilroy">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> Back to Collections
              </Link>
            </Button>
          </div>
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-astragon font-bold mb-2 sm:mb-3 text-[#1d503a]">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-gilroy">
                {collection.description}
              </p>
            )}
          </div>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-[#5e7d77]/10">
              <h2 className="text-lg sm:text-xl font-astragon font-medium mb-2 text-[#1d503a]">No products found</h2>
              <p className="text-gray-500 font-gilroy text-sm sm:text-base max-w-md mx-auto">
                We're currently updating this collection. Please check back soon for new arrivals.
              </p>
              <Button asChild className="mt-6 bg-[#1d503a] hover:bg-[#1d503a]/90 text-white rounded-full">
                <Link href="/shop">Browse Other Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error in collection page:", error);
    notFound();
  }
} 