import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  featured: boolean
  stock: number
  variants?: string[]
  createdAt: Date
  updatedAt: Date
}

export async function getProducts({
  category,
  query,
  sort,
  minPrice,
  maxPrice,
  limit = 100,
  skip = 0,
}: {
  category?: string
  query?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  skip?: number
} = {}) {
  const { db } = await connectToDatabase()

  // Build filter
  const filter: any = {}

  if (category) {
    filter.category = category
  }

  if (query) {
    filter.$or = [{ name: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }]
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {}
    if (minPrice !== undefined) {
      filter.price.$gte = minPrice
    }
    if (maxPrice !== undefined) {
      filter.price.$lte = maxPrice
    }
  }

  // Build sort
  const sortOptions: any = {}

  if (sort === "price-asc") {
    sortOptions.price = 1
  } else if (sort === "price-desc") {
    sortOptions.price = -1
  } else if (sort === "newest") {
    sortOptions.createdAt = -1
  } else {
    // Default sort
    sortOptions.createdAt = -1
  }

  const products = await db.collection("products").find(filter).sort(sortOptions).skip(skip).limit(limit).toArray()

  return JSON.parse(JSON.stringify(products))
}

export async function getProductById(id: string) {
  const { db } = await connectToDatabase()
  const product = await db.collection("products").findOne({ _id: new ObjectId(id) })
  return JSON.parse(JSON.stringify(product))
}

export async function getFeaturedProducts(limit = 4) {
  const { db } = await connectToDatabase()
  const products = await db.collection("products").find({ featured: true }).limit(limit).toArray()
  return JSON.parse(JSON.stringify(products))
}

export async function getRelatedProducts(category: string, productId: string, limit = 4) {
  const { db } = await connectToDatabase()
  const products = await db
    .collection("products")
    .find({ category, _id: { $ne: new ObjectId(productId) } })
    .limit(limit)
    .toArray()
  return JSON.parse(JSON.stringify(products))
}

export async function createProduct(productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()
  
  const now = new Date()
  const result = await db.collection("products").insertOne({
    ...productData,
    createdAt: now,
    updatedAt: now
  })
  
  return {
    _id: result.insertedId.toString(),
    ...productData,
    createdAt: now,
    updatedAt: now
  }
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, "_id" | "createdAt" | "updatedAt">>) {
  const { db } = await connectToDatabase()
  
  await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...productData, updatedAt: new Date() } }
  )
  
  return getProductById(id)
}

export async function deleteProduct(id: string) {
  const { db } = await connectToDatabase()
  
  await db.collection("products").deleteOne({ _id: new ObjectId(id) })
  
  return { success: true }
}

export async function getProductStats() {
  const { db } = await connectToDatabase()
  
  const totalProducts = await db.collection("products").countDocuments()
  const lowStock = await db.collection("products").countDocuments({ stock: { $lt: 10 } })
  const categories = await db.collection("products").distinct("category")
  
  return {
    totalProducts,
    lowStock,
    categories: categories.length
  }
}
