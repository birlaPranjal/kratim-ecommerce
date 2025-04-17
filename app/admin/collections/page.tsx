"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

// Define the Collection interface
interface Collection {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  featured?: boolean;
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch('/api/collections')
        if (res.ok) {
          const data = await res.json()
          setCollections(data)
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }: { row: { original: Collection } }) => {
        const image = row.original.image || "/placeholder.svg"
        return (
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src={image}
              alt={row.original.name}
              className="object-cover"
              fill
              sizes="48px"
            />
          </div>
        )
      }
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }: { row: { original: Collection } }) => (
        row.original.featured ? 
          <Badge variant="secondary">Featured</Badge> : 
          null
      )
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Collection } }) => (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/collections/${row.original._id}`}>
              Edit
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/collections/${row.original.slug}`} target="_blank">
              View
            </Link>
          </Button>
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading collections...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Collections</h1>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/admin/collections/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Collection
          </Link>
        </Button>
      </div>

      <Card>
        <DataTable 
          columns={columns} 
          data={collections} 
          searchKey="name" 
          placeholder="Search collections..."
        />
      </Card>
    </div>
  )
} 