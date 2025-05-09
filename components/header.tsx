"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, Menu, ChevronDown, Heart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

// Define TypeScript interfaces for category and collection
interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function Header() {
  const { cart } = useCart()
  const { user, signOut } = useAuth()
  const { wishlist } = useWishlist()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)
  const wishlistItemsCount = wishlist?.length || 0

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [categoriesRes, collectionsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/collections')
        ])
        
        if (categoriesRes.ok && collectionsRes.ok) {
          const [categoriesData, collectionsData] = await Promise.all([
            categoriesRes.json(),
            collectionsRes.json()
          ])
          
          setCategories(categoriesData)
          setCollections(collectionsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?query=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Mobile drawer menu items
  const mobileNavItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Wishlist", href: "/wishlist" },
  ]

  // Enhanced list item with image
  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { 
      title: string; 
      image?: string;
    }
  >(({ className, title, image, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "flex gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            {image && (
              <div className="w-12 h-12 rounded-md overflow-hidden relative flex-shrink-0">
                <Image 
                  src={image || "/placeholder.jpg"} 
                  alt={title}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            )}
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    )
  })
  ListItem.displayName = "ListItem"

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      {/* Free Shipping Banner */}
      <section className="bg-[#1d503a] text-white py-1 text-center">
        <div className="container mx-auto px-1 sm:px-6 lg:px-8">
          <p className="text-sm sm:text-base">
            🚚 Free Shipping Anywhere in India for orders above ₹499
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="flex flex-col gap-6 py-6">
                  <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
                    <img src="/logo.png" alt="Kratim" className="h-12" />
                  </Link>

                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  <nav className="flex flex-col gap-2">
                    {mobileNavItems.map((link) => (
                      <Link key={link.name} href={link.href} className="py-2 text-gray-700 hover:text-[#1d503a]">
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto flex flex-col gap-2">
                    {user ? (
                      <>
                        <div className="flex items-center gap-2 py-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.image || ""} alt={user.name || ""} />
                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                        {user.role === "admin" && (
                          <Link href="/admin" className="py-2 text-gray-700 hover:text-[#1d503a]">
                            Admin Dashboard
                          </Link>
                        )}
                        <Link href="/account" className="py-2 text-gray-700 hover:text-[#1d503a]">
                          My Account
                        </Link>
                        <button onClick={() => signOut()} className="py-2 text-left text-gray-700 hover:text-[#1d503a]">
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/signin" className="py-2 text-gray-700 hover:text-[#1d503a]">
                          Sign In
                        </Link>
                        <Link href="/auth/signup" className="py-2 text-gray-700 hover:text-[#1d503a]">
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
              <img src="/logo.png" alt="Kratim" className="h-12" />
            </Link>
          </div>

          {/* Centered Navigation */}
          <div className="hidden md:flex justify-center flex-1">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/shop" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Shop
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                      {isLoading ? (
                        <li className="col-span-2 p-4 text-center">Loading categories...</li>
                      ) : categories.length > 0 ? (
                        <>
                          {categories.map((category) => (
                            <ListItem
                              key={category._id}
                              title={category.name}
                              href={`/categories/${category.slug}`}
                              image={category.image || "/placeholder.jpg"}
                            >
                              {category.description?.substring(0, 60) || "Shop our beautiful collection"}
                            </ListItem>
                          ))}
                        </>
                      ) : (
                        <li className="col-span-2 p-4 text-center">No categories available</li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                      {isLoading ? (
                        <li className="col-span-2 p-4 text-center">Loading collections...</li>
                      ) : collections.length > 0 ? (
                        <>
                          {collections.map((collection) => (
                            <ListItem
                              key={collection._id}
                              title={collection.name}
                              href={`/collections/${collection.slug}`}
                              image={collection.image || "/placeholder.jpg"}
                            >
                              {collection.description?.substring(0, 60) || "Explore our curated collection"}
                            </ListItem>
                          ))}
                        </>
                      ) : (
                        <li className="col-span-2 p-4 text-center">No collections available</li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/#contact" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4 ml-auto">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                className="w-[200px] pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ""} alt={user.name || ""} />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">My Wishlist</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="gap-1">
                <Link href="/auth/signin">
                  <User className="h-4 w-4" />
                  <span>Sign in</span>
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c8a25d] text-xs font-medium text-white">
                    {cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c8a25d] text-xs font-medium text-white">
                    {wishlistItemsCount}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
