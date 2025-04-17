import { NextResponse } from "next/server"
import { getCollections, createCollection } from "@/lib/collections"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const collections = await getCollections()
    return NextResponse.json(collections)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const collectionData = await request.json()
    
    if (!collectionData.name || !collectionData.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      )
    }
    
    const collection = await createCollection(collectionData)
    return NextResponse.json(collection)
  } catch (error) {
    console.error("Error creating collection:", error)
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    )
  }
} 