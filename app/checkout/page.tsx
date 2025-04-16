"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { loadRazorpay } from "@/lib/razorpay-client"
import { useAuth } from "@/lib/auth-context"
import { Address } from "@/lib/users"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Loader2, Plus, MapPin, Info } from "lucide-react"

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "razorpay",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const shipping = subtotal > 0 ? 500 : 0 // ₹500 shipping fee
  const total = subtotal + shipping

  useEffect(() => {
    if (user) {
      fetchUserAddresses()
    }
  }, [user])

  // Redirect to login if no user is authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with checkout",
        variant: "destructive",
      })
      router.push("/auth/signin?redirect=/checkout")
    }
  }, [user, router, toast])

  // When a user selects a saved address, populate the form
  useEffect(() => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(addr => addr._id === selectedAddressId)
      if (selectedAddress) {
        // Split the name into first and last name (best effort)
        const nameParts = selectedAddress.name.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        }))
      }
    }
  }, [selectedAddressId, addresses])

  const fetchUserAddresses = async () => {
    try {
      setIsLoadingAddresses(true)
      const response = await fetch("/api/user/addresses")
      
      if (!response.ok) {
        throw new Error("Failed to fetch addresses")
      }
      
      const data = await response.json()
      setAddresses(data.addresses || [])
      
      // If there's a default address, select it
      const defaultAddress = data.addresses?.find((addr: Address) => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id as string)
      } else if (data.addresses?.length > 0) {
        setSelectedAddressId(data.addresses[0]._id as string)
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with checkout",
        variant: "destructive",
      })
      router.push("/auth/signin?redirect=/checkout")
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Create order through API
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            variant: item.variant || null,
          })),
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          subtotal,
          shipping,
          total,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          status: "pending",
          userId: user.id, // Ensure we link the order to the user
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const order = await orderResponse.json()

      if (formData.paymentMethod === "razorpay") {
        // Initialize Razorpay payment
        await handleRazorpayPayment(order)
      } else {
        // Cash on delivery
        toast({
          title: "Order placed successfully!",
          description: "Your order has been placed and will be delivered soon.",
        })
        clearCart()
        router.push(`/order-confirmation/${order._id}`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRazorpayPayment = async (order: any) => {
    try {
      // Load Razorpay script
      await loadRazorpay();
      console.log("Razorpay script loaded successfully");

      // First, check order structure
      console.log("Order structure to process:", {
        id: order._id,
        totalAmount: order.totalAmount || order.total || 'not available',
        hasItems: Array.isArray(order.items) && order.items.length > 0
      });

      // Fetch the Razorpay key from the API
      console.log("Fetching Razorpay key...");
      const keyResponse = await fetch("/api/payments/key");
      
      if (!keyResponse.ok) {
        const errorData = await keyResponse.json();
        console.error("Failed to fetch Razorpay key:", keyResponse.status, errorData);
        throw new Error(`Failed to fetch Razorpay key: ${keyResponse.status} ${keyResponse.statusText}`);
      }
      
      const keyData = await keyResponse.json();
      console.log("Received key response:", keyData.key ? "Key available" : "No key in response");

      if (!keyData.key) {
        // Try getting debug info
        try {
          const debugResponse = await fetch("/api/payments/debug");
          const debugData = await debugResponse.json();
          console.error("Debug data for missing key:", debugData);
        } catch (e) {
          console.error("Could not fetch debug data:", e);
        }
        throw new Error("Razorpay key not available");
      }

      console.log("Creating Razorpay order...");
      
      // Create a Razorpay order for the payment
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order._id }),
      });

      // Log response status
      console.log(`Order creation response status: ${orderResponse.status} ${orderResponse.statusText}`);
      
      // Try to get the response body whether it's an error or success
      let responseBody;
      try {
        responseBody = await orderResponse.json();
        console.log("Order creation response body:", responseBody);
      } catch (parseError) {
        console.error("Could not parse response body:", parseError);
      }
      
      if (!orderResponse.ok) {
        // Generate a clear error message
        let errorMessage = `Failed to create payment order (Status: ${orderResponse.status})`;
        if (responseBody && responseBody.error) {
          errorMessage += `: ${responseBody.error}`;
        }
        throw new Error(errorMessage);
      }

      // If we didn't get a body earlier, try again
      if (!responseBody) {
        responseBody = await orderResponse.json();
      }

      // Validate that we have required fields
      if (!responseBody.orderId || !responseBody.amount) {
        console.error("Invalid payment order response:", responseBody);
        throw new Error("Invalid payment order response from server");
      }

      console.log("Payment order created successfully:", {
        orderId: responseBody.orderId,
        amount: responseBody.amount,
        currency: responseBody.currency
      });

      const options = {
        key: keyData.key,
        amount: responseBody.amount, // Use the amount from the Razorpay order
        currency: responseBody.currency || "INR",
        name: "Emerald Gold",
        description: `Order #${order._id.toString().substring(0, 8).toUpperCase()}`,
        order_id: responseBody.orderId,
        handler: async (response: any) => {
          console.log("Razorpay payment callback received:", response);
          
          try {
            // Verify payment on the server
            console.log("Verifying payment...");
            const result = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order._id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            console.log(`Payment verification response: ${result.status} ${result.statusText}`);
            
            if (!result.ok) {
              const errorText = await result.text().catch(() => "Could not read error details");
              console.error(`Payment verification failed: ${result.status}, Error: ${errorText}`);
              throw new Error(`Server returned ${result.status}: ${errorText}`);
            }

            const data = await result.json();
            console.log("Payment verification result:", data);

            if (data.success) {
              toast({
                title: "Payment successful!",
                description: "Your order has been placed and will be delivered soon.",
              });
              clearCart();
              // Redirect to order confirmation page
              router.push(`/order-confirmation/${order._id}`);
            } else {
              console.error("Payment verification error:", data);
              toast({
                title: "Payment verification failed",
                description: data.error || "There was an error verifying your payment. Please contact support.",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error("Payment handler error:", error);
            toast({
              title: "Payment verification failed",
              description: "There was an error processing your payment. Please check your order status in your account or contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}`,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Create a new Razorpay instance and open the checkout
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      toast({
        title: "Payment initiation failed",
        description: "There was an error starting the payment process. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  // If no user, show loading or redirect
  if (!user) {
    return (
      <div className="container max-w-6xl py-12">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Redirecting to login...</span>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container max-w-6xl py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Checkout form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-card p-6 rounded-md shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              {user && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Saved Addresses</h3>
                  
                  {isLoadingAddresses ? (
                    <div className="flex items-center justify-center h-20">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      <RadioGroup
                        value={selectedAddressId || ""}
                        onValueChange={(value) => setSelectedAddressId(value)}
                        className="space-y-3"
                      >
                        {addresses.map((address) => (
                          <div key={address._id} className="border rounded-md p-3 flex items-start space-x-3">
                            <RadioGroupItem value={address._id as string} id={`address-${address._id}`} className="mt-1" />
                            <Label
                              htmlFor={`address-${address._id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="font-medium">{address.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {address.address}, {address.city}, {address.state} {address.postalCode}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {address.country}
                              </div>
                              {address.isDefault && (
                                <div className="text-sm font-medium text-primary mt-1">Default Address</div>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <div className="flex items-center space-x-2">
                        <Separator className="flex-1" />
                        <span className="text-sm text-muted-foreground">Or</span>
                        <Separator className="flex-1" />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Enter a new shipping address</p>
                        <Link href="/account/addresses">
                          <Button type="button" variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Manage Addresses
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        You don't have any saved addresses
                      </p>
                      <Link href="/account/addresses">
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Address
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* Personal information */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    readOnly={!!user?.email}
                    className={user?.email ? "bg-muted" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Special instructions for your order"
                  className="h-20 resize-none"
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-card p-6 rounded-md shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
                className="space-y-3"
              >
                <div className="border rounded-md p-3 flex items-start space-x-3">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                    <div className="font-medium">
                      Pay with Card/UPI (Razorpay)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pay securely with credit/debit card or UPI
                    </div>
                  </Label>
                </div>
                
                <div className="border rounded-md p-3 flex items-start space-x-3">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Pay when you receive your order
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                `Place Order - ${formatCurrency(total)}`
              )}
            </Button>
          </form>
        </div>

        {/* Right column - Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-md shadow-sm border sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-4">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col text-sm">
                    <div className="flex justify-between font-medium text-foreground">
                      <h3>{item.name}</h3>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <div className="text-muted-foreground mt-0.5">
                      Qty: {item.quantity}
                    </div>
                    {item.variant && (
                      <div className="text-muted-foreground">
                        {item.variant}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-2" />
              <p>Taxes included. Shipping calculated at checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
