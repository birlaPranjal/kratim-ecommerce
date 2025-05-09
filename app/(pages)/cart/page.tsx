"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const router = useRouter()

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const shipping = subtotal > 0 ? 500 : 0 // ₹500 shipping fee
  const total = subtotal + shipping

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="rounded-lg border">
            <div className="p-6">
              <div className="hidden md:grid md:grid-cols-6 text-sm font-medium text-gray-500 mb-4">
                <div className="md:col-span-3">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>

              <Separator className="mb-6" />

              {cart.map((item) => (
                <div key={item._id} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="md:hidden text-sm text-gray-500 mr-2">Price:</span>
                      {formatCurrency(item.price)}
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="md:hidden text-sm text-gray-500 mr-2">Quantity:</span>
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end">
                      <span className="md:hidden text-sm text-gray-500 mr-2">Total:</span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {cart.indexOf(item) < cart.length - 1 && <Separator className="my-6" />}
                </div>
              ))}

              <Separator className="my-6" />

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </Button>

                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link href="/shop">
                    <ShoppingBag size={16} />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6 sticky top-24">
            <h2 className="text-xl font-serif font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" disabled={!couponCode}>Apply</Button>
              </div>

              <Button 
                onClick={handleCheckout} 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 flex items-center justify-center gap-2"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
