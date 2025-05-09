"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Loader2 } from "lucide-react"
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

function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      })
      
      if (result?.error) {
        toast({
          title: "Authentication failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      toast({
        title: "Google Authentication Error",
        description: "Failed to authenticate with Google. The provider might not be configured correctly.",
        variant: "destructive",
      })
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
              <h1 className="text-3xl font-bold tracking-tight text-[#1d503a] font-astragon">Welcome Back</h1>
              <p className="text-sm text-gray-600">Sign in to your account</p>
            </div>
            
            <form onSubmit={handleCredentialsLogin} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Signing in..." : "Sign in with Email"}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div>
              <Button
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleGoogleLogin}
                type="button"
              >
                <Icons.google className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </div>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account?{" "}</span>
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
} 