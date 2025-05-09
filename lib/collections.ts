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
  try {
  const { db } = await connectToDatabase()
  const collections = await db.collection("collections").find().sort({ name: 1 }).toArray()
  return JSON.parse(JSON.stringify(collections))
  } catch (error) {
    console.error("Error in getCollections:", error)
    return []
  }
}

export async function getCollectionBySlug(slug: string) {
  if (!slug) return null
  
  try {
  const { db } = await connectToDatabase()
  const collection = await db.collection("collections").findOne({ slug })
    return collection ? JSON.parse(JSON.stringify(collection)) : null
  } catch (error) {
    console.error("Error in getCollectionBySlug:", error)
    return null
  }
}

export async function getCollectionById(id: string) {
  if (!id) return null
  
  const { db } = await connectToDatabase()
  try {
  const collection = await db.collection("collections").findOne({ _id: new ObjectId(id) })
    return collection ? JSON.parse(JSON.stringify(collection)) : null
  } catch (error) {
    console.error("Error in getCollectionById:", error)
    return null
  }
}

export async function getFeaturedCollections(limit = 3) {
  try {
  const { db } = await connectToDatabase()
  const collections = await db
    .collection("collections")
    .find({ featured: true })
    .limit(limit)
    .toArray()
  return JSON.parse(JSON.stringify(collections))
  } catch (error) {
    console.error("Error in getFeaturedCollections:", error)
    return []
  }
}

export async function createCollection(collectionData: Omit<Collection, "_id" | "createdAt" | "updatedAt">) {
  try {
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
  } catch (error) {
    console.error("Error in createCollection:", error)
    throw error
  }
}

export async function updateCollection(id: string, collectionData: Partial<Omit<Collection, "_id" | "createdAt">>) {
  if (!id) throw new Error("No collection ID provided")
  
  const { db } = await connectToDatabase()
  
  const updateData = {
    ...collectionData,
    updatedAt: new Date()
  }
  
  try {
  await db.collection("collections").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  )
  
  return await getCollectionById(id)
  } catch (error) {
    console.error("Error in updateCollection:", error)
    return null
  }
}

export async function deleteCollection(id: string) {
  if (!id) return { success: false, message: "No collection ID provided" }
  
  const { db } = await connectToDatabase()
  try {
  await db.collection("collections").deleteOne({ _id: new ObjectId(id) })
  return { success: true }
  } catch (error) {
    console.error("Error in deleteCollection:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getProductsByCollection(collectionSlugOrId: string) {
  if (!collectionSlugOrId) return []
  
  const { db } = await connectToDatabase()
  let collection

  try {
    // First try to find by slug
    collection = await getCollectionBySlug(collectionSlugOrId)

    // If not found by slug, try by ID
    if (!collection) {
      try {
        collection = await getCollectionById(collectionSlugOrId)
      } catch (error) {
        // Invalid ObjectId or other error
        console.error("Error trying to find collection by ID:", error)
      }
    }
  
  if (!collection) {
    return []
  }
  
  const products = await db
    .collection("products")
    .find({ collection: collection._id })
    .toArray()
  
  return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error("Error in getProductsByCollection:", error)
    return []
  }
} 