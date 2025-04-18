import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export async function getCategories() {
  const { db } = await connectToDatabase()
  const categories = await db.collection("categories").find().sort({ name: 1 }).toArray()
  return JSON.parse(JSON.stringify(categories))
}

export async function getCategoryBySlug(slug: string) {
  const { db } = await connectToDatabase()
  const category = await db.collection("categories").findOne({ slug })
  return JSON.parse(JSON.stringify(category))
}

export async function getCategoryById(id: string) {
  const { db } = await connectToDatabase()
  const category = await db.collection("categories").findOne({ _id: new ObjectId(id) })
  return JSON.parse(JSON.stringify(category))
}

export async function createCategory(categoryData: Omit<Category, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()
  
  const now = new Date()
  const newCategory = {
    ...categoryData,
    createdAt: now,
    updatedAt: now
  }
  
  const result = await db.collection("categories").insertOne(newCategory)
  
  return {
    ...newCategory,
    _id: result.insertedId.toString()
  }
}

export async function updateCategory(id: string, categoryData: Partial<Omit<Category, "_id" | "createdAt">>) {
  try {
    const { db } = await connectToDatabase()
    
    // Prepare update data by removing fields that should not be directly updated
    const updateData = { ...categoryData };
    
    // Remove _id field if it exists to prevent MongoDB error
    if ('_id' in updateData) {
      delete updateData._id;
    }
    
    // Remove createdAt if it exists since we shouldn't modify it
    if ('createdAt' in updateData) {
      delete updateData.createdAt;
    }
    
    // Add updated timestamp
    updateData.updatedAt = new Date();
    
    console.log(`Updating category ${id} with data:`, JSON.stringify(updateData, null, 2));
    
    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    console.log(`Update result:`, result);
    
    if (result.matchedCount === 0) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    return getCategoryById(id);
  } catch (error) {
    console.error("Error in updateCategory:", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  const { db } = await connectToDatabase()
  await db.collection("categories").deleteOne({ _id: new ObjectId(id) })
  return { success: true }
}

export async function getProductsByCategory(categorySlug: string) {
  const { db } = await connectToDatabase()
  const category = await getCategoryBySlug(categorySlug)
  
  if (!category) {
    return []
  }
  
  const products = await db
    .collection("products")
    .find({ category: category.name })
    .toArray()
  
  return JSON.parse(JSON.stringify(products))
} 