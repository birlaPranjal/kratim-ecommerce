import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import { hash } from "bcryptjs"

export interface User {
  _id: string
  name: string
  email: string
  password?: string
  image?: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
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
  
  const totalUsers = await db.collection("users").countDocuments()
  const adminUsers = await db.collection("users").countDocuments({ role: "admin" })
  
  // New users this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const newUsers = await db.collection("users").countDocuments({
    createdAt: { $gte: startOfMonth }
  })
  
  return {
    totalUsers,
    adminUsers,
    newUsers
  }
} 