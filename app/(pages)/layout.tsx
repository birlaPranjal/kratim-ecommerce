import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1 w-full">
                    {children}
                  </main>
                  <Footer />
                </div>
  )
}