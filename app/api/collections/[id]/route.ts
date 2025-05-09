import { NextResponse } from "next/server"
import { getCollectionById, updateCollection, deleteCollection } from "@/lib/collections"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = await db.collection('collections').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(collection)
  } catch (error) {
    console.error("Error fetching collection:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const collectionData = await request.json()
    const collection = await updateCollection(params.id, collectionData)
    
    return NextResponse.json(collection)
  } catch (error) {
    console.error("Error updating collection:", error)
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    await deleteCollection(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting collection:", error)
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    )
  }
} 