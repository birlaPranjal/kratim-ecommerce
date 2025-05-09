import { getProductById, getRelatedProducts } from "@/lib/products"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/add-to-cart-button"
import ProductGallery from "@/components/product-gallery"
import RelatedProducts from "@/components/related-products"
import { formatCurrency } from "@/lib/utils"

export default async function ProductPage({
  params,
}: {
  params: { productId: string }
}) {
  const product = await getProductById(params.productId)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product._id)

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductGallery images={product.images} />

        <div className="flex flex-col">
          <h1 className="text-3xl font-serif font-bold">{product.name}</h1>

          <div className="mt-4 flex items-center">
            <span className="text-2xl font-bold text-amber-600">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <span className="ml-2 text-gray-500 line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Features</h3>
              <ul className="list-disc pl-5 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Category</div>
              <div>{product.category}</div>

              {product.material && (
                <>
                  <div className="text-gray-500">Material</div>
                  <div>{product.material}</div>
                </>
              )}

              {product.dimensions && (
                <>
                  <div className="text-gray-500">Dimensions</div>
                  <div>{product.dimensions}</div>
                </>
              )}

              <div className="text-gray-500">In Stock</div>
              <div>{product.inventory > 0 ? "Yes" : "No"}</div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex gap-4">
            <AddToCartButton product={product} />
            <Button variant="outline">Add to Wishlist</Button>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
