"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Loader2, User, Mail, Edit, Save, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface ProfileData {
  name: string
  email: string
  image?: string
}

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

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    image: "",
  })
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Fetch user profile and addresses
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }
    
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch profile data
        const profileResponse = await fetch("/api/user/profile")
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile data")
        }
        const profileData = await profileResponse.json()
        
        setProfileData({
          name: profileData.name || "",
          email: profileData.email || "",
          image: profileData.image || "",
        })
        
        // Fetch addresses
        const addressesResponse = await fetch("/api/user/addresses")
        if (addressesResponse.ok) {
          const addressesData = await addressesResponse.json()
          setAddresses(addressesData.addresses || [])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user, router, toast])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update profile")
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const getDefaultAddress = () => {
    return addresses.find(address => address.isDefault) || addresses[0]
  }
  
  const userInitials = profileData.name
    ? profileData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"
  
  if (!user) {
    return null
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account details</p>
      </div>
      
      <div className="grid gap-8">
        {/* Profile Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account information
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={profileData.image || ""} alt={profileData.name} />
                  <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
                </Avatar>
                {/* Image upload feature can be added here in the future */}
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="name">Full Name</Label>
                  </div>
                  {isEditing ? (
                    <Input 
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div className="p-2 bg-muted/40 rounded-md">{profileData.name}</div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email">Email Address</Label>
                  </div>
                  {/* Email is read-only */}
                  <div className="p-2 bg-muted/40 rounded-md">{profileData.email}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Addresses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Addresses</CardTitle>
              <CardDescription>
                Manage your shipping and billing addresses
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              asChild
            >
              <Link href="/account/addresses">
                <MapPin className="h-4 w-4 mr-2" />
                Manage Addresses
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {addresses.length === 0 ? (
              <div className="text-center py-6 border rounded-lg bg-muted/10">
                <MapPin className="h-10 w-10 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No addresses found</h3>
                <p className="text-muted-foreground mt-2">
                  You haven't added any addresses yet.
                </p>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                  <Link href="/account/addresses">
                    Add Address
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Default Address</h3>
                <div className="border rounded-md p-4">
                  {(() => {
                    const defaultAddress = getDefaultAddress()
                    if (!defaultAddress) return null
                    
                    return (
                      <>
                        <p className="font-medium">{defaultAddress.name}</p>
                        <div className="text-sm text-muted-foreground mt-1 space-y-1">
                          <p>{defaultAddress.address}</p>
                          <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}</p>
                          <p>{defaultAddress.country}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                
                <div className="text-center mt-4">
                  <Link href="/account/addresses">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      View all addresses ({addresses.length})
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 