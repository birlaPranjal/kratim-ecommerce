"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// This should match the Product type from lib/products.ts
interface Product {
  _id: string
  id: string
  name: string
  description?: string
  price: number
  images: string[]
  category?: string
  slug?: string
  inventory?: number
  stock?: number
}

interface ProductsTableProps {
  products: Product[]
}

// Utility function to create a slug from product name (fallback)
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id)
    setDeleteDialogOpen(true)
  }

  const deleteProduct = async () => {
    if (!selectedProductId) return

    try {
      setIsDeleting(selectedProductId)
      const response = await fetch(`/api/products/${selectedProductId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
      setDeleteDialogOpen(false)
    }
  }

  // Get product ID for API calls (could be _id or id depending on data structure)
  const getProductId = (product: Product): string => {
    return product.id || product._id;
  }

  // Get product slug for URLs or generate one from name if missing
  const getProductSlug = (product: Product): string => {
    if (product.slug) return product.slug;
    return `products/${product._id || product.id}`;
  }

  // Get inventory/stock count
  const getInventoryCount = (product: Product): number => {
    // Some products might use inventory, others might use stock
    return product.inventory !== undefined ? product.inventory : 
           product.stock !== undefined ? product.stock : 0;
  }

  // Get inventory status badge
  const getInventoryStatus = (count: number) => {
    if (count <= 0) {
      return <Badge variant="destructive">Out of stock</Badge>;
    } else if (count < 10) {
      return <Badge variant="outline" className="border-amber-500 text-amber-500">Low stock: {count}</Badge>;
    } else {
      return <Badge variant="outline" className="border-green-500 text-green-500">In stock: {count}</Badge>;
    }
  };

  // Desktop view - Table
  const DesktopView = () => (
    <Table className="hidden md:table">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead className="w-[150px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={getProductId(product)}>
            <TableCell>
              {product.images && product.images.length > 0 ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>₹{product.price.toFixed(2)}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{getInventoryStatus(getInventoryCount(product))}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  asChild
                  title="Preview product"
                >
                  <Link href={`/shop/${getProductSlug(product)}`} target="_blank">
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  asChild
                  title="Edit product"
                >
                  <Link href={`/admin/products/${getProductId(product)}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteClick(getProductId(product))}
                  disabled={isDeleting === getProductId(product)}
                  title="Delete product"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // Mobile view - Cards
  const MobileView = () => (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {products.map((product) => (
        <Card key={getProductId(product)}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {product.images && product.images.length > 0 ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                  No image
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{product.category}</p>
                <div className="mt-2">{getInventoryStatus(getInventoryCount(product))}</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/shop/${getProductSlug(product)}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${getProductId(product)}`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteClick(getProductId(product))}
                    disabled={isDeleting === getProductId(product)}
                    className="text-red-500"
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <>
      <DesktopView />
      <MobileView />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product 
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteProduct}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting !== null}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

