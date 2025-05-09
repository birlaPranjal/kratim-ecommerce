import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface ContactSubmission {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "read" | "replied"
  createdAt: Date
  updatedAt: Date
}

export async function getContactSubmissions() {
  try {
    const { db } = await connectToDatabase()
    const submissions = await db
      .collection("contactSubmissions")
      .find()
      .sort({ createdAt: -1 })
      .toArray()
    return JSON.parse(JSON.stringify(submissions))
  } catch (error) {
    console.error("Error in getContactSubmissions:", error)
    return []
  }
}

export async function getContactSubmissionById(id: string) {
  if (!id) return null

  try {
    const { db } = await connectToDatabase()
    const submission = await db
      .collection("contactSubmissions")
      .findOne({ _id: new ObjectId(id) })
    return submission ? JSON.parse(JSON.stringify(submission)) : null
  } catch (error) {
    console.error("Error in getContactSubmissionById:", error)
    return null
  }
}

export async function createContactSubmission(submissionData: Omit<ContactSubmission, "_id" | "createdAt" | "updatedAt" | "status">) {
  try {
    const { db } = await connectToDatabase()
    
    const now = new Date()
    const newSubmission = {
      ...submissionData,
      status: "new", // Default status
      createdAt: now,
      updatedAt: now
    }
    
    const result = await db.collection("contactSubmissions").insertOne(newSubmission)
    
    return {
      ...newSubmission,
      _id: result.insertedId.toString()
    }
  } catch (error) {
    console.error("Error in createContactSubmission:", error)
    throw error
  }
}

export async function updateContactSubmissionStatus(id: string, status: "new" | "read" | "replied") {
  if (!id) throw new Error("No submission ID provided")
  
  try {
    const { db } = await connectToDatabase()
    
    await db.collection("contactSubmissions").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    )
    
    return await getContactSubmissionById(id)
  } catch (error) {
    console.error("Error in updateContactSubmissionStatus:", error)
    return null
  }
}

export async function deleteContactSubmission(id: string) {
  if (!id) return { success: false, message: "No submission ID provided" }
  
  try {
    const { db } = await connectToDatabase()
    await db.collection("contactSubmissions").deleteOne({ _id: new ObjectId(id) })
    return { success: true }
  } catch (error) {
    console.error("Error in deleteContactSubmission:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    }
  }
} 