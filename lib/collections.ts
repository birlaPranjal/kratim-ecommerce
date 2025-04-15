import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Collection {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getCollections() {
  const { db } = await connectToDatabase()
  const collections = await db.collection("collections").find().sort({ createdAt: -1 }).toArray()
  return JSON.parse(JSON.stringify(collections))
}

export async function getCollectionBySlug(slug: string) {
  const { db } = await connectToDatabase()
  const collection = await db.collection("collections").findOne({ slug })
  return JSON.parse(JSON.stringify(collection))
}

export async function getCollectionById(id: string) {
  const { db } = await connectToDatabase()
  const collection = await db.collection("collections").findOne({ _id: new ObjectId(id) })
  return JSON.parse(JSON.stringify(collection))
}

export async function getFeaturedCollections(limit = 3) {
  const { db } = await connectToDatabase()
  const collections = await db
    .collection("collections")
    .find({ featured: true })
    .limit(limit)
    .toArray()
  return JSON.parse(JSON.stringify(collections))
}

export async function getProductsByCollection(collectionSlug: string) {
  const { db } = await connectToDatabase()
  const collection = await getCollectionBySlug(collectionSlug)
  
  if (!collection) {
    return []
  }
  
  const products = await db
    .collection("products")
    .find({ category: collection.name })
    .toArray()
  
  return JSON.parse(JSON.stringify(products))
} 