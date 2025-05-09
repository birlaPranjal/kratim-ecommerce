"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Grid, 
  Layers,
  Menu,
  X,
  ExternalLink,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle mobile menu close when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: Grid,
    },
    {
      title: "Collections",
      href: "/admin/collections",
      icon: Layers,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Contact Messages",
      href: "/admin/contact",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  // Don't render UI until client-side
  if (!mounted) return null

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-[#1d503a]" />
          ) : (
            <Menu className="h-5 w-5 text-[#1d503a]" />
          )}
        </Button>
      </div>

      {/* Sidebar for desktop and mobile */}
      <div 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 transform border-r bg-white shadow-md transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b px-4">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-[#1d503a]">Kratim Jewels</span>
            <span className="rounded-md bg-[#1d503a]/10 px-2 py-0.5 text-xs font-medium text-[#1d503a]">Admin</span>
          </div>
        </div>

        <div className="flex h-[calc(100vh-8rem)] flex-col overflow-y-auto">
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === item.href 
                      ? "bg-[#1d503a]/10 text-[#1d503a]" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#1d503a]"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    pathname === item.href 
                      ? "text-[#1d503a]" 
                      : "text-gray-500"
                  )} />
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t p-4 space-y-2">
            <Button 
              variant="outline"
              className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-[#1d503a]"
              asChild
            >
              <Link href="/">
                <ExternalLink className="mr-2 h-4 w-4" />
                Exit to Main Site
              </Link>
            </Button>
            
            <Button
              variant="default"
              className="w-full justify-start bg-[#1d503a] hover:bg-[#1d503a]/90"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Content padding for desktop */}
      <div className="md:pl-64" />
    </>
  )
}
