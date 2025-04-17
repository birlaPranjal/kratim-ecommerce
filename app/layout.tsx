import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-provider"
import { AuthProvider as AuthContextProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Kratim | Timeless Luxury Jewelry",
  description: "Indulge in exquisite craftsmanship and elegant designs. Luxury jewelry collections made with finest materials.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" 
        />
      </head>
      <body>
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
                  <main className="flex-1 w-full">
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