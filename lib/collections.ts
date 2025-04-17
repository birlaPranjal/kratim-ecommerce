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
  const collections = await db.collection("collections").find().sort({ name: 1 }).toArray()
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

export async function createCollection(collectionData: Omit<Collection, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()
  
  const now = new Date()
  const newCollection = {
    ...collectionData,
    createdAt: now,
    updatedAt: now
  }
  
  const result = await db.collection("collections").insertOne(newCollection)
  
  return {
    ...newCollection,
    _id: result.insertedId.toString()
  }
}

export async function updateCollection(id: string, collectionData: Partial<Omit<Collection, "_id" | "createdAt">>) {
  const { db } = await connectToDatabase()
  
  const updateData = {
    ...collectionData,
    updatedAt: new Date()
  }
  
  await db.collection("collections").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  )
  
  return await getCollectionById(id)
}

export async function deleteCollection(id: string) {
  const { db } = await connectToDatabase()
  await db.collection("collections").deleteOne({ _id: new ObjectId(id) })
  return { success: true }
}

export async function getProductsByCollection(collectionSlug: string) {
  const { db } = await connectToDatabase()
  const collection = await getCollectionBySlug(collectionSlug)
  
  if (!collection) {
    return []
  }
  
  const products = await db
    .collection("products")
    .find({ collection: collection._id })
    .toArray()
  
  return JSON.parse(JSON.stringify(products))
} 