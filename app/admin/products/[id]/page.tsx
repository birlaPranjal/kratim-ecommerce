"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import Link from "next/link"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection?: string;
  inventory: number;
  material?: string;
  dimensions?: string;
  featured: boolean;
  images: string[];
  features: string[];
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = params

  const [categories, setCategories] = useState<Array<{_id: string, name: string}>>([])
  const [collections, setCollections] = useState<Array<{_id: string, name: string}>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageError, setImageError] = useState(false)

  const [formData, setFormData] = useState<Product>({
    _id: "",
    name: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    category: "",
    collection: "",
    inventory: 0,
    material: "",
    dimensions: "",
    featured: false,
    images: [],
    features: [""],
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [productRes, categoriesRes, collectionsRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch('/api/categories'),
          fetch('/api/collections')
        ])
        
        if (!productRes.ok) {
          throw new Error("Failed to fetch product data")
        }
        
        if (categoriesRes.ok && collectionsRes.ok) {
          const [productData, categoriesData, collectionsData] = await Promise.all([
            productRes.json(),
            categoriesRes.json(),
            collectionsRes.json()
          ])
          
          setFormData({
            ...productData,
            compareAtPrice: productData.compareAtPrice || 0,
            material: productData.material || "",
            dimensions: productData.dimensions || "",
            features: productData.features?.length > 0 ? productData.features : [""],
            inventory: typeof productData.inventory === 'number' ? productData.inventory : 
                       typeof productData.stock === 'number' ? productData.stock : 0
          })
          
          setCategories(categoriesData)
          setCollections(collectionsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load product data.",
          variant: "destructive",
        })
        router.push("/admin/products")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [toast, router, id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === "" ? 0 : Number(value)
    setFormData((prev) => ({ ...prev, [name]: numValue }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, images }))
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one product image.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const productData = {
        ...formData,
        features: formData.features.filter((feature) => feature.trim() !== ""),
        compareAtPrice: formData.compareAtPrice === 0 ? undefined : formData.compareAtPrice,
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update product");
      }

      toast({
        title: "Success",
        description: "Product updated successfully.",
      })
      
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete product")
      }
      
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      })
      
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <span className="ml-2">Loading product...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-2" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    rows={5}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={formData.price} 
                      onChange={handleNumberInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="compareAtPrice">Compare At Price ($)</Label>
                    <Input 
                      id="compareAtPrice" 
                      name="compareAtPrice" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={formData.compareAtPrice} 
                      onChange={handleNumberInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="inventory">Inventory</Label>
                  <Input 
                    id="inventory" 
                    name="inventory" 
                    type="number" 
                    min="0" 
                    step="1" 
                    value={formData.inventory} 
                    onChange={handleNumberInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="collection">Collection</Label>
                  <Select 
                    value={formData.collection || ""} 
                    onValueChange={(value) => handleSelectChange("collection", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {collections.map((collection) => (
                        <SelectItem key={collection._id} value={collection._id}>{collection.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">Upload product images (recommended size: 800x800px)</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group aspect-square border rounded-md overflow-hidden">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={handleImageError}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images];
                        newImages.splice(index, 1);
                        handleImagesChange(newImages);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <ImageUpload 
                onChange={handleImagesChange}
                value={formData.images}
                multiple={true}
                maxImages={10}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="material">Material</Label>
                <Input 
                  id="material" 
                  name="material" 
                  value={formData.material} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input 
                  id="dimensions" 
                  name="dimensions" 
                  value={formData.dimensions} 
                  onChange={handleInputChange}
                  placeholder="e.g. 10cm x 5cm x 2cm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured" 
                  checked={formData.featured} 
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Product Features</h2>
              <Button type="button" variant="outline" onClick={addFeature}>
                Add Feature
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={feature} 
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFeature(index)}
                    disabled={formData.features.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" type="button" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product 
                  from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={isDeleting !== null}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 