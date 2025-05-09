import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-provider"
import { AuthProvider as AuthContextProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import localFont from 'next/font/local'

// Import custom fonts locally - using only the available fonts
const coconat = localFont({
  src: [
    {
      path: '../public/fonts/Coconat-Regular.woff2',
      weight: '100',
      style: 'regular',
    }
  ],
  variable: '--font-coconat',
})

const afterglow = localFont({
  src: [
    {
      path: '../public/fonts/Afterglow-Regular.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-afterglow',
})

const gilroy = localFont({
  src: [
    {
      path: '../public/fonts/Gilroy-Medium.woff2',
      weight: '500',
      style: 'normal',
    }
  ],
  variable: '--font-gilroy',
})

const astragon = localFont({
  src: [
    {
      path: '../public/fonts/Astragon-Regular.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-astragon',
})

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
    <html lang="en" suppressHydrationWarning className={`${coconat.variable} ${afterglow.variable} ${gilroy.variable} ${astragon.variable}`}>
      <body className="font-gilroy bg-[#faf5ee]">
        <AuthProvider>
          <AuthContextProvider>
            <CartProvider>
              <WishlistProvider>
                <ThemeProvider 
                  attribute="class" 
                  defaultTheme="light" 
                  enableSystem={false} 
                  disableTransitionOnChange
                >
                  {children}
                  <Toaster />
                </ThemeProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}