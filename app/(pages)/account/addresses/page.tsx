"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin, PlusCircle, Star, StarIcon, Trash, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { z } from "zod"

// Define the Address type
interface Address {
  _id: string
  name: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

// Form validation schema
const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
})

export default function AddressesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Fetch addresses
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }
    
    const fetchAddresses = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/user/addresses")
        
        if (response.ok) {
          const data = await response.json()
          setAddresses(data.addresses || [])
        } else {
          throw new Error("Failed to fetch addresses")
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
        toast({
          title: "Error",
          description: "Failed to load addresses. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchAddresses()
  }, [user, router, toast])
  
  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    })
    setFormErrors({})
    setCurrentAddressId(null)
    setIsEditing(false)
  }
  
  const handleOpenModal = () => {
    resetForm()
    setIsModalOpen(true)
  }
  
  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    })
    setCurrentAddressId(address._id)
    setIsEditing(true)
    setIsModalOpen(true)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const validateForm = () => {
    try {
      addressSchema.parse(formData)
      setFormErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setFormErrors(newErrors)
      }
      return false
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      let response
      
      if (isEditing && currentAddressId) {
        // Update existing address
        response = await fetch("/api/user/addresses", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressId: currentAddressId,
            ...formData,
          }),
        })
      } else {
        // Create new address
        response = await fetch("/api/user/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            isDefault: addresses.length === 0, // Make the first address default
          }),
        })
      }
      
      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update address" : "Failed to add address")
      }
      
      const data = await response.json()
      setAddresses(data.addresses)
      
      toast({
        title: isEditing ? "Address updated" : "Address added",
        description: isEditing 
          ? "Your address has been updated successfully" 
          : "Your address has been added successfully",
      })
      
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: isEditing
          ? "Failed to update address. Please try again."
          : "Failed to add address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch("/api/user/addresses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addressId }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to set default address")
      }
      
      const data = await response.json()
      setAddresses(data.addresses)
      
      toast({
        title: "Default address updated",
        description: "Your default address has been updated successfully",
      })
    } catch (error) {
      console.error("Error setting default address:", error)
      toast({
        title: "Error",
        description: "Failed to set default address. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return
    }
    
    try {
      const response = await fetch(`/api/user/addresses?id=${addressId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete address")
      }
      
      const data = await response.json()
      setAddresses(data.addresses)
      
      toast({
        title: "Address deleted",
        description: "Your address has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  if (!user) {
    return null
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading addresses...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <p className="text-muted-foreground mt-1">Manage your shipping and billing addresses</p>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button onClick={handleOpenModal} className="bg-primary hover:bg-primary/90">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>
      
      {addresses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No addresses found</h3>
            <p className="text-muted-foreground mt-2">
              You haven't added any addresses yet. Add an address to make checkout faster.
            </p>
            <Button onClick={handleOpenModal} className="mt-6 bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address._id} className={`relative overflow-hidden ${address.isDefault ? 'border-primary' : ''}`}>
              {address.isDefault && (
                <div className="absolute top-0 right-0 bg-primary text-white py-1 px-3 text-xs">
                  Default
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{address.name}</h3>
                </div>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                </div>
                
                <div className="flex justify-between mt-6">
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                  
                  {!address.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(address._id)}
                    >
                      <Star className="h-3.5 w-3.5 mr-1" />
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add/Edit Address Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update your address details below"
                : "Enter your address details below"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter your full name"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs">{formErrors.name}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Street Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Enter your street address"
                  className={formErrors.address ? "border-red-500" : ""}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-xs">{formErrors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="City"
                    className={formErrors.city ? "border-red-500" : ""}
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs">{formErrors.city}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    placeholder="State/Province"
                    className={formErrors.state ? "border-red-500" : ""}
                  />
                  {formErrors.state && (
                    <p className="text-red-500 text-xs">{formErrors.state}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input 
                    id="postalCode" 
                    name="postalCode" 
                    value={formData.postalCode} 
                    onChange={handleInputChange} 
                    placeholder="Postal Code"
                    className={formErrors.postalCode ? "border-red-500" : ""}
                  />
                  {formErrors.postalCode && (
                    <p className="text-red-500 text-xs">{formErrors.postalCode}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                    placeholder="Country"
                    className={formErrors.country ? "border-red-500" : ""}
                  />
                  {formErrors.country && (
                    <p className="text-red-500 text-xs">{formErrors.country}</p>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  isEditing ? "Update Address" : "Save Address"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 