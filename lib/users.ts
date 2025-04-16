import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import { hash } from "bcryptjs"
import { Order } from "./orders"

export interface Address {
  _id?: string
  name: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export interface User {
  _id: string
  name: string
  email: string
  password?: string
  image?: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
  orders?: string[] // Array of order IDs
  addresses?: Address[] // Array of saved addresses
}

export async function getUsers() {
  const { db } = await connectToDatabase()
  return db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getUserById(id: string) {
  const { db } = await connectToDatabase()
  return db
    .collection("users")
    .findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    )
}

export async function getUserByEmail(email: string) {
  const { db } = await connectToDatabase()
  return db.collection("users").findOne({ email })
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  image?: string
  role?: "user" | "admin"
}) {
  const { db } = await connectToDatabase()
  
  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email)
  if (existingUser) {
    throw new Error("User already exists")
  }
  
  // Hash the password
  const hashedPassword = await hash(userData.password, 10)
  
  const now = new Date()
  const result = await db.collection("users").insertOne({
    ...userData,
    password: hashedPassword,
    role: userData.role || "user",
    createdAt: now,
    updatedAt: now
  })
  
  const user = await getUserById(result.insertedId.toString())
  return user
}

export async function updateUserRole(id: string, role: "user" | "admin") {
  const { db } = await connectToDatabase()
  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: { role, updatedAt: new Date() } }
  )
  return getUserById(id)
}

export async function deleteUser(id: string) {
  const { db } = await connectToDatabase()
  await db.collection("users").deleteOne({ _id: new ObjectId(id) })
  return { success: true }
}

export async function getUserStats() {
  const { db } = await connectToDatabase()
  
  // Total users count
  const totalUsers = await db.collection("users").countDocuments()
  
  // Getting new users from the current month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const newUsers = await db.collection("users").countDocuments({
    createdAt: { $gte: startOfMonth }
  })
  
  return {
    totalUsers,
    newUsers
  }
}

export async function addUserAddress(userId: string, address: Omit<Address, "_id">) {
  const { db } = await connectToDatabase()
  
  const addressWithId = {
    ...address,
    _id: new ObjectId().toString(),
  }
  
  // If this is the first address or marked as default, set it as default
  if (address.isDefault) {
    // First reset any existing default address
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId), "addresses.isDefault": true },
      { $set: { "addresses.$.isDefault": false } }
    )
  }
  
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { 
      $push: { addresses: addressWithId as any },
      $set: { updatedAt: new Date() }
    }
  )
  
  return getUserById(userId)
}

export async function updateUserAddress(userId: string, addressId: string, addressData: Partial<Address>) {
  const { db } = await connectToDatabase()
  
  // If setting this address as default, unset any existing default
  if (addressData.isDefault) {
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId), "addresses.isDefault": true },
      { $set: { "addresses.$.isDefault": false } }
    )
  }
  
  const updateFields: Record<string, any> = {}
  
  // Create update fields for each property in addressData
  Object.entries(addressData).forEach(([key, value]) => {
    updateFields[`addresses.$.${key}`] = value
  })
  
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId), "addresses._id": addressId },
    { 
      $set: { 
        ...updateFields,
        updatedAt: new Date() 
      } 
    }
  )
  
  return getUserById(userId)
}

export async function deleteUserAddress(userId: string, addressId: string) {
  const { db } = await connectToDatabase()
  
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { 
      $pull: { addresses: { _id: addressId } as any },
      $set: { updatedAt: new Date() }
    }
  )
  
  return getUserById(userId)
}

export async function setDefaultAddress(userId: string, addressId: string) {
  const { db } = await connectToDatabase()
  
  // First reset any existing default address
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId), "addresses.isDefault": true },
    { $set: { "addresses.$.isDefault": false } }
  )
  
  // Then set the new default address
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId), "addresses._id": addressId },
    { $set: { "addresses.$.isDefault": true } }
  )
  
  return getUserById(userId)
}

export async function addOrderToUser(userId: string, orderId: string) {
  const { db } = await connectToDatabase()
  
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { 
      $push: { orders: orderId as any },
      $set: { updatedAt: new Date() }
    }
  )
  
  return getUserById(userId)
} 