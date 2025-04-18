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
import { Trash2, ArrowLeft, Loader2 } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import Link from "next/link"
import Image from "next/image"
import { slugify } from "@/lib/utils"
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [autoUpdateSlug, setAutoUpdateSlug] = useState(true)

  const [formData, setFormData] = useState<Category>({
    _id: "",
    name: "",
    slug: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/categories/${id}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch category data")
        }
        
        const categoryData = await response.json()
        
        setFormData({
          ...categoryData,
          description: categoryData.description || "",
          image: categoryData.image || "",
        })
        
        // If category already exists, don't auto-update slug
        setAutoUpdateSlug(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load category data.",
          variant: "destructive",
        })
        router.push("/admin/categories")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategory()
  }, [toast, router, id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === "name" && autoUpdateSlug) {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        slug: slugify(value)
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // When user manually edits slug, stop auto-updating
    setAutoUpdateSlug(false)
    handleInputChange(e)
  }
  
  const handleImageChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, image: images[0] || "" }))
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a category name.",
        variant: "destructive",
      })
      return
    }

    if (!formData.slug.trim()) {
      toast({
        title: "Slug required",
        description: "Please enter a category slug.",
        variant: "destructive",
      })
      return
    }

    if (!formData.image) {
      toast({
        title: "Image required",
        description: "Please upload a category image.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare the data by removing the _id field to avoid MongoDB errors
      const submissionData = { ...formData };
      delete submissionData._id;
      delete submissionData.createdAt;
      delete submissionData.updatedAt;

      console.log("Submitting category data:", JSON.stringify(submissionData, null, 2));

      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      // Get the response content regardless of success/error
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(responseData.error || `Error ${response.status}: Failed to update category`);
      }

      toast({
        title: "Success",
        description: "Category updated successfully.",
      })
      
      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete category")
      }
      
      toast({
        title: "Success",
        description: "Category deleted successfully.",
      })
      
      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category.",
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
        <span className="ml-2">Loading category...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-2" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    value={formData.slug} 
                    onChange={handleSlugChange}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name. Used in URLs.
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Category Image</Label>
                  
                  {formData.image && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4 border">
                      <Image
                        src={formData.image}
                        alt={formData.name}
                        fill
                        className="object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  
                  <ImageUpload 
                    onChange={handleImageChange}
                    value={formData.image ? [formData.image] : []}
                    multiple={false}
                    maxImages={1}
                  />
                </div>

                <div className="pt-4">
                  <Label>Category Preview</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                    <div className="flex flex-col items-center">
                      <div className="relative h-32 w-32 overflow-hidden rounded-md mb-2">
                        <Image
                          src={formData.image || "/placeholder.svg"}
                          alt={formData.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <h3 className="font-medium text-lg">{formData.name || "Category Name"}</h3>
                      {formData.description && (
                        <p className="text-sm text-gray-500 text-center mt-1 line-clamp-2">{formData.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Category
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the category 
                  and it may affect products that are assigned to this category.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={isDeleting}
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