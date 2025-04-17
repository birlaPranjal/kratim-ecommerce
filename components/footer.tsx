import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-[#1d503a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-serif font-bold flex items-center">
              <img src="/logo-mono.png" alt="Kratim" className="h-10 mr-2" />
              KRATIM
            </h3>
            <p className="mb-4 text-gray-300">
              Crafting timeless luxury jewelry with exquisite craftsmanship and elegant designs since 1990.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/collections" className="text-gray-300 hover:text-white">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rings" className="text-gray-300 hover:text-white">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="text-gray-300 hover:text-white">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="text-gray-300 hover:text-white">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="text-gray-300 hover:text-white">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">Newsletter</h3>
            <p className="mb-4 text-gray-300">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-[#164430] border-[#0c3020] text-white placeholder:text-gray-400"
              />
              <Button className="bg-[#c8a25d] hover:bg-[#b08d4a] text-white">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-[#164430] pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Kratim. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
