import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-provider"
import { AuthProvider as AuthContextProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Emerald Gold | Luxury Jewelry",
  description: "Discover exquisite craftsmanship and elegant designs.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <AuthContextProvider>
            <CartProvider>
              <ThemeProvider 
                attribute="class" 
                defaultTheme="light" 
                enableSystem={false} 
                disableTransitionOnChange
              >
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1 px-4 sm:px-6 lg:px-8 mx-auto w-full">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster />
              </ThemeProvider>
            </CartProvider>
          </AuthContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}