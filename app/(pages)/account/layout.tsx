"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ShoppingBag,
  User,
  LogOut,
  MapPin,
  Home,
  Lock,
  Heart,
  CreditCard,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Navigation items for the sidebar
const navItems = [
  {
    title: "Dashboard",
    href: "/account",
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: "Profile",
    href: "/account/profile",
    icon: User
  },
  {
    title: "Addresses",
    href: "/account/addresses",
    icon: MapPin
  },
  {
    title: "Orders",
    href: "/account/orders",
    icon: ShoppingBag
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
    icon: Heart
  },
  {
    title: "Payment Methods",
    href: "/account/payment",
    icon: CreditCard
  },
  {
    title: "Change Password",
    href: "/account/password",
    icon: Lock
  }
]

export default function AccountLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
    }
  }, [user, router])
  
  if (!user) {
    return null
  }
  
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"
    
  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }
  
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="md:hidden border-b sticky top-0 z-30 bg-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                <div className="border-b p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    <nav className="grid gap-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileNavOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                            isActive(item.href, item.exact) && "bg-accent text-accent-foreground font-medium"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                          {isActive(item.href, item.exact) && (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 w-full text-left transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </nav>
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">My Account</h1>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.image || ""} alt={user.name || "User"} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - hidden on mobile */}
        <aside className="hidden md:flex flex-col w-64 border-r shrink-0">
          <div className="p-6 border-b">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
              </Avatar>
              <h2 className="font-medium">{user.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            </div>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive(item.href, item.exact) && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                  {isActive(item.href, item.exact) && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t mt-auto">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 