import { NextResponse } from "next/server"
import { createProduct, getProducts } from "@/lib/products"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || undefined
    const category = searchParams.get("category") || undefined
    const sort = searchParams.get("sort") || undefined

    const products = await getProducts({ query, category, sort })
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const product = await createProduct(data)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
} 