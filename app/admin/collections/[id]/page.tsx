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
import { Switch } from "@/components/ui/switch"
import ImageUpload from "@/components/admin/image-upload"
import { slugify } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export default function EditCollectionPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    featured: false,
  })

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/collections/${id}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch collection")
        }
        
        const data = await response.json()
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          image: data.image || "",
          featured: data.featured || false,
        })
      } catch (error) {
        console.error("Error fetching collection:", error)
        toast({
          title: "Error",
          description: "Failed to load collection data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollection()
  }, [id, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Auto-generate slug from name only if it's a new collection or if slug was not modified yet
    if (name === "name" && (formData.slug === "" || formData.slug === slugify(formData.name))) {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        slug: slugify(value)
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  const handleImageChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, image: images[0] || "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image) {
      toast({
        title: "Image required",
        description: "Please upload a collection image.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/collections/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update collection")
      }

      toast({
        title: "Collection updated",
        description: "The collection has been updated successfully.",
      })

      router.push("/admin/collections")
    } catch (error) {
      console.error("Error updating collection:", error)
      toast({
        title: "Error",
        description: "There was an error updating the collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-500">Loading collection data...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Collection</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Collection Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input 
                      id="slug" 
                      name="slug" 
                      value={formData.slug} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <p className="text-sm text-gray-500">
                      URL-friendly version of the name. Auto-generated but can be edited.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="featured">Featured collection</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Collection Image *</Label>
                    <ImageUpload 
                      images={formData.image ? [formData.image] : []} 
                      onChange={handleImageChange}
                      maxImages={1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/admin/collections")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-red-600">Danger Zone</h3>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      // Implement delete functionality or modal confirmation
                      if (confirm("Are you sure you want to delete this collection? This action cannot be undone.")) {
                        // Handle delete
                        fetch(`/api/collections/${id}`, {
                          method: "DELETE",
                        })
                        .then(response => {
                          if (response.ok) {
                            toast({
                              title: "Collection deleted",
                              description: "The collection has been deleted successfully.",
                            })
                            router.push("/admin/collections")
                          } else {
                            throw new Error("Failed to delete collection")
                          }
                        })
                        .catch(error => {
                          toast({
                            title: "Error",
                            description: "Failed to delete collection. Please try again.",
                            variant: "destructive",
                          })
                        })
                      }
                    }}
                  >
                    Delete Collection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
} 