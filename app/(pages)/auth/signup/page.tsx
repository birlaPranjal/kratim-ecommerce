"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import Image from "next/image"

function BrandSection() {
  return (
    <div className="flex flex-col items-center h-full p-6 fade-in">
      <Image src="/logo.png" alt="Kratim Jewel Logo" width={200} height={150} className="mb-4" priority />
      <h2 className="text-2xl font-astragon text-[#1d503a] mb-2 tracking-wide">Kratim Jewel</h2>
      <p className="text-base text-gray-700 mb-4 text-center max-w-xs">Timeless Luxury Jewelry.<br />Indulge in exquisite craftsmanship and elegant designs.</p>
      <ul className="text-sm text-[#5e7d77] space-y-1 text-left">
        <li>✦ Free shipping on all orders</li>
        <li>✦ 24/7 customer support</li>
        <li>✦ Secure checkout</li>
      </ul>
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to register")
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. You can now log in.",
      })
      
      // Automatically sign in after successful registration
      await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      
      router.push("/")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex py-5 items-center justify-center bg-[#faf5ee] px-2 fade-in">
      <div className="flex flex-col md:flex-row w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-[#e6e2db] bg-white">
        <div className="hidden md:flex md:w-1/2 bg-[#f3f7f5] items-center justify-center">
          <BrandSection />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center md:hidden">
              <BrandSection />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[#1d503a] font-astragon">Create an Account</h1>
              <p className="mt-2 text-sm text-gray-600">Sign up to get started</p>
            </div>
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 