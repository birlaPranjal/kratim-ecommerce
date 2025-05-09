import { getProductById, getRelatedProducts } from "@/lib/products"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/add-to-cart-button"
import ProductGallery from "@/components/product-gallery"
import RelatedProducts from "@/components/related-products"
import { formatCurrency } from "@/lib/utils"
import { Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Gallery */}
            <div className="lg:sticky lg:top-24 flex items-center md:pl-[10vw] justify-center">
              <div className="w-[90vw] max-w-[400px] lg:max-w-none lg:w-full">
                <ProductGallery images={product.images} productName={product.name} />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">{product.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {product.collectionName && (
                      <Badge variant="secondary" className="text-sm">
                        {product.collectionName}
                      </Badge>
                    )}
                    {product.inventory > 0 ? (
                      <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                    ) : (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-amber-600">{formatCurrency(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="text-lg text-gray-500 line-through">{formatCurrency(product.compareAtPrice)}</span>
                  )}
                </div>

                

                <Separator />

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Features</h3>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {product.features.map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="mt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        
                      

                        {product.collectionName && (
                          <>
                            <div className="text-gray-500">Collection</div>
                            <div>{product.collectionName}</div>
                          </>
                        )}

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
                    </TabsContent>
                    <TabsContent value="shipping" className="mt-4">
                      <div className="space-y-4 text-sm text-gray-600">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">India Shipping</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Free shipping on all orders</li>
                            <li>Cash on Delivery (COD) available with Rs. 100 fee</li>
                            <li>Delivery within 6-7 business days</li>
                            <li>Orders dispatched within 24-48 hours</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">International Shipping</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>FedEx Express: 7-8 business days</li>
                            <li>Economy Service: 10-15 business days</li>
                            <li>International shipping charges vary by country</li>
                            <li>Customs duty and taxes to be borne by customer</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Returns & Exchanges</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Products are not returnable once purchased</li>
                            <li>Exchanges only for defective or damaged items</li>
                            <li>Must report issues within 48 hours of delivery</li>
                            <li>Parcel opening video required for claims</li>
                          </ul>
                        </div>

                        <div className="pt-2">
                          <p className="text-amber-600">For support: +91 9009770175 or Kratim.support@gmail.com</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <AddToCartButton product={product} className="flex-1" />
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 max-w-7xl mx-auto">
          <RelatedProducts 
            category={product.category}
            currentProductId={product._id}
            products={relatedProducts}
          />
        </div>
      </div>
    </div>
  )
}
