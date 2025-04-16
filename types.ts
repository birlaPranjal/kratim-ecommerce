// Product types
export interface Product {
  _id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  featured?: boolean
  inventory: number
  material?: string
  dimensions?: string
  features?: string[]
  createdAt?: string | Date
  updatedAt?: string | Date
}

// Collection types
export interface Collection {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  products?: Product[]
  createdAt?: string | Date
  updatedAt?: string | Date
} 