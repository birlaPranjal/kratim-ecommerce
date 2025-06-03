import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  collection?: string
  collectionName?: string
  featured: boolean
  stock: number
  inventory: number
  material?: string
  dimensions?: string
  features?: string[]
  variants?: string[]
  createdAt: Date
  updatedAt: Date
}

export async function getProducts({
  category,
  collection,
  query,
  sort,
  minPrice,
  maxPrice,
  limit = 100,
  skip = 0,
}: {
  category?: string
  collection?: string
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

  // Always use aggregation pipeline for consistent collectionName lookup
  let pipeline = []
  
  // Match stage - start with our filters
  let matchStage: any = {}
  
  if (category) {
    matchStage.category = category
  }
  
  if (query) {
    matchStage.$or = [
      { name: { $regex: query, $options: "i" } }, 
      { description: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } }
    ]
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    matchStage.price = {}
    if (minPrice !== undefined) {
      matchStage.price.$gte = minPrice
    }
    if (maxPrice !== undefined) {
      matchStage.price.$lte = maxPrice
    }
  }
  
  // Handle collection filtering
  if (collection) {
    try {
      // Try to convert to ObjectId for proper matching
      matchStage.collection = new ObjectId(collection)
    } catch (error) {
      console.error("Invalid collection ObjectId:", error)
      matchStage.collection = collection
    }
  }
  
  // Add match stage to pipeline
  pipeline.push({ $match: matchStage })
  
  // Add lookup stage to get collection names
  pipeline.push({
    $lookup: {
      from: "collections",
      let: { collectionId: "$collection" },
      pipeline: [
        { 
          $match: { 
            $expr: { 
              $eq: ["$_id", { $toObjectId: { $ifNull: [{ $toString: "$$collectionId" }, "000000000000000000000000"] } }] 
            } 
          } 
        }
      ],
      as: "collectionInfo"
    }
  })
  
  // Add field for collection name
  pipeline.push({
    $addFields: {
      collectionName: {
        $cond: {
          if: { $gt: [{ $size: "$collectionInfo" }, 0] },
          then: { $arrayElemAt: ["$collectionInfo.name", 0] },
          else: null
        }
      }
    }
  })
  
  // Sort stage
  let sortStage: any = {}
  
  switch (sort) {
    case "price-asc":
      sortStage.price = 1
      break
    case "price-desc":
      sortStage.price = -1
      break
    case "name-asc":
      sortStage.name = 1
      break
    case "name-desc":
      sortStage.name = -1
      break
    case "category-asc":
      sortStage.category = 1
      break
    case "category-desc":
      sortStage.category = -1
      break
    case "collection-asc":
      sortStage.collectionName = 1
      break
    case "collection-desc":
      sortStage.collectionName = -1
      break
    case "inventory-asc":
      sortStage.inventory = 1
      sortStage.stock = 1
      break
    case "inventory-desc":
      sortStage.inventory = -1
      sortStage.stock = -1
      break
    case "newest":
      sortStage.createdAt = -1
      break
    default:
      sortStage.createdAt = -1
  }
  
  pipeline.push({ $sort: sortStage })
  
  // Add pagination
  pipeline.push({ $skip: skip })
  pipeline.push({ $limit: limit })
  
  // Remove temporary fields
  pipeline.push({ $project: { collectionInfo: 0 } })
  
  // Execute the pipeline
  const products = await db.collection("products").aggregate(pipeline).toArray()
  
  // Return serialized products
  return JSON.parse(JSON.stringify(products))
}

export async function getProductById(id: string) {
  const { db } = await connectToDatabase()
  const product = await db.collection("products").findOne({ _id: new ObjectId(id) })
  
  if (product && product.collection) {
    const collection = await db.collection("collections").findOne({ _id: new ObjectId(product.collection) })
    if (collection) {
      product.collectionName = collection.name
    }
  }
  
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
  try {
    const { db } = await connectToDatabase()
    
    // Prepare update data by removing fields that should not be directly updated
    const updateData = { ...productData };
    
    // Remove _id field if it exists to prevent MongoDB error
    if ('_id' in updateData) {
      delete updateData._id;
    }
    
    // Add updated timestamp
    updateData.updatedAt = new Date();
    
    console.log(`Updating product ${id} with data:`, JSON.stringify(updateData, null, 2));
    
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    console.log(`Update result:`, result);
    
    if (result.matchedCount === 0) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return getProductById(id);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  const { db } = await connectToDatabase()
  
  await db.collection("products").deleteOne({ _id: new ObjectId(id) })
  
  return { success: true }
}

export async function getProductStats() {
  const { db } = await connectToDatabase()
  
  // Total products count
  const totalProducts = await db.collection("products").countDocuments()
  
  // Products with low stock (less than 10 items)
  const lowStock = await db.collection("products").countDocuments({
    stock: { $lt: 10, $gt: 0 }
  })
  
  // Out of stock products
  const outOfStock = await db.collection("products").countDocuments({
    stock: { $lte: 0 }
  })
  
  return {
    totalProducts,
    lowStock,
    outOfStock
  }
}
