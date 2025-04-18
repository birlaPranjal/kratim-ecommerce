 "use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"

interface StoreSettings {
  name: string
  email: string
  phone: string
  address: string
  currency: string
  taxRate: number
  shippingFee: number
  freeShippingThreshold: number
  orderEmailNotifications: boolean
  maintenanceMode: boolean
  aboutText: string
  returnPolicy: string
  privacyPolicy: string
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState("general")
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [settings, setSettings] = useState<StoreSettings>({
    name: "Jewelry Kratim",
    email: "contact@jewelrykratim.com",
    phone: "+1 (555) 123-4567",
    address: "123 Jewelry Lane, New York, NY 10001",
    currency: "USD",
    taxRate: 7.5,
    shippingFee: 5.99,
    freeShippingThreshold: 75,
    orderEmailNotifications: true,
    maintenanceMode: false,
    aboutText: "Welcome to Jewelry Kratim, your destination for exquisite handcrafted jewelry...",
    returnPolicy: "Our return policy allows returns within 30 days of purchase...",
    privacyPolicy: "At Jewelry Kratim, we take your privacy seriously..."
  })
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/settings")
      return
    }
    
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/")
        return
      }
      
      // In a real application, you would fetch settings from an API
      // For now, we'll simulate loading
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }, [status, session, router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings({
      ...settings,
      [name]: value
    })
  }
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings({
      ...settings,
      [name]: parseFloat(value) || 0
    })
  }
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked
    })
  }
  
  const handleSaveSettings = async () => {
    setSaveLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Settings saved",
      description: "Your store settings have been updated successfully.",
    })
    
    setSaveLoading(false)
  }
  
  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Store Settings</h1>
        
        <Button 
          onClick={handleSaveSettings} 
          disabled={saveLoading}
        >
          {saveLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Taxes</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="policies">Legal Policies</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={settings.name}
                    onChange={handleInputChange}
                    placeholder="Your Store Name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="address">Store Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State, ZIP"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    placeholder="USD"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter currency code (e.g., USD, EUR, GBP)
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="aboutText">About Store</Label>
                  <Textarea
                    id="aboutText"
                    name="aboutText"
                    value={settings.aboutText}
                    onChange={handleInputChange}
                    placeholder="Tell customers about your store..."
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Taxes</CardTitle>
              <CardDescription>Configure shipping fees and tax rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="shippingFee">Standard Shipping Fee ($)</Label>
                  <Input
                    id="shippingFee"
                    name="shippingFee"
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.shippingFee}
                    onChange={handleNumberInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                  <Input
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.freeShippingThreshold}
                    onChange={handleNumberInputChange}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Orders above this amount qualify for free shipping (0 to disable)
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={settings.taxRate}
                    onChange={handleNumberInputChange}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Default tax rate applied to orders (can be overridden by location)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="orderEmailNotifications" className="text-base">
                    Order Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications when new orders are placed
                  </p>
                </div>
                <Switch
                  id="orderEmailNotifications"
                  checked={settings.orderEmailNotifications}
                  onCheckedChange={(checked) => 
                    handleSwitchChange("orderEmailNotifications", checked)
                  }
                />
              </div>
              
              <Separator />
              
              {/* Additional notification settings could be added here */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Legal Policies</CardTitle>
              <CardDescription>Manage your store's legal policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="returnPolicy">Return Policy</Label>
                <Textarea
                  id="returnPolicy"
                  name="returnPolicy"
                  value={settings.returnPolicy}
                  onChange={handleInputChange}
                  placeholder="Enter your return policy details..."
                  rows={5}
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                <Textarea
                  id="privacyPolicy"
                  name="privacyPolicy"
                  value={settings.privacyPolicy}
                  onChange={handleInputChange}
                  placeholder="Enter your privacy policy details..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Settings</CardTitle>
              <CardDescription>Configure store maintenance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-base">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, your store will display a maintenance message to visitors
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => 
                    handleSwitchChange("maintenanceMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}